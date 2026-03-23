"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { parseRelaxFitJson } from "@/hooks/useBody";
import { Upload, Save, Check, FileJson, X } from "lucide-react";
import type { BodyLog } from "@/types/models";

interface BodyFormProps {
  latestLog: BodyLog | null;
  onSave: (data: Partial<BodyLog>) => Promise<void>;
}

const METRIC_FIELDS = [
  { key: "weight", label: "Peso (kg)", placeholder: "85.4" },
  { key: "bodyFat", label: "Gordura (%)", placeholder: "22.1" },
  { key: "muscle", label: "Músculo (%)", placeholder: "42.3" },
  { key: "water", label: "Água (%)", placeholder: "53.8" },
  { key: "protein", label: "Proteína (%)", placeholder: "18.5" },
  { key: "bmi", label: "IMC", placeholder: "26.2" },
] as const;

export function BodyForm({ latestLog, onSave }: BodyFormProps) {
  const [mode, setMode] = useState<"import" | "manual">("import");
  const [preview, setPreview] = useState<Partial<BodyLog> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  function handleFile(file: File) {
    if (!file.name.endsWith(".json")) {
      setError("Apenas arquivos .json são aceitos");
      return;
    }
    setError("");
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
    await onSave(preview);
    setIsSaving(false);
    setSaved(true);
    setPreview(null);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSaveManual(e: React.FormEvent) {
    e.preventDefault();
    const data: Partial<BodyLog> = {};
    for (const { key } of METRIC_FIELDS) {
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

  return (
    <Card hover={false} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {preview ? "Preview dos Dados" : "Registrar Medição"}
        </h2>
        {!preview && (
          <div className="flex gap-1">
            {(["import", "manual"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  mode === m
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-(--text-muted) hover:text-(--text-secondary)"
                }`}
              >
                {m === "import" ? (
                  <span className="flex items-center gap-1">
                    <Upload size={12} /> JSON
                  </span>
                ) : (
                  "Manual"
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview de dados importados */}
      {preview && (
        <div className="flex flex-col gap-4 animate-fade-slide-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {METRIC_FIELDS.map(({ key, label }) => {
              const val = (preview as Record<string, unknown>)[key];
              return (
                <div
                  key={key}
                  className="bg-(--bg-tertiary)/50 rounded-xl p-3 text-center"
                >
                  <p className="text-lg font-bold">
                    {val != null ? String(val) : "–"}
                  </p>
                  <p className="text-[10px] text-(--text-muted)">{label}</p>
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

      {/* Modo import: drag & drop */}
      {!preview && mode === "import" && (
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
            <FileJson size={32} className="mx-auto text-(--text-muted) mb-3" />
            <p className="text-sm text-(--text-secondary)">
              Arraste um arquivo JSON aqui
            </p>
            <p className="text-xs text-(--text-muted) mt-1">
              ou clique para selecionar
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-xs text-(--text-muted) text-center">
            Compatível com JSON da Relax Fit
          </p>
        </div>
      )}

      {/* Modo manual */}
      {!preview && mode === "manual" && (
        <form onSubmit={handleSaveManual} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {METRIC_FIELDS.map(({ key, label, placeholder }) => (
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
    </Card>
  );
}
