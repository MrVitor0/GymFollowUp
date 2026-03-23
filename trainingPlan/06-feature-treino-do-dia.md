# 06 — Feature: Treino do Dia + Log de Séries

## 🎯 Objetivo

Página principal (`/`) que exibe o treino do dia e permite logar cada série de cada exercício de forma rápida e intuitiva.

---

## Fluxo do Usuário

```
1. Abre o app → vê o treino do dia baseado no dia da semana
2. Vê a lista de exercícios com badges de status (pendente/concluído)
3. Clica em um exercício → expande o card
4. Para cada série, digita as reps feitas (e peso, se aplicável)
5. Ao completar todas as séries → exercício marcado como concluído (verde)
6. Botão de vídeo tutorial → abre modal com iframe YouTube
7. Ao concluir todos → sessão salva no Firestore
8. Se for Domingo → tela de descanso ativo (só caminhada)
```

---

## Layout da Página (Mobile-first)

### Header

```
┌──────────────────────────────────────┐
│  🏋️ Segunda-feira                    │
│  TREINO A — PUSH                     │
│  Peito · Ombro · Tríceps             │
│                                      │
│  ██████████░░░░░░  3/5 exercícios    │
│  (barra de progresso do treino)      │
└──────────────────────────────────────┘
```

- Nome do dia da semana
- Tipo do treino + nome + badge colorida (laranja para Push)
- Grupos musculares envolvidos
- Barra de progresso geral da sessão

### Cards de Exercício (lista vertical)

```
┌──────────────────────────────────────┐
│ ① Flexão de Braço no Tapete    ▶️ 📹 │
│ 4 séries · até a falha · Peito      │
│ ─────────────────────────────────    │
│  Série 1: [  15  ] reps   ✅        │
│  Série 2: [  15  ] reps   ✅        │
│  Série 3: [  12  ] reps   ✅        │
│  Série 4: [  10  ] reps   ✅        │
│                                      │
│  💡 Cotovelos a 45 graus...          │
│                    [✓ CONCLUÍDO]     │
└──────────────────────────────────────┘
```

Cada card contém:

- **Número de ordem** + nome do exercício
- **Botão de vídeo** (ícone ▶️) para abrir modal
- **Séries/reps esperados** + grupo muscular
- **Inputs de log** para cada série (reps + peso opcional)
- **Dica de execução** colapsável
- **Status badge** (pendente → em curso → concluído)

### Estado Colapsado vs Expandido

- **Colapsado** (padrão): mostra nome, badge de status, reps resumidos
- **Expandido** (ao clicar): mostra inputs de série, dica, botão de vídeo
- O exercício "ativo" (primeiro não concluído) inicia expandido automaticamente

---

## Componentes Necessários

### `WorkoutHeader.tsx`

- Props: `workoutType`, `dayName`, `progress` (exercícios concluídos / total)
- Exibe informações do treino + barra de progresso
- Badge colorida baseada no tipo (Push=laranja, Pull=azul, Legs=roxo)

### `ExerciseCard.tsx`

- Props: `exercise`, `log`, `onLogSet`, `onComplete`, `isActive`
- Card expandível com informações do exercício
- Renderiza `SetLogger` para cada série
- Botão de vídeo que abre `VideoModal`
- Animação de conclusão (borda verde pulsante)

### `SetLogger.tsx`

- Props: `setNumber`, `expectedReps`, `value`, `onChange`, `completed`
- Input numérico estilizado para reps
- Input opcional de peso (kg) para exercícios com halteres
- Input de duração (segundos) para prancha isométrica
- Check icon ao confirmar

### `VideoModal.tsx`

- Props: `videoUrl`, `isOpen`, `onClose`
- Modal fullscreen no mobile, centrado no desktop
- Iframe do YouTube responsivo (16:9)
- Backdrop com blur
- Fechar com X, click fora, ou tecla Escape

---

## Lógica do Hook `useWorkout.ts`

```typescript
function useWorkout() {
  // 1. Determinar tipo de treino do dia (A/B/C/REST)
  // 2. Buscar exercícios do tipo correspondente (do Firestore ou constante local)
  // 3. Verificar se já existe log para hoje (workoutLogs/YYYY-MM-DD)
  // 4. Se existe → carregar dados logados (estado de volta)
  // 5. Se não existe → criar log vazio para hoje
  // 6. Funções: logSet(), completeExercise(), completeWorkout()
  // 7. Auto-save: salvar no Firestore a cada alteração (debounce 500ms)

  return {
    workoutType, // "A" | "B" | "C" | "REST"
    exercises, // Exercise[]
    log, // WorkoutLog (estado atual)
    progress, // { completed: number, total: number }
    logSet, // (exerciseId, setNumber, reps, weight?) => void
    isLoading,
    isRest, // true se Domingo
  };
}
```

---

## Interações Especiais

### Auto-advance

Quando todas as séries de um exercício são logadas:

1. Exercício marcado como `completed: true`
2. Badge muda para "Concluído" ✅
3. Card colapsa automaticamente com animação
4. Próximo exercício não concluído expande automaticamente

### Dia de Descanso (Domingo)

Quando `workoutType === "REST"`:

- Exibir card especial: "Dia de Descanso Ativo 🧘"
- Sub-texto: "Foco nas 2h de caminhada na Kingsmith"
- Botão "Logar Caminhada" que redireciona para `/caminhada`
- Sem exercícios de força

### Sessão Completada

Quando todos os exercícios estão concluídos:

- Banner celebratório no topo com animação
- Mostra resumo: total de séries, reps totais, tempo (se rastreado)
- Botão "Ver Histórico"

---

## Salvamento

- **Auto-save** com debounce de 500ms a cada alteração de série
- Usa `setDoc` com `merge: true` no Firestore (document ID = data de hoje)
- Se o usuário sair e voltar, o progresso é recuperado automaticamente
- Campo `completedAt` preenchido apenas quando TODOS os exercícios estão concluídos

---

## Wireframe Mobile (ASCII)

```
┌─────────────────────────┐
│  ≡  GymFollowUp    ⚙️   │  ← top bar
├─────────────────────────┤
│                         │
│  Segunda-feira          │
│  ██ TREINO A — PUSH     │
│  Peito · Ombro · Tríceps│
│  ████████░░░░  3/5      │
│                         │
│ ┌─────────────────────┐ │
│ │ ① Flexão      ✅ ▶️ │ │  ← concluído (colapsado)
│ │   4 séries logadas   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ② Supino Chão  ✅ ▶️│ │  ← concluído (colapsado)
│ │   4 séries logadas   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ③ Desenv.   ⏳  ▶️  │ │  ← EM CURSO (expandido)
│ │   4×10-12 · Ombro    │ │
│ │ ┌───────────────────┐│ │
│ │ │ S1: [12] 10kg  ✅ ││ │
│ │ │ S2: [10] 10kg  ✅ ││ │
│ │ │ S3: [  ]  kg      ││ │  ← input ativo
│ │ │ S4: [  ]  kg      ││ │
│ │ └───────────────────┘│ │
│ │ 💡 Não deixe bater...│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ④ Elev. Lateral ⬜ ▶️│ │  ← pendente (colapsado)
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ⑤ Tríc. Testa  ⬜ ▶️│ │  ← pendente (colapsado)
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 🏋️  📊  🚶  ⚖️         │  ← bottom nav
└─────────────────────────┘
```

---

## ✅ Checklist

- [ ] `WorkoutHeader` renderiza info do treino + progresso
- [ ] `ExerciseCard` com estados: colapsado, expandido, concluído
- [ ] `SetLogger` com inputs numéricos (reps, peso, duração)
- [ ] `VideoModal` com iframe YouTube responsivo
- [ ] `useWorkout` hook completo com CRUD Firestore
- [ ] Auto-advance funciona (colapsar concluído, expandir próximo)
- [ ] Auto-save com debounce
- [ ] Dia de descanso (Domingo) tratado
- [ ] Animações de conclusão
- [ ] Responsivo: mobile (stack) e desktop (pode manter stack ou 2 cols)

---

## Próximo: [07-feature-historico.md](./07-feature-historico.md)
