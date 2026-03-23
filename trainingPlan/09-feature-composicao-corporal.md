# 09 — Feature: Composição Corporal

## 🎯 Objetivo

Página `/corpo` para importar dados da balança Relax Fit (JSON) e acompanhar a evolução da composição corporal com gráficos.

---

## Fluxo do Usuário

```
1. Navega para /corpo
2. Vê dashboard com métricas atuais (último registro)
3. Pode importar JSON da balança Relax Fit OU inserir dados manualmente
4. Gráficos de evolução para cada métrica
5. Histórico em tabela
```

---

## Layout

### Dashboard de Métricas Atuais (topo)

```
┌────────────────────────────────────────┐
│  ⚖️ Composição Corporal               │
│  Último registro: 23 Mar 2026          │
│                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ 85.4 │  │ 22.1 │  │ 42.3 │         │
│  │  kg   │  │  %   │  │  %   │         │
│  │ peso  │  │gord. │  │musc. │         │
│  └──────┘  └──────┘  └──────┘         │
│                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ 26.2 │  │ 53.8 │  │ 18.5 │         │
│  │ IMC  │  │  %   │  │  %   │         │
│  │      │  │ água │  │prot. │         │
│  └──────┘  └──────┘  └──────┘         │
└────────────────────────────────────────┘
```

- Grid 3×2 de mini-cards com métricas
- Cada card com valor, unidade e label
- Indicador de tendência: ↑ ↓ = vs registro anterior
- Cor: verde se tendência positiva, vermelho se negativa
  - Peso ↓ = verde (perdendo peso = bom)
  - Músculo ↑ = verde (ganhando músculo = bom)
  - Gordura ↓ = verde
  - etc.

### Área de Import

```
┌────────────────────────────────────────┐
│  📥 Importar Dados                     │
│                                        │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │  Arraste um arquivo JSON aqui  │    │
│  │  ou clique para selecionar     │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  ou inserir manualmente ↓              │
│                                        │
│  Peso (kg)  [85.4]   Gordura (%) [22.1]│
│  Músculo(%) [42.3]   Água (%)    [53.8]│
│  Proteína(%)[18.5]   IMC        [26.2] │
│  ...campos opcionais...                │
│                                        │
│        [ 💾 Salvar Registro ]          │
└────────────────────────────────────────┘
```

- Drag & drop zone para arquivo JSON
- Fallback: botão de seleção de arquivo
- Preview dos dados parseados antes de salvar
- OU formulário manual com todos os campos
- Campos obrigatórios: peso, gordura, músculo, água, proteína, IMC
- Campos opcionais: sal, gordura visceral, massa óssea, idade metabólica, TMB

### Import JSON — Parser

Ao receber o JSON da Relax Fit, precisamos mapear os campos. Estratégia:

1. Ler o JSON
2. Tentar mapear campos conhecidos automaticamente (por nome de chave)
3. Exibir preview dos dados parseados
4. Usuário confirma e salva

```typescript
// Parser flexível — adaptar conforme formato real do Relax Fit
function parseRelaxFitJson(json: Record<string, unknown>): Partial<BodyLog> {
  return {
    weight: findNumber(json, ["weight", "peso", "Weight"]),
    bodyFat: findNumber(json, ["bodyFat", "body_fat", "fat", "gordura"]),
    muscle: findNumber(json, ["muscle", "musculo", "Muscle"]),
    water: findNumber(json, ["water", "agua", "Water"]),
    protein: findNumber(json, ["protein", "proteina", "Protein"]),
    bmi: findNumber(json, ["bmi", "imc", "BMI"]),
    salt: findNumber(json, ["salt", "sal", "Salt"]),
    visceralFat: findNumber(json, ["visceralFat", "visceral_fat", "Visceral"]),
    boneMass: findNumber(json, ["boneMass", "bone_mass", "Bone"]),
    metabolicAge: findNumber(json, ["metabolicAge", "metabolic_age"]),
    bmr: findNumber(json, ["bmr", "BMR", "basal"]),
    rawJson: json,
  };
}
```

> **Nota:** Na primeira importação real, verificar o formato exato do JSON da Relax Fit e ajustar o parser. Guardar `rawJson` como backup.

### Gráficos de Evolução

```
┌────────────────────────────────────────┐
│  📈 Evolução                           │
│                                        │
│  [Peso] [Gordura] [Músculo] [IMC]      │
│  ← tabs para alternar métrica →        │
│                                        │
│  kg                                    │
│  88 ┤╮                                 │
│  86 ┤ ╰─╮                             │
│  84 ┤    ╰──╮  ╭──╮                   │
│  82 ┤        ╰─╯   ╰──╮               │
│  80 ┤                   ╰──            │
│     ┼─────────────────────────         │
│      Jan   Fev   Mar   Abr            │
└────────────────────────────────────────┘
```

- Tabs para alternar entre métricas
- Gráfico de linha com Recharts
- Período: últimos 3 meses (ou todo o histórico)
- Tooltip com data e valor
- Linha de referência para metas (opcional futuro)

### Tabela de Histórico

```
┌──────────────────────────────────────────────┐
│ Data      │ Peso │ Gord.│ Musc.│ Água │ IMC  │
│ 23 Mar    │ 85.4 │ 22.1 │ 42.3 │ 53.8 │ 26.2 │
│ 22 Mar    │ 85.6 │ 22.3 │ 42.1 │ 53.5 │ 26.3 │
│ 21 Mar    │ 85.9 │ 22.5 │ 42.0 │ 53.2 │ 26.4 │
└──────────────────────────────────────────────┘
```

- Scroll horizontal no mobile
- Ordenação por data (mais recente primeiro)

---

## Componentes

### `BodyForm.tsx`

- Drag & drop zone + file input
- Parser de JSON
- Formulário manual (fallback)
- Preview de dados parseados
- Botão salvar

### `BodyChart.tsx`

- Tabs de métrica selecionada
- Gráfico Recharts (reutiliza `ProgressChart`)
- Responsivo

---

## Hook `useBody.ts`

```typescript
function useBody() {
  return {
    latestLog, // BodyLog | null
    previousLog, // BodyLog | null (para comparação/tendência)
    logs, // BodyLog[] (para gráficos)
    saveLog, // (data: Partial<BodyLog>) => Promise<void>
    importJson, // (json: Record<string, unknown>) => Partial<BodyLog>
    isLoading,
  };
}
```

---

## ✅ Checklist

- [ ] Página `/corpo` criada
- [ ] Dashboard de métricas atuais (grid de mini-cards)
- [ ] Tendência vs registro anterior (↑/↓/=)
- [ ] Zona de drag & drop para JSON
- [ ] Parser flexível de JSON (Relax Fit)
- [ ] Preview antes de salvar
- [ ] Formulário manual como fallback
- [ ] Gráficos de evolução com tabs por métrica
- [ ] Tabela de histórico com scroll horizontal (mobile)
- [ ] Responsivo

---

## Próximo: [10-responsividade-polish.md](./10-responsividade-polish.md)
