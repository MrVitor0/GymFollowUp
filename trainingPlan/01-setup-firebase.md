# 01 — Setup Firebase

## 🎯 Objetivo

Configurar o projeto Firebase e conectar ao Next.js. Sem Authentication — apenas Firestore Database.

---

## Passo 1: Criar Projeto Firebase

1. Acessar [Firebase Console](https://console.firebase.google.com)
2. Criar projeto: **GymFollowUp**
3. Desabilitar Google Analytics (desnecessário para uso pessoal)
4. Aguardar criação

---

## Passo 2: Ativar Firestore Database

1. No console Firebase → **Build → Firestore Database**
2. Clicar **"Create database"**
3. Escolher região: **europe-west1** (ou a mais próxima)
4. Iniciar em **Test Mode** (regras abertas — single user, sem auth)

### Regras do Firestore (simplificadas para uso pessoal)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Single user, sem auth — permite tudo
      // NOTA: em produção com múltiplos usuários, restringir com auth
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Isso é seguro **apenas** porque é um app single-user pessoal. Nunca usar regras abertas em apps com múltiplos usuários.

---

## Passo 3: Registrar Web App

1. No console Firebase → **Project Settings → General**
2. Clicar em **"Add app"** → ícone Web (`</>`)
3. Nome: **GymFollowUp Web**
4. **Não** habilitar Firebase Hosting (vamos usar Vercel)
5. Copiar as config keys geradas

---

## Passo 4: Instalar SDK

```bash
pnpm add firebase
```

---

## Passo 5: Criar Arquivo de Configuração

### Arquivo: `src/lib/firebase.ts`

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar múltiplas vezes em dev (HMR)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
```

### Arquivo: `.env.local` (não commitar)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Arquivo: `.env.example` (commitar como referência)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Passo 6: Adicionar ao `.gitignore`

Verificar que `.env.local` já está no `.gitignore` (Next.js faz isso por padrão). Se não estiver:

```gitignore
.env.local
```

---

## Passo 7: Configurar Domínio no Next.js (para iframes do YouTube)

No `next.config.ts`, não é necessário nenhuma config especial para iframes do YouTube. Porém, se formos usar imagens externas no futuro:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // images: { remotePatterns: [...] } se necessário no futuro
};

export default nextConfig;
```

---

## ✅ Checklist de Validação

- [ ] Projeto Firebase criado
- [ ] Firestore Database ativa em test mode
- [ ] Web App registrada e config keys obtidas
- [ ] `firebase` instalado via pnpm
- [ ] `src/lib/firebase.ts` criado
- [ ] `.env.local` com as keys reais
- [ ] `.env.example` commitado como referência
- [ ] App Next.js roda sem erros (`pnpm dev`)
- [ ] Console sem warnings de Firebase

---

## Próximo: [02-modelagem-dados.md](./02-modelagem-dados.md)
