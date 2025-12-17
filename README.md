# 🚀 Magic Banner Plugin

<div align="center">
  
  ![Magic Banner](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase&logoColor=white)
  
  **Exiba banners personalizados em qualquer e-commerce**
  
  Plugin de banners dinâmicos que aparecem automaticamente com base na URL e horário de exibição.

</div>

---

## 📋 Sobre o Projeto

O **Magic Banner Plugin** é uma aplicação Next.js full stack desenvolvida como parte do desafio técnico da **Futuriza**. Permite criar e exibir banners personalizados em páginas de e-commerce, com base na URL atual do site e, opcionalmente, no horário de exibição.

### ✨ Funcionalidades

- 🎨 **Painel Administrativo** - Interface intuitiva para gerenciar banners
- 🔗 **Banners por URL** - Cada banner é exibido em uma URL específica
- 🖼️ **Upload ou URL** - Faça upload de imagens ou use URLs externas
- ⏰ **Agendamento** - Configure horários específicos de exibição
- 🌍 **Timezone Local** - Validação de horário no navegador do usuário
- 📦 **Script Embutível** - Uma linha de código para integrar em qualquer site
- 🎯 **CORS Habilitado** - API acessível de qualquer origem

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Banco de Dados:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Deploy:** Vercel
- **Ícones:** Lucide React

---

## 🚀 Como Usar

### Instalação Local

1. **Clone o repositório:**

```bash
git clone https://github.com/carloossantoosdev/Magic-Banner.git
cd Magic-Banner
```

2. **Instale as dependências:**

```bash
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. **Configure o Supabase:**

- Crie um projeto no [Supabase](https://supabase.com)
- Execute o script SQL em `supabase/schema.sql` no SQL Editor
- Crie um bucket de storage público chamado `banner-images`

5. **Execute o projeto:**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 📖 Configuração do Supabase

### 1. Criando a Tabela

Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criação da tabela banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('upload', 'url')),
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por URL
CREATE INDEX IF NOT EXISTS idx_banners_url ON banners(url);
```

### 2. Criando o Storage Bucket

1. Vá em **Storage** no painel do Supabase
2. Clique em **New bucket**
3. Nome: `banner-images`
4. Marque como **Public**
5. Clique em **Create bucket**

---

## 🎯 Como Usar o Script Embutível

### 1. Crie um Banner

1. Acesse o painel administrativo: `https://seu-dominio.vercel.app/admin`
2. Preencha o formulário:
   - **URL de Destino:** URL completa da página (ex: `https://loja.com/produto/123`)
   - **Imagem:** Faça upload ou cole a URL de uma imagem
   - **Horário (opcional):** Configure horário de início e fim

### 2. Adicione o Script

Copie o script gerado no painel admin e adicione no HTML da sua página:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Minha Loja</title>
  </head>
  <body>
    <!-- O banner será inserido aqui automaticamente -->
    
    <h1>Bem-vindo à minha loja!</h1>
    
    <!-- Cole o script antes do </body> -->
    <script src="https://seu-dominio.vercel.app/magic-banner.js"></script>
  </body>
</html>
```

### 3. Como Funciona

1. O script captura a URL atual da página
2. Faz uma requisição para `/api/banners?url=<URL_ATUAL>`
3. Se houver um banner cadastrado:
   - Valida o horário de exibição (timezone local)
   - Insere o banner no topo da página automaticamente

### 4. 🔄 Detecção Automática de Ambiente

O script `magic-banner.js` **detecta automaticamente** se está rodando em **desenvolvimento** ou **produção**:

```javascript
// Detecção automática do ambiente
const API_BASE_URL = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'  // ← DESENVOLVIMENTO
    : window.location.origin;  // ← PRODUÇÃO
```

**Isso significa que:**
- ✅ **Em localhost:** O script usa `http://localhost:3000` para buscar a API
- ✅ **Em produção:** O script usa automaticamente a URL da Vercel
- ✅ **Mesmo código funciona em qualquer ambiente** - não precisa alterar nada!

**Testando localmente:**
```html
<!-- Funciona em localhost -->
<script src="http://localhost:3000/magic-banner.js"></script>
```

**Em produção:**
```html
<!-- Funciona na Vercel -->
<script src="https://seu-projeto.vercel.app/magic-banner.js"></script>
```

---

## 🏗️ Estrutura do Projeto

```
MagicBanner/
├── app/
│   ├── admin/              # Painel administrativo
│   │   └── page.tsx
│   ├── api/
│   │   └── banners/        # API Routes
│   │       ├── route.ts    # GET, POST, DELETE
│   │       └── all/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Header.tsx
│   ├── BannerForm.tsx      # Formulário de criação
│   ├── BannerList.tsx      # Lista de banners
│   └── BannerCard.tsx      # Card individual
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   ├── types.ts            # Tipos TypeScript
│   └── utils.ts
├── public/
│   └── magic-banner.js     # Script embutível
└── supabase/
    └── schema.sql          # Schema do banco
```

---

## 🔌 API Endpoints

### GET `/api/banners?url=<URL_ENCODED>`
Busca banner por URL exata.

**Resposta:**
```json
{
  "id": "uuid",
  "url": "https://loja.com/produto/123",
  "image_url": "https://...",
  "start_time": "08:00",
  "end_time": "18:00",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### GET `/api/banners/all`
Lista todos os banners.

### POST `/api/banners`
Cria novo banner.

**Body (FormData):**
- `url`: URL de destino
- `image_type`: 'upload' ou 'url'
- `image`: File ou string (URL)
- `start_time`: HH:MM (opcional)
- `end_time`: HH:MM (opcional)

### DELETE `/api/banners?id=<UUID>`
Deleta banner por ID.

---

## 🎨 Design System

### Cores

- **Background Principal:** `#0a0a0a`
- **Background Secundário:** `#1a1a1a`
- **Cor de Destaque (Cyan):** `#06b6d4` / `#14b8a6`
- **Texto Primário:** `#ffffff`
- **Texto Secundário:** `#9ca3af`

### Componentes

- Dark theme moderno
- Botões com hover em cyan
- Cards com bordas sutis
- Inputs com foco em cyan
- Badges com ícones

---

## 📝 Decisões Técnicas

### Frameworks e Bibliotecas
- **Next.js 14 (App Router)** - SSR, API Routes e performance
- **Tailwind CSS** - Estilização rápida com tema dark customizado
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Supabase** - PostgreSQL e Storage integrados
- **Lucide React** - Ícones consistentes e leves

### Persistência
- **Supabase PostgreSQL** - Metadados dos banners
- **Supabase Storage** - Imagens uploadadas
- **URLs externas** - Armazenadas como string

### Lógica de Exibição
- Validação de horário no **browser** (timezone local do usuário)
- Busca exata por URL (sem pattern matching)
- Script **vanilla JS** para compatibilidade universal

### Desafios Resolvidos
- **CORS** - Headers configurados para aceitar requisições de qualquer origem
- **Upload de imagens** - Integração com Supabase Storage
- **Validação de timezone** - Horário validado no cliente
- **Type safety** - TypeScript em todo o projeto

---

## 📦 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy! 🚀

### URLs Importantes

- **Painel Admin:** `https://seu-dominio.vercel.app/admin`
- **API:** `https://seu-dominio.vercel.app/api/banners`
- **Script:** `https://seu-dominio.vercel.app/magic-banner.js`

---

## ✅ Checklist de Funcionalidades

- [x] Criar banner pelo painel admin
- [x] Listar banners criados
- [x] Excluir banner
- [x] Upload de imagem funciona
- [x] URL de imagem funciona
- [x] Copy-to-clipboard do script
- [x] Script embutível funcional
- [x] Validação de horário por timezone
- [x] Design dark theme com cyan
- [x] Responsivo mobile-first
- [x] Commits seguindo Conventional Commits

---

## 🧪 Testando Localmente

### Teste o Script

1. Crie um arquivo `teste.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste Magic Banner</title>
</head>
<body>
    <h1>Teste do Banner</h1>
    <script src="http://localhost:3000/magic-banner.js"></script>
</body>
</html>
```

2. Crie um banner no painel para a URL `file:///caminho/para/teste.html`
3. Abra o arquivo no navegador
4. O banner deve aparecer no topo!

---

## 🔬 Testando em Qualquer Site (Via Console)

Você pode testar o Magic Banner em **qualquer site** usando o Console do navegador, **sem precisar editar o código HTML**. Perfeito para demonstrações!

### Passo a Passo:

#### 1. **Abra qualquer site**
```
Exemplo: https://www.google.com, https://www.github.com, etc.
```

#### 2. **Abra o Console do navegador**
- **Windows/Linux:** Pressione `F12` ou `Ctrl + Shift + J`
- **Mac:** Pressione `Cmd + Option + J`
- Ou clique com botão direito → "Inspecionar" → Aba "Console"

#### 3. **Permitir colar código (apenas primeira vez)**

O navegador pode mostrar um aviso de segurança. Digite exatamente:
```
allow pasting
```
Pressione `Enter`. Isso é necessário apenas uma vez por sessão.

#### 4. **Cole o código de teste**

Copie e cole este código no Console:

```javascript
const script = document.createElement('script');
script.src = 'https://magic-banner-pi.vercel.app/magic-banner.js';
document.body.appendChild(script);
console.log('✅ Script injetado!');
```

**⚠️ Importante:** Substitua `magic-banner-pi.vercel.app` pela **sua URL** da Vercel!

#### 5. **Pressione Enter**

Você verá no Console:
```
✅ Script injetado!
[Magic Banner] Fazendo requisição para: https://magic-banner-pi.vercel.app/api/banners?url=...
```

#### 6. **Criar banner para o site de teste**

1. Copie a **URL completa** do site que você abriu
2. Vá no **painel admin** (`https://seu-projeto.vercel.app/admin`)
3. Crie um banner com essa URL exata
4. **Recarregue** a página de teste

✅ **O banner deve aparecer no topo do site!**

### 🎯 Resultado Esperado:

**Console mostrará:**
```
✅ Script injetado!
[Magic Banner] Fazendo requisição para: https://magic-banner-pi.vercel.app/api/banners?url=https://exemplo.com/
[Magic Banner] Banner encontrado: {...}
[Magic Banner] Banner exibido com sucesso
```

**Visualmente:**
- Banner aparece no topo da página com animação suave
- Botão "X" no canto superior direito para fechar
- Banner cobre a largura total da tela

### ⚠️ Observações:

- **Temporário:** O banner desaparece ao recarregar a página (é apenas para teste)
- **URL exata:** A URL do banner deve ser **exatamente** igual à URL da página
- **CORS:** O script funciona em qualquer site por causa dos headers CORS habilitados

### 💡 Alternativa: Bookmarklet

Para testar de forma mais rápida, crie um **favorito/bookmark** com este código na URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://magic-banner-pi.vercel.app/magic-banner.js';document.body.appendChild(s);})();
```

Depois é só **clicar no favorito** em qualquer site para carregar o script instantaneamente!

---

## 🎯 Sobre o Desafio

Este projeto foi desenvolvido como parte do **Desafio Técnico da Futuriza**, uma empresa de tecnologia focada em acelerar o futuro do varejo com IA, automação e soluções inteligentes.

### Critérios Avaliados

- ✅ **Organização de código** - Estrutura clara e componentes bem definidos
- ✅ **Integração full stack** - Comunicação fluida entre painel, API e script
- ✅ **Domínio de Next.js** - Uso correto de rotas, APIs e SSR
- ✅ **Funcionalidade real** - Banner aparecendo dinamicamente
- ✅ **UX/UI** - Painel funcional e design moderno
- ✅ **Documentação** - README completo e código comentado

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Carlos Santos** como parte do desafio técnico da Futuriza.

- GitHub: [@carloossantoosdev](https://github.com/carloossantoosdev)
- LinkedIn: [Carlos Santos](https://www.linkedin.com/in/carloossantoosdev/)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.

---

<div align="center">
  
  **Magic Banner Plugin** - Desafio Técnico Futuriza 2025
  
  ⭐ Se gostou do projeto, deixe uma estrela!
  
</div>
