# 10 — Responsividade, Polish e Deploy

## 🎯 Objetivo

Ajustes finais de responsividade, animações, performance, e deploy do app.

---

## 📱 Responsividade — Checklist por Página

### Todas as Páginas

- [ ] Bottom nav no mobile (< 640px), top nav no desktop
- [ ] Padding lateral: `px-4` (mobile) → `px-6` (tablet) → `px-8` (desktop)
- [ ] Max-width do conteúdo: `max-w-2xl mx-auto` (evitar linhas muito longas)
- [ ] Font sizes reduzidos em mobile onde necessário
- [ ] Touch targets mínimo 44×44px em todos os botões/inputs

### `/` (Treino do Dia)

- [ ] Cards de exercício em stack vertical (todas as telas)
- [ ] SetLogger inputs suficientemente largos para digitar no celular
- [ ] VideoModal ocupa 100% da tela no mobile
- [ ] Header condensado no mobile (nome do dia menor)

### `/historico`

- [ ] Stats grid: 2×2 no mobile, 4×1 no desktop
- [ ] Filtros de tipo: scroll horizontal no mobile se necessário
- [ ] Cards de sessão ocupam largura total

### `/caminhada`

- [ ] Form e gráfico em stack no mobile, side-by-side no desktop
- [ ] Gráfico com altura adequada no mobile (min-h-[200px])
- [ ] Tabela de logs com scroll horizontal no mobile

### `/corpo`

- [ ] Grid de métricas: 2×3 no mobile, 3×2 no tablet, 6×1 no desktop
- [ ] Drop zone suficientemente grande no mobile
- [ ] Gráfico com min-h-[200px]
- [ ] Tabela com scroll horizontal

---

## ✨ Polish Visual

### Transições de Página

- Usar transições suaves entre rotas (CSS transitions no layout)
- Conteúdo entra com `fadeSlideUp` ao mudar de página

### Skeleton Loading

- Enquanto dados do Firestore carregam, exibir skeletons
- Cards com shimmer effect (gradient animado)
- Evitar layout shift (CLS) mantendo dimensões fixas

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #1a1a2e 25%, #2a2a3e 50%, #1a1a2e 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.75rem;
}
```

### Empty States

- Se não há logs de caminhada: ilustração + CTA "Registre sua primeira caminhada"
- Se não há dados corporais: "Importe seu primeiro JSON da Relax Fit"
- Se é domingo: card especial de descanso ativo

### Feedback Haptic (mobile)

- Não há API nativa, mas usar `active:scale-95` para feedback tátil visual

---

## ⚡ Performance

### Firebase

- Limitar queries com `limit()` — nunca buscar todos os documentos
- Usar `onSnapshot` apenas onde real-time é necessário (treino do dia)
- Para histórico e gráficos, usar `getDocs` (fetch único)
- Debounce de 500ms nos auto-saves

### Next.js

- React Compiler já ativado (sem necessidade de `useMemo`/`useCallback` manual)
- Lazy load do Recharts: `dynamic(() => import('recharts'), { ssr: false })`
- Lazy load do VideoModal (só carrega quando abre)
- `loading.tsx` em cada rota para feedback de carregamento

### Imagens

- Sem imagens externas pesadas (app é 100% UI)
- Ícones via Lucide (SVG inline, leve)

---

## 🔒 Segurança Mínima

Mesmo sendo single-user, boas práticas:

- [ ] Env vars no `.env.local` (nunca hardcoded)
- [ ] `.env.local` no `.gitignore`
- [ ] Firestore rules em test mode (documentar que é intencional)
- [ ] Sanitizar JSON importado (não executar código, apenas parsear dados)
- [ ] Validar tipos dos dados antes de salvar no Firestore

---

## 🚀 Deploy

### Opção 1: Vercel (recomendado)

1. Push para GitHub (repo `GymFollowUp`)
2. Conectar repo no Vercel
3. Configurar env vars no Vercel dashboard
4. Deploy automático a cada push na `main`

### Opção 2: Firebase Hosting

1. `pnpm add -D firebase-tools`
2. `npx firebase init hosting`
3. Configurar como SPA com rewrite para `index.html`
4. `pnpm build && npx firebase deploy`

**Recomendação:** Vercel — zero config para Next.js, deploy instantâneo, preview por PR.

---

## 🧪 Testes Manuais Finais

### Mobile (iPhone SE + Pixel 5 via DevTools)

- [ ] Navbar bottom funciona e não sobrepõe conteúdo
- [ ] Inputs são acessíveis e tamanho adequado
- [ ] Scroll é suave em todas as páginas
- [ ] Modals ocupam tela inteira e são fecháveis
- [ ] Gráficos são legíveis (labels não cortados)

### Desktop (1440px+)

- [ ] Layout não estica demais (max-width funciona)
- [ ] Hover effects ativos em todos os cards e botões
- [ ] Navbar top está funcional
- [ ] Conteúdo centralizado e balanceado

### Funcional

- [ ] Logar um treino completo do início ao fim
- [ ] Voltar no dia seguinte e ver o histórico
- [ ] Logar caminhada e ver o gráfico atualizar
- [ ] Importar JSON de composição corporal
- [ ] Alternar entre todas as 4 páginas sem erros

---

## 📋 Ordem Final de Implementação (Resumo)

```
Fase 1 — Base
  ├── 01: Setup Firebase
  ├── 02: Types/Models
  ├── 03: Estrutura de pastas + lib/firestore.ts
  └── 04: Design system (componentes base + globals.css)

Fase 2 — Core
  ├── 05: Seed de exercícios
  ├── 06: Treino do dia (página principal)
  └── 07: Histórico de treinos

Fase 3 — Features Complementares
  ├── 08: Log de caminhada
  └── 09: Composição corporal

Fase 4 — Polish
  └── 10: Responsividade, animações, deploy
```

Cada fase é funcional por si — pode-se testar e usar o app progressivamente.

---

## ✅ Checklist Final

- [ ] Todas as 4 páginas responsivas e testadas
- [ ] Animações suaves (entrada, transição, conclusão)
- [ ] Skeleton loading em todos os estados de carregamento
- [ ] Empty states com CTAs claros
- [ ] Performance ok (Lighthouse > 90)
- [ ] Deploy funcional (Vercel ou Firebase)
- [ ] Env vars configuradas em produção
- [ ] README atualizado com instruções de setup

---

**🎉 Projeto completo!**
