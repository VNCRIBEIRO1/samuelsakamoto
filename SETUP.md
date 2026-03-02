# 🏛️ Template — Site Institucional para Escritórios de Advocacia

Sistema completo de website + CMS para escritórios de advocacia, com agendamento online, chatbot inteligente, calculadora de direitos, blog, integração Google Calendar e painel administrativo.

---

## 🚀 Quick Setup (5 passos)

### 1. Clonar e Instalar

```bash
git clone <seu-repositorio>
cd <nome-do-projeto>
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

**Variáveis obrigatórias:**

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL do PostgreSQL (Neon, Supabase, etc.) |
| `DATABASE_URL_UNPOOLED` | URL direta do PostgreSQL (para migrações) |
| `JWT_SECRET` | Chave secreta para tokens JWT (mín. 32 caracteres) |
| `ADMIN_KEY` | Chave para registro do primeiro admin |
| `NEXT_PUBLIC_SITE_URL` | URL do site em produção |

**Variáveis opcionais (Google Calendar):**

| Variável | Descrição |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID do Google Cloud OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google Cloud OAuth |
| `GOOGLE_REDIRECT_URI` | URI de callback: `{SITE_URL}/api/google/callback` |

### 3. Personalizar o Site

Edite **2 arquivos** para adaptar todo o conteúdo:

#### `src/lib/site-config.ts`
Contém TODOS os dados do escritório: nome, endereço, telefone, equipe, áreas de atuação, depoimentos, horários, Google Reviews etc.

#### `src/lib/images.ts`
Mapeamento de todas as imagens do site. Substitua pelos caminhos das suas imagens em `public/images/`.

### 4. Configurar Banco de Dados

```bash
npx prisma db push
```

### 5. Criar Primeiro Usuário Admin

```bash
npm run dev
```

Acesse `http://localhost:3000/painel/login` e clique em "Registrar". Use a `ADMIN_KEY` definida no `.env.local`.

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas do site (Next.js App Router)
│   ├── page.tsx            # Homepage
│   ├── sobre/              # Página Sobre
│   ├── areas-de-atuacao/   # Áreas de Atuação
│   ├── blog/               # Blog com artigos
│   ├── contato/            # Formulário de contato
│   ├── agendamento/        # Agendamento online público
│   ├── calculadora-de-direitos/ # Calculadora lead magnet
│   ├── painel/             # CMS Administrativo
│   │   ├── agenda/         # Gestão de compromissos
│   │   ├── clientes/       # Gestão de clientes
│   │   ├── processos/      # Gestão de processos
│   │   ├── financeiro/     # Controle financeiro
│   │   ├── prazos/         # Prazos processuais
│   │   ├── triagem/        # Leads do chatbot
│   │   └── configuracoes/  # Conta e Google Calendar
│   └── api/                # APIs REST
├── components/             # Componentes React reutilizáveis
├── lib/                    # Configurações e utilitários
│   ├── site-config.ts      # ⭐ CONFIGURAÇÃO PRINCIPAL
│   ├── images.ts           # ⭐ MAPEAMENTO DE IMAGENS
│   ├── articles.ts         # Artigos do blog
│   ├── auth.ts             # Autenticação JWT
│   ├── google-calendar.ts  # Integração Google Calendar
│   └── prisma.ts           # Cliente Prisma
└── middleware.ts            # Proteção de rotas
```

---

## 🎨 Personalização Avançada

### Cores
O tema usa Tailwind CSS. Edite `tailwind.config.ts` para alterar as cores:
- **Primary** (verde escuro): `#1a2e1f`
- **Gold** (dourado): `#c9a84c`
- **Secondary** (cinza): escala neutral

### Blog
Edite `src/lib/articles.ts` para adicionar/remover artigos. Cada artigo é um objeto com: `slug`, `title`, `category`, `date`, `readTime`, `excerpt`, `content` (HTML).

### Chatbot
O chatbot em `src/components/ChatBot.tsx` faz triagem automática de leads. Personalize as perguntas, áreas de atuação e respostas conforme seu escritório.

### Calculadora de Direitos
A calculadora em `src/app/calculadora-de-direitos/` é um lead magnet que calcula estimativas de valores trabalhistas. Adapte para suas áreas de atuação.

---

## 🔧 Google Calendar (Opcional)

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a API Google Calendar
3. Configure OAuth 2.0 com redirect URI: `{SEU_DOMINIO}/api/google/callback`
4. Adicione as variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` no `.env.local`
5. No painel, vá em Configurações → Google Calendar → Conectar

---

## 🚀 Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

---

## 📋 Checklist de Personalização

- [ ] Nome do escritório em `site-config.ts`
- [ ] Dados de contato (telefone, email, endereço)
- [ ] Equipe / sócios
- [ ] Áreas de atuação
- [ ] Depoimentos de clientes
- [ ] Artigos do blog em `articles.ts`
- [ ] Imagens em `public/images/` + referências em `images.ts`
- [ ] Variáveis de ambiente em `.env.local`
- [ ] Cores do tema em `tailwind.config.ts` (opcional)
- [ ] Chatbot em `ChatBot.tsx` (opcional)
- [ ] Calculadora em `CalculadoraClient.tsx` (opcional)
- [ ] Google Calendar configurado (opcional)
- [ ] Deploy na Vercel

---

## 📄 Licença

Template desenvolvido por VNCRIBEIRO. Uso livre para projetos comerciais.
