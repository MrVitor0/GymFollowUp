# 04 — Design System

## 🎯 Objetivo

Definir a identidade visual, paleta de cores, tipografia, componentes base e padrões visuais para criar uma interface moderna, elegante e com personalidade.

---

## 🎨 Paleta de Cores

### Tema escuro (default)

| Token                | Hex         | Uso                                   |
| -------------------- | ----------- | ------------------------------------- |
| `--bg-primary`       | `#0a0a0f`   | Fundo principal (quase preto azulado) |
| `--bg-secondary`     | `#12121a`   | Cards, surfaces                       |
| `--bg-tertiary`      | `#1a1a2e`   | Cards hover, elevação 2               |
| `--border`           | `#2a2a3e`   | Bordas sutis                          |
| `--border-hover`     | `#3a3a5e`   | Bordas em hover                       |
| `--text-primary`     | `#f0f0f5`   | Texto principal                       |
| `--text-secondary`   | `#8888aa`   | Texto secundário, labels              |
| `--text-muted`       | `#555570`   | Texto terciário, placeholders         |
| `--accent-blue`      | `#6366f1`   | Accent principal (indigo)             |
| `--accent-blue-glow` | `#6366f140` | Glow do accent                        |
| `--success`          | `#22c55e`   | Concluído, positivo                   |
| `--warning`          | `#f59e0b`   | Em progresso, atenção                 |
| `--error`            | `#ef4444`   | Erro, falha                           |
| `--push-color`       | `#f97316`   | Treino A — Push (laranja)             |
| `--pull-color`       | `#3b82f6`   | Treino B — Pull (azul)                |
| `--legs-color`       | `#a855f7`   | Treino C — Legs (roxo)                |
| `--rest-color`       | `#22c55e`   | Descanso ativo (verde)                |

---

## 🔤 Tipografia

Manter Geist Sans (já configurado) — é clean e moderna.

| Uso          | Tamanho                                    | Peso            |
| ------------ | ------------------------------------------ | --------------- |
| Heading (h1) | `text-3xl` (mobile) / `text-4xl` (desktop) | `font-bold`     |
| Heading (h2) | `text-xl` / `text-2xl`                     | `font-semibold` |
| Body         | `text-base`                                | `font-normal`   |
| Small/Label  | `text-sm`                                  | `font-medium`   |
| Caption      | `text-xs`                                  | `font-normal`   |

---

## 🃏 Card Style (Glassmorphism + Neumorphism)

O card é o componente central. Aparência "flutuante" com profundidade.

```css
/* Card base */
.card {
  background: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(42, 42, 62, 0.5);
  border-radius: 1.25rem; /* rounded-2xl */
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card hover — leve elevação */
.card:hover {
  border-color: rgba(58, 58, 94, 0.7);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}
```

### Implementação com Tailwind (componente `Card.tsx`)

```tsx
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
      bg-[#12121a]/80 backdrop-blur-xl
      border border-[#2a2a3e]/50
      rounded-2xl
      shadow-[0_4px_24px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
      hover:border-[#3a3a5e]/70
      hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      hover:-translate-y-0.5
      transition-all duration-300 ease-out
      ${className ?? ""}
    `}
    >
      {children}
    </div>
  );
}
```

---

## 🔘 Botões

### Primary Button

```
bg-indigo-500 hover:bg-indigo-400
text-white font-medium
rounded-xl px-5 py-2.5
shadow-[0_0_20px_rgba(99,102,241,0.3)]
hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
transition-all duration-200
active:scale-95
```

### Secondary Button

```
bg-transparent border border-[#2a2a3e]
text-[#8888aa] hover:text-[#f0f0f5]
hover:border-[#3a3a5e]
rounded-xl px-5 py-2.5
transition-all duration-200
```

### Icon Button (para vídeo tutorial)

```
bg-red-500/10 hover:bg-red-500/20
text-red-400 hover:text-red-300
rounded-xl p-2.5
transition-all duration-200
```

---

## 🏷️ Badges (Status)

| Estado    | Estilo                                                     |
| --------- | ---------------------------------------------------------- |
| Pendente  | `bg-zinc-800 text-zinc-400 border-zinc-700`                |
| Em curso  | `bg-amber-500/10 text-amber-400 border-amber-500/20`       |
| Concluído | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` |
| Push (A)  | `bg-orange-500/10 text-orange-400 border-orange-500/20`    |
| Pull (B)  | `bg-blue-500/10 text-blue-400 border-blue-500/20`          |
| Legs (C)  | `bg-purple-500/10 text-purple-400 border-purple-500/20`    |

Todos com `rounded-full px-3 py-1 text-xs font-medium border`.

---

## 📱 Navbar (Bottom Navigation — Mobile)

```
Fixo no fundo da tela (mobile):
- h-16 bg-[#0a0a0f]/90 backdrop-blur-xl
- border-t border-[#2a2a3e]/50
- 4 items distribuídos com flex justify-around
- Cada item: ícone Lucide (20px) + label (text-xs)
- Item ativo: text-indigo-400, ícone filled
- Item inativo: text-zinc-500

Desktop (md+):
- Top bar horizontal, h-16
- Logo à esquerda
- Nav items ao centro
- Mesma lógica de ativo/inativo
```

---

## ✨ Animações e Micro-interações

### Entrada de Cards (staggered)

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-slide-up {
  animation: fadeSlideUp 0.4s ease-out forwards;
}
```

Aplicar com delay escalonado via `style={{ animationDelay: '${index * 80}ms' }}`.

### Transição de Conclusão

Quando um exercício é marcado como concluído:

- Borda do card pulsa em verde brevemente
- Badge muda de "Pendente" → "Concluído" com transição suave
- Próximo exercício ganha destaque com borda accent

### Contador de Séries

Quando uma série é logada:

- Número aparece com `scale(0) → scale(1)` bounce
- Check icon aparece com fade

### Glow sutil nos elementos interativos

```css
.glow-hover:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
}
```

---

## 📱 Breakpoints Responsivos

| Breakpoint | Largura  | Layout                              |
| ---------- | -------- | ----------------------------------- |
| Mobile     | < 640px  | Stack vertical, bottom nav, 1 col   |
| Tablet     | 640-1024 | 2 cols grid, top nav                |
| Desktop    | > 1024   | 2-3 cols grid, top nav, mais espaço |

---

## 🖼️ Componentes Base a Construir

1. **`Card`** — Container principal (glassmorphism)
2. **`Button`** — Variantes: primary, secondary, icon, danger
3. **`Badge`** — Status labels com cores (rounded-full)
4. **`Modal`** — Overlay com backdrop blur + card central
5. **`Input`** — Estilizado com bg escuro, border sutil, focus ring indigo
6. **`ProgressBar`** — Barra de progresso animada com gradient

Todos com props `className?` para extensibilidade.

---

## 🎯 Referência Visual

O visual geral evoca:

- **Linear.app** (limpo, dark, glassmorphism)
- **Raycast** (rounded, elegant, micro-animations)
- **Arc Browser** (3D feel, depth, personality)

Sem ser cópia — apenas inspiração para o nível de polish.

---

## ✅ Checklist

- [ ] CSS variables definidas no `globals.css`
- [ ] Componentes `Card`, `Button`, `Badge`, `Modal`, `Input`, `ProgressBar` criados
- [ ] Animações de entrada (fadeSlideUp) registradas
- [ ] Navbar responsiva (bottom no mobile, top no desktop)
- [ ] Cores de cada treino (Push/Pull/Legs) aplicáveis via props
- [ ] Visual validado no DevTools mobile (iPhone SE, Pixel 5)

---

## Próximo: [05-seed-exercicios.md](./05-seed-exercicios.md)
