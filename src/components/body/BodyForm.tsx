"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { parseRelaxFitJson } from "@/hooks/useBody";
import { parseRelaxFitImage } from "@/lib/ocr";
import { Save, Check, FileJson, X, ImageIcon } from "lucide-react";
import type { BodyLog } from "@/types/models";

interface BodyFormProps {
  latestLog: BodyLog | null;
  onSave: (data: Partial<BodyLog>, dateOverride?: string) => Promise<void>;
  embedded?: boolean;
}

const PREVIEW_FIELDS = [
  { key: "weight", label: "Peso (kg)" },
  { key: "bodyFat", label: "Gordura (%)" },
  { key: "muscle", label: "Taxa Muscular (%)" },
  { key: "water", label: "Água Corporal (%)" },
  { key: "protein", label: "Proteína (%)" },
  { key: "bmi", label: "IMC" },
  { key: "leanBodyMass", label: "Massa Magra (kg)" },
  { key: "subcutaneousFat", label: "Gord. Subcutânea (%)" },
  { key: "visceralFat", label: "Gordura Visceral" },
  { key: "skeletalMuscle", label: "Músc. Esquelético (%)" },
  { key: "muscleMass", label: "Massa Muscular (kg)" },
  { key: "boneMass", label: "Massa Óssea (kg)" },
  { key: "bmr", label: "TMB (kcal)" },
  { key: "bodyAge", label: "Idade do Corpo" },
  { key: "fatMass", label: "Massa Gorda (kg)" },
  { key: "waterMass", label: "Peso da Água (kg)" },
  { key: "proteinMass", label: "Massa Proteína (kg)" },
  { key: "idealWeight", label: "Peso Ideal (kg)" },
  { key: "obesityLevel", label: "Nível Obesidade" },
  { key: "bodyType", label: "Tipo de Corpo" },
] as const;

const MANUAL_FIELDS = [
  { key: "weight", label: "Peso (kg)", placeholder: "85.4" },
  { key: "bodyFat", label: "Gordura (%)", placeholder: "22.1" },
  { key: "muscle", label: "Músculo (%)", placeholder: "42.3" },
  { key: "water", label: "Água (%)", placeholder: "53.8" },
  { key: "protein", label: "Proteína (%)", placeholder: "18.5" },
  { key: "bmi", label: "IMC", placeholder: "26.2" },
] as const;

export function BodyForm({
  latestLog,
  onSave,
  embedded = false,
}: BodyFormProps) {
  const [mode, setMode] = useState<"image" | "json" | "manual">("image");
  const [preview, setPreview] = useState<
    (Partial<BodyLog> & { parsedDate?: string }) | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState<Record<string, string>>(() => {
    if (!latestLog) return {} as Record<string, string>;
    return {
      weight: String(latestLog.weight),
      bodyFat: String(latestLog.bodyFat),
      muscle: String(latestLog.muscle),
      water: String(latestLog.water),
      protein: String(latestLog.protein),
      bmi: String(latestLog.bmi),
    };
  });

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFile(file: File) {
    setError("");

    if (file.type.startsWith("image/")) {
      setIsProcessing(true);
      setOcrProgress(0);
      try {
        const parsed = await parseRelaxFitImage(file, setOcrProgress);
        const fieldCount = Object.keys(parsed).filter(
          (k) => k !== "parsedDate" && k !== "measuredAt",
        ).length;
        if (fieldCount === 0) {
          setError(
            "Não foi possível extrair dados da imagem. Tente outra captura.",
          );
          setIsProcessing(false);
          return;
        }
        setPreview(parsed);
      } catch {
        setError("Erro ao processar a imagem");
      }
      setIsProcessing(false);
      return;
    }

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (typeof json !== "object" || json === null) {
            setError("JSON inválido");
            return;
          }
          const parsed = parseRelaxFitJson(json as Record<string, unknown>);
          parsed.rawJson = json as Record<string, unknown>;
          if (!parsed.weight) {
            setError("Campo 'weight/peso' não encontrado no JSON");
            return;
          }
          setPreview(parsed);
        } catch {
          setError("Erro ao ler o arquivo JSON");
        }
      };
      reader.readAsText(file);
      return;
    }

    setError("Formato não suportado. Use imagem (PNG/JPG) ou JSON.");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  async function handleSavePreview() {
    if (!preview) return;
    setIsSaving(true);
    const { parsedDate, ...data } = preview;
    await onSave(data, parsedDate);
    setIsSaving(false);
    setSaved(true);
    setPreview(null);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSaveManual(e: React.FormEvent) {
    e.preventDefault();
    const data: Partial<BodyLog> = {};
    for (const { key } of MANUAL_FIELDS) {
      const val = parseFloat(fields[key] ?? "");
      if (!isNaN(val) && val > 0) {
        (data as Record<string, number>)[key] = val;
      }
    }
    if (!data.weight) return;
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isValidManual = parseFloat(fields.weight ?? "") > 0;
  const acceptByMode = mode === "image" ? "image/*" : ".json";
  const previewFields = PREVIEW_FIELDS.filter(
    ({ key }) => (preview as Record<string, unknown> | null)?.[key] != null,
  );

  const inner = (
    <>
      <div
        className={`flex items-center ${embedded ? "justify-end" : "justify-between"} mb-4`}
      >
        {!embedded && (
          <h2 className="text-lg font-semibold">
            {preview ? "Preview dos Dados" : "Registrar Medição"}
          </h2>
        )}
        {!preview && !isProcessing && (
          <div className="flex gap-1">
            {(
              [
                { id: "image", icon: <ImageIcon size={12} />, label: "Imagem" },
                { id: "json", icon: <FileJson size={12} />, label: "JSON" },
                { id: "manual", icon: null, label: "Manual" },
              ] as const
            ).map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  mode === id
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-(--text-muted) hover:text-(--text-secondary)"
                }`}
              >
                {icon ? (
                  <span className="flex items-center gap-1">
                    {icon} {label}
                  </span>
                ) : (
                  label
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview de dados importados */}
      {preview && (
        <div className="flex flex-col gap-4 animate-fade-slide-up">
          {preview.parsedDate && (
            <p className="text-xs text-(--text-muted) text-center">
              Data detectada:{" "}
              <span className="font-medium text-(--text-secondary)">
                {preview.parsedDate}
              </span>
              {preview.measuredAt && ` às ${preview.measuredAt}`}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto scrollbar-hide">
            {previewFields.map(({ key, label }) => {
              const val = (preview as Record<string, unknown>)[key];
              return (
                <div
                  key={key}
                  className="bg-(--bg-tertiary)/50 rounded-xl p-2 text-center"
                >
                  <p className="text-sm font-bold">
                    {val != null ? String(val) : "–"}
                  </p>
                  <p className="text-[9px] text-(--text-muted) leading-tight">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSavePreview}
              disabled={isSaving}
              className="flex-1"
            >
              {saved ? (
                <>
                  <Check size={16} /> Salvo!
                </>
              ) : isSaving ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={16} /> Confirmar e Salvar
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setPreview(null);
                setError("");
              }}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* OCR em progresso */}
      {isProcessing && (
        <div className="flex flex-col gap-3 py-4 animate-fade-slide-up">
          <p className="text-sm text-(--text-secondary) text-center">
            Processando imagem...
          </p>
          <ProgressBar value={ocrProgress} max={100} />
          <p className="text-xs text-(--text-muted) text-center">
            {Math.round(ocrProgress)}%
          </p>
        </div>
      )}

      {/* Modo imagem ou JSON: drag & drop */}
      {!preview && !isProcessing && (mode === "image" || mode === "json") && (
        <div className="flex flex-col gap-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-(--border) hover:border-(--border-hover) hover:bg-(--bg-tertiary)/30"
              }
            `}
          >
            {mode === "image" ? (
              <ImageIcon
                size={32}
                className="mx-auto text-(--text-muted) mb-3"
              />
            ) : (
              <FileJson
                size={32}
                className="mx-auto text-(--text-muted) mb-3"
              />
            )}
            <p className="text-sm text-(--text-secondary)">
              {mode === "image"
                ? "Arraste uma captura do Relax Fit aqui"
                : "Arraste um arquivo JSON aqui"}
            </p>
            <p className="text-xs text-(--text-muted) mt-1">
              ou clique para selecionar
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptByMode}
            onChange={handleFileInput}
            className="hidden"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-xs text-(--text-muted) text-center">
            {mode === "image"
              ? "Compatível com capturas de tela do Relax Fit"
              : "Compatível com JSON da Relax Fit"}
          </p>
        </div>
      )}

      {/* Modo manual */}
      {!preview && !isProcessing && mode === "manual" && (
        <form onSubmit={handleSaveManual} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {MANUAL_FIELDS.map(({ key, label, placeholder }) => (
              <Input
                key={key}
                label={label}
                id={`body-${key}`}
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder={placeholder}
                value={fields[key] ?? ""}
                onChange={(e) => updateField(key, e.target.value)}
              />
            ))}
          </div>
          <Button type="submit" disabled={!isValidManual || isSaving}>
            {saved ? (
              <>
                <Check size={16} /> Salvo!
              </>
            ) : isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save size={16} /> Salvar Registro
              </>
            )}
          </Button>
        </form>
      )}
    </>
  );

  if (embedded) return inner;

  return (
    <Card hover={false} className="p-5">
      {inner}
    </Card>
  );
}
