# 08 — Feature: Log de Caminhada

## 🎯 Objetivo

Página `/caminhada` para registrar a caminhada diária na Kingsmith e acompanhar a evolução com gráficos.

---

## Fluxo do Usuário

```
1. Navega para /caminhada
2. Vê resumo do mês (total km, total min, média diária)
3. Formulário rápido para logar a caminhada de hoje
4. Gráfico de evolução dos últimos 30 dias
5. Lista dos últimos logs
```

---

## Layout

### Resumo do Mês (topo)

```
┌──────────────────────────────────────┐
│  🚶 Caminhada — Março 2026           │
│                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │ 186  │  │ 42h  │  │ 3.5  │       │
│  │  km  │  │total │  │km/h  │       │
│  │ mês  │  │ mês  │  │média │       │
│  └──────┘  └──────┘  └──────┘       │
│                                      │
│  Meta: 2h/dia  ████████░░░  80%      │
└──────────────────────────────────────┘
```

- Total de km no mês
- Total de horas no mês
- Velocidade média
- Barra de progresso da meta (2h/dia × dias do mês)

### Formulário de Log (card principal)

```
┌──────────────────────────────────────┐
│  Registrar Caminhada — Hoje          │
│                                      │
│  Distância (km)                      │
│  ┌──────────────────────────────┐    │
│  │  8.5                         │    │
│  └──────────────────────────────┘    │
│                                      │
│  Duração (minutos)                   │
│  ┌──────────────────────────────┐    │
│  │  120                         │    │
│  └──────────────────────────────┘    │
│                                      │
│  Vel. média: 4.25 km/h (calculado)   │
│                                      │
│  Observações (opcional)              │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│        [ 💾 Salvar Caminhada ]       │
└──────────────────────────────────────┘
```

- 2 inputs obrigatórios: distância (km) e duração (min)
- Velocidade calculada automaticamente em tempo real
- Campo de notas opcional
- Se já existe log de hoje → exibe preenchido para editar
- Botão salvar com feedback visual (loading → ✅ salvo)

### Gráfico de Evolução

```
┌──────────────────────────────────────┐
│  Evolução — Últimos 30 dias         │
│                                      │
│  km                                  │
│  10 ┤                    ╭─╮         │
│   8 ┤  ╭─╮  ╭─╮    ╭──╮│  │╭─╮     │
│   6 ┤╭─╯  ╰╮│  ╰──╮│   ╯  ╰╯  ╰╮   │
│   4 ┤│      ╰╯     ╰╯            │   │
│   2 ┤╯                            ╰  │
│   0 ┼──────────────────────────────  │
│      1    5    10   15   20   25  30 │
└──────────────────────────────────────┘
```

- Gráfico de linha/área com Recharts
- Eixo X: dias do mês
- Eixo Y: km (ou minutos, alternável)
- Tooltip ao hover/tap com detalhes do dia
- Linha de referência horizontal na meta (2h = ~8km)
- Estilo: gradiente indigo, pontos nos dados

### Lista de Logs Recentes

```
┌──────────────────────────────────────┐
│  23 Mar  │  8.5 km  │  120 min  │ 4.25 │
│  22 Mar  │  7.2 km  │  110 min  │ 3.93 │
│  21 Mar  │  9.0 km  │  135 min  │ 4.00 │
│  ...     │  ...     │  ...      │ ...  │
└──────────────────────────────────────┘
```

- Tabela simples com scroll
- Data, distância, duração, velocidade

---

## Componentes

### `WalkingForm.tsx`

- Inputs de distância e duração
- Cálculo automático de velocidade
- Botão salvar com loading state
- Se log de hoje existe → preenche automaticamente (modo edição)

### `ProgressChart.tsx` (reutilizável)

- Wrapper do Recharts para gráficos de linha/área
- Props: `data`, `xKey`, `yKey`, `color`, `referenceLine?`
- Responsivo (ResponsiveContainer)
- Estilo dark theme

---

## Hook `useWalking.ts`

```typescript
function useWalking() {
  return {
    todayLog, // WalkingLog | null
    monthLogs, // WalkingLog[] (mês atual)
    recentLogs, // WalkingLog[] (últimos 30 dias para gráfico)
    monthStats, // { totalKm, totalMin, avgSpeed, goalProgress }
    saveLog, // (data: Partial<WalkingLog>) => Promise<void>
    isLoading,
  };
}
```

---

## ✅ Checklist

- [ ] Página `/caminhada` criada
- [ ] Formulário de log com cálculo de velocidade
- [ ] Resumo do mês com métricas
- [ ] Gráfico de evolução (Recharts)
- [ ] Lista de logs recentes
- [ ] Edição do log de hoje (se já existe)
- [ ] Responsivo (mobile: stack, desktop: form + chart side by side)

---

## Próximo: [09-feature-composicao-corporal.md](./09-feature-composicao-corporal.md)
