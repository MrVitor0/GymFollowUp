# 00 — Visão Geral do Projeto

## 🎯 Objetivo

Criar um SaaS pessoal de acompanhamento de treino (Gym Follow Up) — single-user, sem autenticação, 100% Firebase. Substituir o controle atual feito via WhatsApp por uma interface web bonita, moderna, responsiva e funcional.

---

## 🧱 Tech Stack

| Camada      | Tecnologia                          |
| ----------- | ----------------------------------- |
| Framework   | **Next.js 16** (App Router)         |
| UI          | **Tailwind CSS v4** + animações CSS |
| Ícones      | **Lucide React**                    |
| Backend/DB  | **Firebase Firestore**              |
| Hosting     | **Vercel** (ou Firebase Hosting)    |
| Vídeos      | YouTube Embeds (iframe)             |
| Charts      | **Recharts** (lightweight)          |
| Estado      | React hooks nativos (sem lib extra) |
| Data Import | Upload JSON nativo (File API)       |

---

## 🧩 Features Principais

### A) Treino do Dia + Log de Séries

- Exibir o treino correto baseado no dia da semana (PPL Split)
- Para cada exercício: nome, séries esperadas, botão de vídeo tutorial
- Logar o que foi realmente executado (ex: 2×15 + 2×12)
- Marcar exercício como concluído e avançar para o próximo
- Histórico completo de execuções por exercício

### B) Vídeo Tutorial Inline

- Cada exercício tem um link de YouTube associado
- Ao clicar, abre um iframe/modal com o vídeo embutido
- Sem sair da página, sem perder contexto

### C) Log de Caminhada (Thread 0)

- Registrar km percorridos e minutos de caminhada do dia
- Velocidade (2.5–4.0 km/h) como referência
- Histórico com gráfico de evolução

### D) Composição Corporal (Relax Fit Import)

- Upload de arquivo JSON exportado da balança Relax Fit
- Campos: peso, gordura corporal, sal, proteína, água, músculo, IMC, etc.
- Log diário com gráficos de evolução por métrica

---

## 🏗️ Arquitetura Simplificada

```
Browser (Next.js SSR/CSR)
    │
    ├── Pages (App Router)
    │     ├── / .................. Dashboard (treino do dia + resumo)
    │     ├── /historico ......... Histórico de treinos
    │     ├── /caminhada ......... Log de caminhada
    │     └── /corpo ............. Composição corporal
    │
    ├── Components
    │     ├── UI primitivos (Card, Button, Modal, Badge, etc.)
    │     ├── ExerciseCard
    │     ├── SetLogger
    │     ├── VideoModal
    │     ├── WalkingForm
    │     ├── BodyCompositionForm
    │     └── Charts (ProgressChart, BodyChart)
    │
    └── Firebase Firestore (NoSQL)
          ├── exercises (dados estáticos dos exercícios)
          ├── workoutLogs (log de cada treino executado)
          ├── walkingLogs (log de caminhada diário)
          └── bodyLogs (composição corporal diária)
```

---

## 📐 Princípios de Design

1. **Dark mode by default** — tema escuro elegante, com acentos de cor vibrantes
2. **Glassmorphism + Neumorphism leve** — cards com blur, sombras suaves, bordas arredondadas (rounded-2xl/3xl)
3. **Micro-animações** — transições suaves em hover, entrada de cards com fade + slide
4. **Mobile-first** — toda UI pensada primeiro para celular, depois adaptada para desktop
5. **Zero friction** — mínimo de cliques para logar um treino completo
6. **Feedback visual** — cores de status (verde=concluído, amarelo=parcial, cinza=pendente)

---

## 📅 Rotina Semanal (PPL Split)

| Dia     | Treino                            | Tipo |
| ------- | --------------------------------- | ---- |
| Segunda | **Push** — Peito, Ombro, Tríceps  | A    |
| Terça   | **Pull** — Costas, Bíceps         | B    |
| Quarta  | **Legs & Core** — Pernas, Abdómen | C    |
| Quinta  | **Push** — Peito, Ombro, Tríceps  | A    |
| Sexta   | **Pull** — Costas, Bíceps         | B    |
| Sábado  | **Legs & Core** — Pernas, Abdómen | C    |
| Domingo | **Descanso Ativo** — Só caminhada | Rest |

---

## 📦 Dependências Novas a Instalar

```bash
pnpm add firebase recharts
```

Somente 2 dependências novas. Tudo mais usa o que já existe (Tailwind, Lucide, React 19).

---

## 🚀 Ordem de Execução

Os próximos documentos detalham cada fase na ordem cronológica:

1. `01-setup-firebase.md` — Configurar Firebase project + Firestore
2. `02-modelagem-dados.md` — Schema das collections no Firestore
3. `03-estrutura-projeto.md` — Estrutura de pastas e arquivos
4. `04-design-system.md` — Sistema de design, cores, componentes base
5. `05-seed-exercicios.md` — Dados seed dos exercícios do plano PPL
6. `06-feature-treino-do-dia.md` — Tela principal: treino do dia + log
7. `07-feature-historico.md` — Histórico e progresso dos treinos
8. `08-feature-caminhada.md` — Log de caminhada diário
9. `09-feature-composicao-corporal.md` — Import JSON + log corporal
10. `10-responsividade-polish.md` — Ajustes finais, responsividade, deploy
