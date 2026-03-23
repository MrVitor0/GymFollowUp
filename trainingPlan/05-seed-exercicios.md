# 05 — Seed de Exercícios

## 🎯 Objetivo

Definir o array completo de exercícios baseado no plano PPL do documento de referência. Esse seed será usado como constante local E populará o Firestore na primeira execução.

---

## Estratégia de Seed

1. Dados ficam como **constante TypeScript** em `src/data/exercises.ts`
2. Na primeira vez que o app roda, verificar se a collection `exercises` no Firestore está vazia
3. Se vazia → popular com os dados da constante (seed automático)
4. Isso evita depender de scripts externos e mantém tudo no código

### Função de seed (em `src/lib/firestore.ts`):

```typescript
async function seedExercisesIfEmpty() {
  const snapshot = await getDocs(collection(db, "exercises"));
  if (snapshot.empty) {
    for (const exercise of EXERCISES_SEED) {
      await addDoc(collection(db, "exercises"), exercise);
    }
  }
}
```

---

## Dados Completos

### Treino A — Push (Segunda e Quinta)

```typescript
// Peito, Ombro, Tríceps

{
  name: "Flexão de Braço no Tapete",
  muscleGroup: "Peito",
  workoutType: "A",
  sets: 4,
  repsRange: "até a falha",
  order: 1,
  videoUrl: "https://www.youtube.com/watch?v=RRi0-tvte6A",
  tip: "Cotovelos a 45 graus (não abertos em formato de 'T'). O peito deve quase encostar no chão."
},
{
  name: "Supino no Chão com Halteres (Floor Press)",
  muscleGroup: "Peito",
  workoutType: "A",
  sets: 4,
  repsRange: "10-12",
  order: 2,
  videoUrl: "https://www.youtube.com/watch?v=EMLwPQK9kQU",
  tip: "Deitado no tapete de yoga, desça os halteres até o tríceps encostar levemente no chão e empurre de volta."
},
{
  name: "Desenvolvimento com Halteres",
  muscleGroup: "Ombro",
  workoutType: "A",
  sets: 4,
  repsRange: "10-12",
  order: 3,
  videoUrl: "https://www.youtube.com/watch?v=MmHTcVK-1tU",
  tip: "Pode ser feito em pé ou sentado. Não deixe os halteres baterem um no outro lá em cima. Mantenha a tensão."
},
{
  name: "Elevação Lateral",
  muscleGroup: "Ombro",
  workoutType: "A",
  sets: 4,
  repsRange: "12-15",
  order: 4,
  videoUrl: "https://www.youtube.com/watch?v=iqxtykqrI88",
  tip: "Use halteres mais leves. Imagine que está a 'despejar jarras de água' no final do movimento."
},
{
  name: "Tríceps Testa no Chão com Halteres",
  muscleGroup: "Tríceps",
  workoutType: "A",
  sets: 4,
  repsRange: "12",
  order: 5,
  videoUrl: "https://www.youtube.com/watch?v=5U8kWohXI2M",
  tip: "Deitado, trave os cotovelos apontados para o teto. Só o antebraço se move, descendo o peso na direção da testa."
}
```

### Treino B — Pull (Terça e Sexta)

```typescript
// Costas, Bíceps

{
  name: "Remada Curvada com Halteres",
  muscleGroup: "Costas",
  workoutType: "B",
  sets: 4,
  repsRange: "12-15",
  order: 1,
  videoUrl: "https://www.youtube.com/watch?v=Vk6c7CjtM14",
  tip: "Incline o tronco quase a 90 graus, joelhos levemente dobrados, coluna reta. Puxe com os cotovelos raspando na costela."
},
{
  name: "Puxada Alta com Elástico na Porta",
  muscleGroup: "Costas",
  workoutType: "B",
  sets: 4,
  repsRange: "15",
  order: 2,
  videoUrl: "https://www.youtube.com/shorts/DuDUFbl7f2U",
  tip: "Prenda a âncora no topo da porta. Ajoelhe-se e puxe a borracha em direção à clavícula, estufando o peito."
},
{
  name: "Remada Serrote Unilateral",
  muscleGroup: "Costas",
  workoutType: "B",
  sets: 4,
  repsRange: "10-12",
  order: 3,
  videoUrl: "https://www.youtube.com/watch?v=epL1Lx0UPTg",
  tip: "Apoie uma mão na mesa ou cadeira. Use um halter pesado e puxe-o em direção ao quadril, não em direção ao peito."
},
{
  name: "Rosca Direta com Halteres",
  muscleGroup: "Bíceps",
  workoutType: "B",
  sets: 4,
  repsRange: "10-12",
  order: 4,
  videoUrl: "https://www.youtube.com/watch?v=6O_hVOEArG4",
  tip: "Cotovelos colados na lateral do corpo. Proibido balançar a coluna para ajudar a subir o peso. Movimento 100% no bíceps."
},
{
  name: "Rosca Martelo com Halteres",
  muscleGroup: "Bíceps",
  workoutType: "B",
  sets: 3,
  repsRange: "12",
  order: 5,
  videoUrl: "https://www.youtube.com/watch?v=YrZ0qzBi-kk",
  tip: "Segure o halter como se fosse um martelo (pegada neutra). Recruta o braquial e deixa o braço mais 'largo'."
}
```

### Treino C — Legs & Core (Quarta e Sábado)

```typescript
// Pernas, Abdómen

{
  name: "Agachamento Cálice com Kettlebell (Goblet Squat)",
  muscleGroup: "Pernas",
  workoutType: "C",
  sets: 4,
  repsRange: "12-15",
  order: 1,
  videoUrl: "https://www.youtube.com/watch?v=faUHN1hWERs",
  tip: "Segure o kettlebell na altura do peito. Agache até os cotovelos passarem por dentro dos joelhos. Coluna sempre reta."
},
{
  name: "Levantamento Terra Romeno (Stiff) com Halteres",
  muscleGroup: "Pernas",
  workoutType: "C",
  sets: 4,
  repsRange: "12",
  order: 2,
  videoUrl: "https://www.youtube.com/watch?v=cETLf4xXYCQ",
  tip: "O joelho dobra muito pouco. Foco em empurrar os glúteos para trás até sentir a posterior da coxa 'alongar' e repuxar."
},
{
  name: "Passada/Avanço com Halteres",
  muscleGroup: "Pernas",
  workoutType: "C",
  sets: 4,
  repsRange: "10 cada perna",
  order: 3,
  videoUrl: "https://www.youtube.com/watch?v=LCXGqMBlKHs",
  tip: "Dê um passo largo à frente e desça o quadril em linha reta, formando 90 graus nas duas pernas."
},
{
  name: "Abdominal Curto no Tapete",
  muscleGroup: "Core",
  workoutType: "C",
  sets: 4,
  repsRange: "20",
  order: 4,
  videoUrl: "https://www.youtube.com/watch?v=e2-sbbit3TI",
  tip: "Não puxe o pescoço com as mãos. O movimento é curto: tire apenas as omoplatas do chão e esmague o abdómen."
},
{
  name: "Prancha Isométrica no Tapete",
  muscleGroup: "Core",
  workoutType: "C",
  sets: 4,
  repsRange: "até a falha",
  order: 5,
  videoUrl: "https://www.youtube.com/watch?v=3qTz7853Yiw",
  tip: "O quadril não pode nem cair nem ficar levantado. O corpo deve ser uma linha reta perfeita e rígida."
}
```

---

## Mapa Dia → Treino

Essa lógica será usada para determinar o treino do dia automaticamente:

```typescript
const WORKOUT_SCHEDULE: Record<number, "A" | "B" | "C" | "REST"> = {
  1: "A", // Segunda
  2: "B", // Terça
  3: "C", // Quarta
  4: "A", // Quinta
  5: "B", // Sexta
  6: "C", // Sábado
  0: "REST", // Domingo
};

// Uso:
const today = new Date().getDay(); // 0=Dom, 1=Seg, ...
const todayWorkout = WORKOUT_SCHEDULE[today];
```

---

## ✅ Checklist

- [ ] Array `EXERCISES_SEED` completo em `src/data/exercises.ts`
- [ ] Mapa `WORKOUT_SCHEDULE` definido
- [ ] Função `seedExercisesIfEmpty()` implementada
- [ ] 15 exercícios totais (5 Push + 5 Pull + 5 Legs&Core)
- [ ] Todos com URLs de vídeo válidas
- [ ] Todas as dicas preenchidas

---

## Próximo: [06-feature-treino-do-dia.md](./06-feature-treino-do-dia.md)
