# 03 — Estrutura do Projeto

## 🎯 Objetivo

Definir a organização de pastas e arquivos do projeto, mantendo simplicidade e clareza.

---

## Estrutura Completa

```
src/
├── app/
│   ├── globals.css                 # Estilos globais + tema + animações
│   ├── layout.tsx                  # Layout raiz (navbar, container)
│   ├── page.tsx                    # Dashboard = treino do dia
│   ├── historico/
│   │   └── page.tsx                # Histórico de treinos
│   ├── caminhada/
│   │   └── page.tsx                # Log de caminhada
│   └── corpo/
│       └── page.tsx                # Composição corporal
│
├── components/
│   ├── ui/                         # Componentes UI primitivos reutilizáveis
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── layout/                     # Componentes de layout
│   │   ├── Navbar.tsx
│   │   └── PageContainer.tsx
│   │
│   ├── workout/                    # Componentes do treino
│   │   ├── ExerciseCard.tsx        # Card de exercício com log de séries
│   │   ├── SetLogger.tsx           # Input de reps/peso para cada série
│   │   ├── WorkoutHeader.tsx       # Cabeçalho do treino do dia
│   │   └── VideoModal.tsx          # Modal com iframe do YouTube
│   │
│   ├── walking/                    # Componentes de caminhada
│   │   └── WalkingForm.tsx         # Formulário de log de caminhada
│   │
│   ├── body/                       # Componentes de composição corporal
│   │   ├── BodyForm.tsx            # Form manual + upload JSON
│   │   └── BodyChart.tsx           # Gráficos de evolução
│   │
│   └── charts/                     # Componentes de gráficos genéricos
│       └── ProgressChart.tsx       # Gráfico reutilizável (Recharts)
│
├── lib/
│   ├── firebase.ts                 # Inicialização do Firebase
│   ├── firestore.ts                # Funções CRUD genéricas do Firestore
│   └── utils.ts                    # Utilitários (formatDate, calcSpeed, etc.)
│
├── data/
│   └── exercises.ts                # Dados seed dos exercícios (constante)
│
├── hooks/
│   ├── useWorkout.ts               # Hook para treino do dia + logs
│   ├── useWalking.ts               # Hook para logs de caminhada
│   └── useBody.ts                  # Hook para logs de composição corporal
│
└── types/
    ├── models.ts                   # Interfaces do Firestore (Exercise, logs, etc.)
    └── ...                         # Types existentes (routes, validator, cache-life)
```

---

## Convenções

### Naming

- **Pastas:** camelCase (`workoutLogs`)
- **Componentes:** PascalCase (`ExerciseCard.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useWorkout.ts`)
- **Utilitários:** camelCase (`firestore.ts`)

### Componentes

- Todos os componentes são **Client Components** (`"use client"`) exceto onde desnecessário
- Pages são server components por padrão; usam client components internamente
- Sem barrel files (index.ts) — imports diretos

### Imports

- Usar alias `@/` para imports absolutos (já configurado no tsconfig)
  - `import { db } from "@/lib/firebase"`
  - `import { Exercise } from "@/types/models"`
  - `import { ExerciseCard } from "@/components/workout/ExerciseCard"`

---

## Páginas e Rotas

| Rota         | Página               | Descrição                          |
| ------------ | -------------------- | ---------------------------------- |
| `/`          | Dashboard            | Treino do dia + resumo rápido      |
| `/historico` | Histórico de Treinos | Lista + filtro de sessões passadas |
| `/caminhada` | Log de Caminhada     | Form + gráfico de evolução         |
| `/corpo`     | Composição Corporal  | Import JSON + gráficos de métricas |

---

## Navegação

**Navbar fixa (bottom bar no mobile, sidebar/topbar no desktop):**

4 itens:

1. 🏋️ **Treino** → `/`
2. 📊 **Histórico** → `/historico`
3. 🚶 **Caminhada** → `/caminhada`
4. ⚖️ **Corpo** → `/corpo`

No mobile: bottom navigation bar fixa com ícones + labels

No desktop: top navigation bar horizontal

---

## Fluxo de Dados Simplificado

```
Componente (Client)
    │
    ├── useWorkout() / useWalking() / useBody()   ← Custom Hooks
    │       │
    │       └── firestore.ts                       ← CRUD helpers
    │               │
    │               └── firebase.ts → Firestore    ← SDK
    │
    └── Render (JSX + Tailwind)
```

- **Hooks** encapsulam toda lógica de leitura/escrita do Firestore
- **Componentes** focam apenas em UI e interação
- **Sem server actions** — tudo é client-side direto com Firebase SDK (simplicidade máxima)

---

## ✅ Checklist

- [ ] Pastas criadas conforme estrutura
- [ ] `src/lib/firebase.ts` configurado (da fase 01)
- [ ] `src/lib/firestore.ts` com helpers CRUD
- [ ] `src/lib/utils.ts` com funções utilitárias
- [ ] `src/types/models.ts` com todas as interfaces
- [ ] `src/data/exercises.ts` com dados seed
- [ ] Navbar funcional com navegação entre as 4 rotas

---

## Próximo: [04-design-system.md](./04-design-system.md)
