# 07 — Feature: Histórico de Treinos

## 🎯 Objetivo

Página `/historico` que exibe o histórico completo de treinos, permitindo visualizar evolução, filtrar por tipo e ver detalhes de sessões passadas.

---

## Fluxo do Usuário

```
1. Navega para /historico
2. Vê calendário/timeline dos últimos treinos
3. Pode filtrar por tipo (Push/Pull/Legs/Todos)
4. Clica em um treino passado → expande detalhes
5. Vê cada exercício com as reps/peso logados
6. Pode comparar evolução de um exercício específico
```

---

## Layout

### Filtros (topo)

```
┌───────────────────────────────────────┐
│  [Todos] [Push] [Pull] [Legs]         │
│  ← toggle buttons com badge colorida →│
└───────────────────────────────────────┘
```

- 4 botões toggle: Todos, Push (laranja), Pull (azul), Legs (roxo)
- O selecionado fica com bg preenchido

### Cards de Sessão (lista cronológica, mais recente primeiro)

```
┌───────────────────────────────────────┐
│  📅 Seg, 23 Mar 2026  ·  PUSH A      │
│  ██████████████████ 5/5 concluídos    │
│                                       │
│  Flexão ............ 15·15·12·10      │
│  Supino Chão ....... 12·12·10·10      │
│  Desenvolvimento ... 12·10·10·10      │
│  Elev. Lateral ..... 15·15·12·12      │
│  Tríc. Testa ....... 12·12·12·12      │
│                                       │
│  💬 "Dia bom, consegui manter forma"  │
└───────────────────────────────────────┘
```

Cada card mostra:

- Data formatada + tipo de treino + badge
- Barra de progresso (exercícios concluídos / total)
- Resumo compacto: nome abreviado + reps de cada série separados por ponto
- Notas opcionais

### Detalhes Expandidos (ao clicar)

Modo expandido mostra:

- Cada exercício como sub-card
- Reps + peso de cada série
- Comparação com a última execução do mesmo exercício (se melhorou ou não)
  - ↑ verde se fez mais reps/peso
  - ↓ vermelho se fez menos
  - = neutro se igual

---

## Componentes Necessários

### Página `/historico/page.tsx`

- Busca `workoutLogs` do Firestore, ordenados por data desc
- Filtra por tipo se selecionado
- Paginação: carregar últimos 20, "Load More" para mais

### `WorkoutHistoryCard.tsx`

- Card de uma sessão passada
- Estado colapsado (resumo) e expandido (detalhes)
- Cores baseadas no tipo de treino

### Dentro do hook `useWorkout.ts` (adicionar):

```typescript
// Funções adicionais:
getWorkoutHistory(filter?: "A" | "B" | "C", limit?: number) → WorkoutLog[]
getExerciseHistory(exerciseId: string) → { date, sets }[]
```

---

## Estatísticas Rápidas (topo da página)

Mini-cards com métricas:

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  15  │  │  52  │  │  4   │  │ 🔥3  │
│treinos│  │ dias │  │ /sem │  │streak│
│ mês  │  │total │  │média │  │ dias │
└──────┘  └──────┘  └──────┘  └──────┘
```

- Treinos no mês atual
- Total de treinos
- Média de treinos por semana
- Streak atual (dias consecutivos com treino)

---

## Query Firestore

```typescript
// Buscar histórico (últimos 20)
const q = query(
  collection(db, "workoutLogs"),
  orderBy("date", "desc"),
  limit(20),
);

// Com filtro de tipo
const q = query(
  collection(db, "workoutLogs"),
  where("workoutType", "==", "A"),
  orderBy("date", "desc"),
  limit(20),
);
```

---

## ✅ Checklist

- [ ] Página `/historico` criada com layout responsivo
- [ ] Filtros por tipo de treino (All/A/B/C)
- [ ] Cards de sessão colapsáveis com resumo compacto
- [ ] Detalhes expandidos com reps/peso por exercício
- [ ] Comparação com sessão anterior (↑/↓/=)
- [ ] Estatísticas rápidas no topo
- [ ] Paginação com "Load More"
- [ ] Mobile: cards em stack vertical, stats em grid 2×2
- [ ] Desktop: lista mais larga com mais info visível

---

## Próximo: [08-feature-caminhada.md](./08-feature-caminhada.md)
