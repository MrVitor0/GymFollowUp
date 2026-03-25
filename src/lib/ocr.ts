import Tesseract from "tesseract.js";
import type { BodyLog } from "@/types/models";

/**
 * Extrai dados de composição corporal de uma screenshot do RelaxFit.
 */
export async function parseRelaxFitImage(
  image: File,
  onProgress?: (progress: number) => void,
): Promise<Partial<BodyLog> & { parsedDate?: string }> {
  const { data } = await Tesseract.recognize(image, "por", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  return parseOcrText(data.text);
}

/**
 * Mapeamento label OCR → campo do BodyLog.
 * IMPORTANTE: padrões compostos (ex: "Peso corporal ideal") devem vir
 * ANTES dos genéricos (ex: "Peso") para evitar match errado.
 */
const FIELD_MAP: [RegExp, keyof BodyLog | "parsedDate"][] = [
  // Compostos de "Peso" primeiro
  [/peso\s*corporal\s*ideal/i, "idealWeight"],
  [/peso\s*d[aeo]\s*[aá]gua/i, "waterMass"],
  // Compostos de "Massa"
  [/massa\s*corporal\s*magra/i, "leanBodyMass"],
  [/massa\s*d[aeo]\s*prote[ií]na/i, "proteinMass"],
  [/massa\s*muscular/i, "muscleMass"],
  [/massa\s*[oó]ssea/i, "boneMass"],
  [/massa\s*gorda/i, "fatMass"],
  // Compostos de "Gordura"
  [/gordura\s*corporal/i, "bodyFat"],
  [/gordura\s*subcut[aâ]nea/i, "subcutaneousFat"],
  [/gordura\s*visceral/i, "visceralFat"],
  // Genéricos (só casam se os compostos acima não casaram)
  // Sem \b no início — OCR pode colar caracteres de ícones ao label (ex: "ÊPeso")
  [/peso/i, "weight"],
  [/imc\b|^bmi/i, "bmi"],
  [/taxa\s*muscular/i, "muscle"],
  [/[aá]gua\s*corporal/i, "water"],
  [/m[uú]sculo\s*esquel[eé]tico/i, "skeletalMuscle"],
  [/prote[ií]na/i, "protein"],
  [/tmb|kcal/i, "bmr"],
  [/idade\s*d[eo]\s*corpo/i, "bodyAge"],
  [/n[ií]vel\s*d[eo]?\s*obesidade/i, "obesityLevel"],
  [/tipo\s*d[eo]\s*corpo/i, "bodyType"],
];

/** Limites razoáveis por campo — se o valor estiver fora, tenta corrigir decimal */
const SANE_BOUNDS: Partial<Record<string, [number, number]>> = {
  weight: [20, 300],
  bmi: [10, 60],
  bodyFat: [1, 70],
  muscle: [20, 90],
  leanBodyMass: [20, 200],
  subcutaneousFat: [1, 60],
  visceralFat: [1, 60],
  water: [20, 80],
  skeletalMuscle: [10, 70],
  muscleMass: [10, 150],
  boneMass: [0.5, 15],
  protein: [3, 30],
  bmr: [500, 5000],
  bodyAge: [5, 120],
  fatMass: [1, 100],
  waterMass: [10, 150],
  proteinMass: [1, 50],
  idealWeight: [30, 200],
};

const TEXT_FIELDS = new Set(["obesityLevel", "bodyType"]);

/** Extrai número de uma string (ex: "83.8 kg" → 83.8) */
function extractNumber(text: string): number | undefined {
  const cleaned = text.replace(",", ".").replace(/(\d)\s+(\d)/g, "$1$2");
  const match = cleaned.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : undefined;
}

/** Sanitiza valor numérico: corrige decimais perdidas pelo OCR e arredonda */
function sanitize(value: number, field: string): number {
  const bounds = SANE_BOUNDS[field];
  let v = value;
  if (bounds) {
    const [min, max] = bounds;
    if (v < min || v > max) {
      const d10 = value / 10;
      if (d10 >= min && d10 <= max) v = d10;
      else {
        const d100 = value / 100;
        if (d100 >= min && d100 <= max) v = d100;
      }
    }
  }
  return Math.round(v * 10) / 10;
}

/** Extrai a data do header: "Nome  DD/MM/YYYY HH:MM" */
function extractDate(text: string): string | undefined {
  const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return undefined;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/** Extrai hora do header */
function extractTime(text: string): string | undefined {
  const match = text.match(/(\d{2}:\d{2})/);
  return match ? match[1] : undefined;
}

export function parseOcrText(
  text: string,
): Partial<BodyLog> & { parsedDate?: string } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const result: Record<string, unknown> = {};

  // Extrair data do cabeçalho (primeiras linhas)
  for (const line of lines.slice(0, 5)) {
    const date = extractDate(line);
    if (date) {
      result.parsedDate = date;
      const time = extractTime(line);
      if (time) result.measuredAt = time;
      break;
    }
  }

  // Processar cada linha buscando labels conhecidos
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const [pattern, field] of FIELD_MAP) {
      if (!pattern.test(line)) continue;

      if (result[field] != null) continue;

      if (TEXT_FIELDS.has(field)) {
        const afterLabel = line.replace(pattern, "").trim();
        // Remove fragmentos curtos de OCR (1-3 chars) que precedem o valor real
        const cleaned = afterLabel.replace(/^(\s*\S{1,3}\s+)+/, "").trim();
        if (cleaned.length > 1) {
          result[field] = cleaned;
        } else if (i + 1 < lines.length) {
          const nextCleaned = lines[i + 1]
            .replace(/^(\s*\S{1,3}\s+)+/, "")
            .trim();
          if (nextCleaned.length > 1) {
            result[field] = nextCleaned;
          }
        }
      } else {
        const afterLabel = line.replace(pattern, "");
        let num = extractNumber(afterLabel);
        if (num == null && i + 1 < lines.length) {
          num = extractNumber(lines[i + 1]);
        }
        if (num != null) {
          result[field] = sanitize(num, field);
        }
      }
      break;
    }
  }

  // Fallback: Peso — no layout RelaxFit, o peso SEMPRE fica na linha antes do IMC.
  // O OCR destrói o label "Peso" (vira "E --:." etc.), mas o número "83.8 kg" sobrevive.
  if (result.weight == null) {
    const bmiIdx = lines.findIndex((l) => /imc|bmi/i.test(l));
    if (bmiIdx > 0) {
      // Procurar nas linhas anteriores ao IMC (pode ser 1 ou 2 linhas antes)
      for (let j = bmiIdx - 1; j >= Math.max(0, bmiIdx - 3); j--) {
        const num = extractNumber(lines[j]);
        if (num != null) {
          const s = sanitize(num, "weight");
          if (s >= 20 && s <= 300) {
            result.weight = s;
            break;
          }
        }
      }
    }
  }

  // Fallback: TMB — OCR lê "TMB" como "Tv" e "kcal" como "recai"
  // Procura um número 4 dígitos (500-5000) em linha sem kg/% após a metade do texto
  if (result.bmr == null) {
    const halfIdx = Math.floor(lines.length / 2);
    for (let i = halfIdx; i < lines.length; i++) {
      const line = lines[i];
      if (/kg|%/i.test(line)) continue;
      const num = extractNumber(line);
      if (num != null && num >= 500 && num <= 5000) {
        result.bmr = sanitize(num, "bmr");
        break;
      }
    }
  }

  return result as Partial<BodyLog> & { parsedDate?: string };
}
