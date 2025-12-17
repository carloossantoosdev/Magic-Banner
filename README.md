# 🚀 Magic Banner Plugin

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase&logoColor=white)
  
  **Exiba banners personalizados em qualquer e-commerce com uma única linha de código**
  
  Plugin de banners dinâmicos que aparecem automaticamente com base na URL e horário de exibição.

</div>

---

## 📋 Sobre o Projeto

O **Magic Banner Plugin** é uma aplicação Next.js full stack desenvolvida como parte do desafio técnico da **Futuriza**. Permite criar e exibir banners personalizados em páginas de e-commerce, com base na URL atual do site e, opcionalmente, no horário de exibição.

### ✨ Funcionalidades Implementadas

#### 🎨 **Interface e Design**
- ✅ **Landing Page Completa** - Página inicial com documentação e exemplos
- ✅ **Painel Administrativo** - Interface intuitiva para gerenciar banners
- ✅ **Dark Theme Moderno** - Design escuro com acentos cyan/turquesa
- ✅ **Responsivo** - Funciona perfeitamente em desktop e mobile
- ✅ **Preview em Tempo Real** - Visualize o banner antes de criar

#### 🔐 **Autenticação e Segurança**
- ✅ **Autenticação Supabase** - Login com email e senha
- ✅ **Middleware de Proteção** - Rotas admin protegidas
- ✅ **Sessão Persistente** - Mantém usuário logado
- ✅ **Logout Seguro** - Encerra sessão corretamente

#### 📦 **Gestão de Banners**
- ✅ **Criar Banners** - Formulário completo com validação
- ✅ **Listar Banners** - Visualize todos os banners criados
- ✅ **Excluir Banners** - Remova banners com confirmação
- ✅ **Toggle Ativo/Inativo** - Ative/desative banners com um clique
- ✅ **Múltiplos Banners por URL** - Cadastre vários, mas apenas 1 ativo por vez

#### 🖼️ **Imagens**
- ✅ **Upload de Imagem** - Faça upload direto para Supabase Storage
- ✅ **URL Externa** - Use links de imagens hospedadas
- ✅ **Validação de Tipo** - Aceita apenas imagens válidas
- ✅ **Exclusão Automática** - Remove imagem do storage ao excluir banner

#### ⏰ **Agendamento**
- ✅ **Horário de Exibição** - Configure início e fim (opcional)
- ✅ **Validação por Timezone** - Horário local do usuário
- ✅ **Desativação Automática** - Banner some fora do horário configurado
- ✅ **Ativação Manual** - Override manual sempre respeitando horário

#### 🎯 **Script Embutível**
- ✅ **Vanilla JavaScript** - Sem dependências externas
- ✅ **CORS Habilitado** - Funciona em qualquer domínio
- ✅ **Detecção Automática** - Captura URL e busca banner correspondente
- ✅ **Efeitos Visuais** - Animações suaves de entrada/saída
- ✅ **Botão de Fechar** - Usuário pode fechar o banner
- ✅ **Responsivo** - Adapta-se a qualquer tamanho de tela

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4 + shadcn/ui
- **Banco de Dados:** Supabase PostgreSQL
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage
- **Package Manager:** Yarn
- **Deploy:** Vercel
- **Ícones:** Lucide React

---

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/carloossantoosdev/Magic-Banner.git
cd Magic-Banner
```

### 2. Instale as Dependências

```bash
yarn install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Onde encontrar:**
- Vá no [Supabase Dashboard](https://app.supabase.com)
- Selecione seu projeto
- **Settings** → **API**
- Copie **Project URL** e **anon/public key**

### 4. Configure o Supabase

#### 4.1 Criar Tabela de Banners

No **SQL Editor** do Supabase, execute:

```sql
-- Criação da tabela banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('upload', 'url')),
  start_time TIME,
  end_time TIME,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por URL
CREATE INDEX IF NOT EXISTS idx_banners_url ON banners(url);

-- Índice para busca por status ativo
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
```

#### 4.2 Criar Storage Bucket

1. Vá em **Storage** no painel do Supabase
2. Clique em **New bucket**
3. **Nome:** `banner-images`
4. **Public bucket:** ✅ Marque como público
5. Clique em **Create bucket**

#### 4.3 Configurar Políticas RLS do Storage

No **SQL Editor**, execute:

```sql
-- Política de SELECT (leitura pública)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banner-images');

-- Política de INSERT (upload)
CREATE POLICY "Allow authenticated insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'banner-images');

-- Política de DELETE (exclusão)
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'banner-images');
```

#### 4.4 Criar Conta de Usuário

1. Vá em **Authentication** → **Users**
2. Clique em **Add user**
3. **Email:** seu-email@example.com
4. **Password:** SenhaSegura123!
5. Clique em **Create user**

**Ou** crie pelo próprio app na tela de login após iniciar o projeto.

### 5. Execute o Projeto

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 📖 Como Usar

### Passo 1: Acessar o Painel Admin

1. Abra: `http://localhost:3000`
2. Clique em **"Acessar Painel"**
3. Faça login ou crie uma conta
4. Você será redirecionado para `/admin`

### Passo 2: Criar um Banner

1. No painel admin, preencha o formulário:
   - **URL de Destino:** URL completa onde o banner aparecerá
     - Exemplo: `https://minhaloja.com/produto/123`
   - **Imagem:** 
     - **Opção 1:** Upload de arquivo (até 5MB)
     - **Opção 2:** Cole a URL de uma imagem
   - **Horário de Exibição (opcional):**
     - **Início:** 08:00
     - **Fim:** 18:00
2. Clique em **"Criar Banner"**
3. ✅ Banner aparece na lista abaixo

### Passo 3: Gerenciar Banners

- **Ativar/Desativar:** Use o switch para controlar se o banner está ativo
- **Excluir:** Clique no botão vermelho para remover o banner
- **Múltiplos Banners:** Crie vários para a mesma URL, mas apenas 1 pode estar ativo

### Passo 4: Integrar no seu Site

1. Copie o script exibido no topo do painel admin:

```html
<script src="http://localhost:3000/magic-banner.js"></script>
```

2. Cole no HTML da sua página **antes do `</body>`**:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Loja</title>
</head>
<body>
  <!-- Conteúdo da sua página -->
  <h1>Bem-vindo à Minha Loja!</h1>
  
  <!-- Script do Magic Banner -->
  <script src="http://localhost:3000/magic-banner.js"></script>
</body>
</html>
```

3. Quando acessar essa página, o banner aparecerá automaticamente no topo!

---

## 🏗️ Estrutura do Projeto

```
MagicBanner/
├── src/
│   ├── app/
│   │   ├── admin/              # Painel administrativo
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── banners/        # API Routes
│   │   │       ├── route.ts    # GET, POST, DELETE
│   │   │       ├── all/
│   │   │       │   └── route.ts # GET /api/banners/all
│   │   │       └── toggle/
│   │   │           └── route.ts # PATCH /api/banners/toggle
│   │   ├── login/              # Página de login/signup
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Estilos globais + tema
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── switch.tsx
│   │   │   └── textarea.tsx
│   │   ├── Header.tsx          # Header com auth
│   │   ├── BannerForm.tsx      # Formulário de criação
│   │   ├── BannerList.tsx      # Lista de banners
│   │   └── BannerCard.tsx      # Card individual com toggle
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase
│   │   ├── types.ts            # Tipos TypeScript
│   │   └── utils.ts            # Utilidades (cn)
│   └── middleware.ts           # Proteção de rotas
├── public/
│   └── magic-banner.js         # Script embutível
├── .env.local                  # Variáveis de ambiente
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### `GET /api/banners?url=<URL>`
Busca banner ativo para uma URL específica.

**Parâmetros:**
- `url` (query) - URL encoded

**Resposta:**
```json
{
  "id": "uuid-do-banner",
  "url": "https://loja.com/produto/123",
  "image_url": "https://...",
  "image_type": "upload",
  "start_time": "08:00:00",
  "end_time": "18:00:00",
  "active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### `GET /api/banners/all`
Lista todos os banners (admin).

**Resposta:**
```json
[
  {
    "id": "uuid-1",
    "url": "https://loja.com/produto/123",
    "image_url": "https://...",
    "active": true,
    "created_at": "2025-01-01T00:00:00Z"
  },
  ...
]
```

### `POST /api/banners`
Cria novo banner.

**Body (FormData):**
- `url` (string) - URL de destino
- `image_type` (string) - 'upload' ou 'url'
- `image` (File | string) - Arquivo ou URL da imagem
- `start_time` (string, opcional) - HH:MM
- `end_time` (string, opcional) - HH:MM

**Resposta:**
```json
{
  "id": "novo-uuid",
  "url": "https://...",
  "image_url": "https://...",
  "active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### `PATCH /api/banners/toggle`
Ativa/desativa um banner.

**Body (JSON):**
```json
{
  "id": "uuid-do-banner",
  "active": true
}
```

**Comportamento:**
- Ao ativar um banner, desativa automaticamente outros banners da mesma URL

**Resposta:**
```json
{
  "id": "uuid-do-banner",
  "active": true,
  ...
}
```

### `DELETE /api/banners?id=<UUID>`
Deleta banner por ID.

**Parâmetros:**
- `id` (query) - UUID do banner

**Comportamento:**
- Remove registro do banco
- Remove imagem do Supabase Storage (se tipo 'upload')

**Resposta:**
```json
{
  "message": "Banner deletado com sucesso"
}
```

---

## 🎨 Design System

### Paleta de Cores

```css
/* Dark Theme */
--background: 0 0% 4%;           /* #0a0a0a */
--foreground: 0 0% 98%;          /* #fafafa */
--card: 0 0% 10%;                /* #1a1a1a */
--card-foreground: 0 0% 98%;
--primary: 188 85% 43%;          /* #14b8a6 - Turquesa */
--primary-foreground: 0 0% 100%;
--secondary: 0 0% 15%;
--secondary-foreground: 0 0% 98%;
--accent: 188 85% 43%;           /* #14b8a6 */
--muted: 0 0% 15%;
--border: 0 0% 20%;
--input: 0 0% 20%;
```

### Componentes Principais

- **Buttons:** Hover em cyan, bordas arredondadas
- **Cards:** Background dark com bordas sutis
- **Inputs:** Foco com border cyan
- **Switches:** Animação suave, cor cyan quando ativo
- **Badges:** Ícones + texto, variantes coloridas

---

## 📝 Decisões Técnicas

### Por que Next.js 16?
- **App Router** - Roteamento moderno com suporte a Server Components
- **API Routes** - Backend integrado sem precisar de servidor separado
- **SSR/SSG** - Performance otimizada
- **Deploy fácil** - Vercel com um clique

### Por que Supabase?
- **PostgreSQL** - Banco robusto e gratuito
- **Auth integrada** - Login pronto sem configuração complexa
- **Storage** - Hospedagem de imagens incluída
- **RLS** - Segurança em nível de linha (Row Level Security)
- **API automática** - REST e Realtime out-of-the-box

### Por que Vanilla JS no Script?
- **Compatibilidade universal** - Funciona em qualquer site, sem dependências
- **Leve** - Menos de 5KB
- **Sem conflitos** - Não interfere com frameworks existentes (React, Vue, etc)

### Estrutura src/
- Organização clara e separação de responsabilidades
- Padrão recomendado para projetos Next.js modernos
- Facilita manutenção e escalabilidade

### Lógica de Ativação
- **Apenas 1 banner ativo por URL** - Evita conflitos
- **Toggle manual** - Admin tem controle total
- **Validação de horário sempre ativa** - Segurança e consistência

### Desafios Resolvidos

1. **CORS** - Headers configurados em todas as rotas da API
2. **Hydration Mismatch** - `window.location.origin` usado apenas no client-side
3. **Upload de imagens** - Integração completa com Supabase Storage
4. **Timezone** - Validação no cliente para horário local correto
5. **Type Safety** - TypeScript em 100% do código
6. **Autenticação SSR** - Middleware com `@supabase/ssr` para proteção de rotas
7. **Real-time UI** - Atualização instantânea ao toggle de banners

---

## 🧪 Testando Localmente

### Teste 1: Criar e Visualizar Banner

1. Acesse `http://localhost:3000/admin`
2. Faça login
3. Crie um banner para a URL: `http://localhost:3000/test`
4. Acesse `http://localhost:3000/test` (404 normal)
5. ✅ Banner deve aparecer no topo mesmo na página 404!

### Teste 2: Script em HTML Externo

1. Crie um arquivo `teste.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Teste Magic Banner</title>
</head>
<body>
  <h1>Teste do Banner</h1>
  <p>O banner deve aparecer no topo desta página!</p>
  
  <script src="http://localhost:3000/magic-banner.js"></script>
</body>
</html>
```

2. Abra com Live Server (VS Code) ou navegador
3. Crie um banner no admin para a URL do teste (ex: `http://127.0.0.1:5500/teste.html`)
4. Recarregue a página
5. ✅ Banner deve aparecer!
6. Abra o Console (F12)
7. ✅ Deve ver: `[Magic Banner] Banner exibido com sucesso`

### Teste 3: Validação de Horário

1. Crie um banner com horário restrito (ex: 08:00 - 12:00)
2. Se estiver fora desse horário:
   - ✅ Banner NÃO aparece no site
   - ✅ No admin, banner aparece mas com status "fora do horário"
3. Ajuste o horário para incluir o momento atual
4. ✅ Banner volta a aparecer

### Teste 4: Múltiplos Banners

1. Crie 3 banners para a mesma URL
2. ✅ Apenas 1 pode estar ativo (switch)
3. Ative o banner 2
4. ✅ Banner 1 desativa automaticamente
5. Acesse a URL
6. ✅ Apenas banner 2 aparece

---

## 📦 Deploy na Vercel

### Passo 1: Push para GitHub

```bash
git add .
git commit -m "feat: projeto completo"
git push origin main
```

### Passo 2: Importar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Selecione o repositório `Magic-Banner`
4. Clique em **"Import"**

### Passo 3: Configurar Variáveis

Adicione as Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Passo 4: Deploy

Clique em **"Deploy"** e aguarde 2-3 minutos.

### Passo 5: Configurar Supabase para Produção

No Supabase Dashboard:

**Authentication** → **URL Configuration**
- **Site URL:** `https://seu-projeto.vercel.app`
- **Redirect URLs:** `https://seu-projeto.vercel.app/**`

### URLs Finais

Após o deploy:
- **Aplicação:** `https://seu-projeto.vercel.app`
- **Admin:** `https://seu-projeto.vercel.app/admin`
- **API:** `https://seu-projeto.vercel.app/api/banners`
- **Script:** `https://seu-projeto.vercel.app/magic-banner.js`

---

## ✅ Checklist de Funcionalidades

### Obrigatórias ✅
- [x] Painel administrativo (criar, listar, excluir)
- [x] Cadastro de banner com URL de destino
- [x] Imagem do banner (upload ou link)
- [x] Horário de exibição (opcional)
- [x] API que recebe URL e retorna banner
- [x] Script embutível (/public/magic-banner.js)
- [x] Script captura URL da página
- [x] Script faz requisição para API
- [x] Script exibe banner dinamicamente

### Diferenciais Implementados ✅
- [x] **Autenticação no painel** (Supabase Auth)
- [x] **Upload real de imagem** (Supabase Storage)
- [x] **Preview em tempo real** (visualização antes de criar)
- [x] **Efeitos visuais** (animações suaves, fade in/out)
- [x] **Landing page** (documentação e apresentação)
- [x] **Toggle ativo/inativo** (controle fino de exibição)
- [x] **Múltiplos banners por URL** (apenas 1 ativo)
- [x] **Dark theme moderno** (cyan/turquesa)
- [x] **Responsivo** (mobile-first)
- [x] **Conventional Commits** (histórico organizado)

---

## 🎯 Sobre o Desafio

Este projeto foi desenvolvido como parte do **Desafio Técnico da Futuriza**, uma empresa de tecnologia focada em acelerar o futuro do varejo com IA, automação e soluções inteligentes para e-commerce.

### Critérios Avaliados

| Critério | Status |
|----------|--------|
| **Organização de código** | ✅ Estrutura clara, componentes modulares |
| **Integração full stack** | ✅ Painel → API → Script funcionando |
| **Domínio de Next.js** | ✅ App Router, API Routes, Middleware |
| **Funcionalidade real** | ✅ Banner aparece dinamicamente |
| **UX/UI** | ✅ Design moderno, intuitivo e responsivo |
| **Documentação** | ✅ README completo com exemplos |

---

## 🐛 Troubleshooting

### Erro: "Could not find the 'active' column"

**Solução:** Execute o SQL para adicionar a coluna:
```sql
ALTER TABLE banners ADD COLUMN active BOOLEAN DEFAULT true;
```

### Erro: "Row-level security policy"

**Solução:** Configure as políticas RLS do Storage (ver seção 4.3).

### Banner não aparece no site

**Verificar:**
1. ✅ Banner está ativo no admin?
2. ✅ URL do banner corresponde EXATAMENTE à URL da página?
3. ✅ Horário atual está dentro do intervalo configurado?
4. ✅ Console (F12) mostra algum erro?

### Build failed na Vercel

**Verificar:**
1. ✅ `yarn build` funciona localmente?
2. ✅ Variáveis de ambiente estão configuradas?
3. ✅ Erros de TypeScript foram corrigidos?

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Carlos Santos** para o desafio técnico da **Futuriza**.

- **GitHub:** [@carloossantoosdev](https://github.com/carloossantoosdev)
- **LinkedIn:** [Carlos Santos](https://www.linkedin.com/in/carloossantoosdev/)
- **Repositório:** [Magic-Banner](https://github.com/carloossantoosdev/Magic-Banner)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.

---

<div align="center">
  
  **Magic Banner Plugin** - Desafio Técnico Futuriza 2025
  
  ⭐ Se gostou do projeto, deixe uma estrela!
  
  🚀 Desenvolvido com Next.js 16, TypeScript, Tailwind CSS e Supabase
  
</div>
