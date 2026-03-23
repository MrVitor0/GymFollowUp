# 02 — Modelagem de Dados (Firestore)

## 🎯 Objetivo

Definir as collections e documents do Firestore de forma simples e desnormalizada (NoSQL-friendly).

---

## Visão Geral das Collections

```
firestore/
├── exercises          → Dados estáticos dos exercícios (seed)
├── workoutLogs        → Log de cada sessão de treino
├── walkingLogs        → Log diário de caminhada
└── bodyLogs           → Log diário de composição corporal
```

---

## Collection: `exercises`

Dados estáticos dos exercícios. Populada uma vez via seed. Raramente editada.

**Document ID:** auto-generated

```typescript
interface Exercise {
  id: string;
  name: string; // "Flexão de Braço no Tapete"
  muscleGroup: string; // "Peito" | "Ombro" | "Tríceps" | "Costas" | "Bíceps" | "Pernas" | "Core"
  workoutType: "A" | "B" | "C"; // A=Push, B=Pull, C=Legs&Core
  sets: number; // 4
  repsRange: string; // "até a falha" | "10-12" | "12-15" | "20"
  order: number; // Ordem dentro do treino (1, 2, 3...)
  videoUrl: string; // URL do YouTube
  tip: string; // Dica de execução ("Cotovelos a 45 graus...")
}
```

**Exemplo de document:**

```json
{
  "name": "Flexão de Braço no Tapete",
  "muscleGroup": "Peito",
  "workoutType": "A",
  "sets": 4,
  "repsRange": "até a falha",
  "order": 1,
  "videoUrl": "https://www.youtube.com/watch?v=RRi0-tvte6A",
  "tip": "Cotovelos a 45 graus (não abertos em formato de \"T\"). O peito deve quase encostar no chão."
}
```

---

## Collection: `workoutLogs`

Cada documento representa **uma sessão de treino completa** de um dia.

**Document ID:** `YYYY-MM-DD` (ex: `2026-03-23`)

```typescript
interface WorkoutLog {
  id: string; // "2026-03-23"
  date: string; // "2026-03-23"
  workoutType: "A" | "B" | "C"; // Tipo do treino executado
  exercises: ExerciseLog[]; // Array dos exercícios executados
  completedAt?: string; // ISO timestamp de quando finalizou
  notes?: string; // Observações livres (opcional)
}

interface ExerciseLog {
  exerciseId: string; // Referência ao exercise.id
  exerciseName: string; // Desnormalizado para leitura rápida
  sets: SetLog[]; // Array de séries executadas
  completed: boolean; // true se todas as séries foram logadas
}

interface SetLog {
  setNumber: number; // 1, 2, 3, 4
  reps: number; // Repetições feitas (ex: 15)
  weight?: number; // Peso usado em kg (opcional, para halteres)
  duration?: number; // Duração em segundos (para prancha)
}
```

**Exemplo de document:**

```json
{
  "date": "2026-03-23",
  "workoutType": "A",
  "exercises": [
    {
      "exerciseId": "abc123",
      "exerciseName": "Flexão de Braço no Tapete",
      "sets": [
        { "setNumber": 1, "reps": 15 },
        { "setNumber": 2, "reps": 15 },
        { "setNumber": 3, "reps": 12 },
        { "setNumber": 4, "reps": 10 }
      ],
      "completed": true
    },
    {
      "exerciseId": "def456",
      "exerciseName": "Supino no Chão com Halteres",
      "sets": [
        { "setNumber": 1, "reps": 12, "weight": 10 },
        { "setNumber": 2, "reps": 12, "weight": 10 },
        { "setNumber": 3, "reps": 10, "weight": 10 },
        { "setNumber": 4, "reps": 10, "weight": 10 }
      ],
      "completed": true
    }
  ],
  "completedAt": "2026-03-23T19:30:00.000Z",
  "notes": "Dia bom, consegui manter boa forma"
}
```

---

## Collection: `walkingLogs`

Log diário de caminhada.

**Document ID:** `YYYY-MM-DD` (ex: `2026-03-23`)

```typescript
interface WalkingLog {
  id: string; // "2026-03-23"
  date: string; // "2026-03-23"
  distanceKm: number; // Quilômetros percorridos (ex: 8.5)
  durationMin: number; // Minutos de caminhada (ex: 120)
  avgSpeedKmh?: number; // Velocidade média (calculada: distanceKm / (durationMin/60))
  notes?: string; // Observações opcionais
}
```

**Exemplo de document:**

```json
{
  "date": "2026-03-23",
  "distanceKm": 8.2,
  "durationMin": 135,
  "avgSpeedKmh": 3.64,
  "notes": "Trabalhei enquanto caminhava, excelente sessão"
}
```

---

## Collection: `bodyLogs`

Log diário de composição corporal importado da balança Relax Fit.

**Document ID:** `YYYY-MM-DD` (ex: `2026-03-23`)

```typescript
interface BodyLog {
  id: string; // "2026-03-23"
  date: string; // "2026-03-23"
  weight: number; // Peso em kg
  bodyFat: number; // Gordura corporal (%)
  muscle: number; // Massa muscular (%)
  water: number; // Água corporal (%)
  protein: number; // Proteína (%)
  bmi: number; // IMC
  salt?: number; // Sal / minerais
  visceralFat?: number; // Gordura visceral
  boneMass?: number; // Massa óssea
  metabolicAge?: number; // Idade metabólica
  bmr?: number; // Taxa metabólica basal (kcal)
  rawJson?: Record<string, unknown>; // JSON original completo para referência
}
```

**Exemplo de document:**

```json
{
  "date": "2026-03-23",
  "weight": 85.4,
  "bodyFat": 22.1,
  "muscle": 42.3,
  "water": 53.8,
  "protein": 18.5,
  "bmi": 26.2,
  "salt": 3.2,
  "visceralFat": 9,
  "boneMass": 3.1,
  "metabolicAge": 28,
  "bmr": 1820
}
```

---

## 📁 Organização dos Types

Todas as interfaces ficarão em um único arquivo:

**Arquivo:** `src/types/models.ts`

Exporta: `Exercise`, `WorkoutLog`, `ExerciseLog`, `SetLog`, `WalkingLog`, `BodyLog`

---

## 🔑 Decisões de Design

| Decisão                                                      | Justificativa                                                  |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| Document ID = data (`YYYY-MM-DD`)                            | Garante unicidade por dia, facilita queries por data           |
| Desnormalizar `exerciseName` no log                          | Evita JOIN/lookup extra ao exibir histórico                    |
| `exercises` como subcollection dentro de `workoutLogs` → NÃO | Array inline é mais simples para 5 exercícios por treino       |
| Campos opcionais com `?`                                     | Flexibilidade para dados que nem sempre existem                |
| `rawJson` no bodyLog                                         | Preserva dados originais do Relax Fit caso surjam novos campos |

---

## 📊 Índices Necessários (Firestore)

Para as queries que faremos, os índices padrão (single-field) são suficientes:

- `workoutLogs` ordenado por `date` desc
- `walkingLogs` ordenado por `date` desc
- `bodyLogs` ordenado por `date` desc

Nenhum índice composto é necessário.

---

## ✅ Checklist

- [ ] Types definidos em `src/types/models.ts`
- [ ] Interfaces exportadas e importáveis
- [ ] Entendimento claro de cada collection
- [ ] Document IDs usando formato de data

---

## Próximo: [03-estrutura-projeto.md](./03-estrutura-projeto.md)
