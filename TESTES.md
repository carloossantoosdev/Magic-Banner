# 🧪 Guia de Testes - Local e Produção

## 🎯 Detecção Automática de Ambiente

O script `magic-banner.js` agora **detecta automaticamente** se está rodando em:
- 🏠 **Local:** `localhost` ou `127.0.0.1` → usa `http://localhost:3000`
- 🌍 **Produção:** Qualquer outro domínio → usa a URL da própria aplicação

### 💡 Como Funciona

```javascript
const API_BASE_URL = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'  // ← DESENVOLVIMENTO
    : window.location.origin;  // ← PRODUÇÃO
```

---

## 🏠 Testes em Ambiente Local

### Cenário 1: Testar na Própria Aplicação

**Passo a passo:**

1. **Inicie o servidor local:**
```bash
yarn dev
```

2. **Acesse o admin:**
```
http://localhost:3000/admin
```

3. **Crie um banner:**
   - **URL:** `http://localhost:3000/test`
   - **Imagem:** Upload ou URL
   - **Horário:** (opcional)

4. **Acesse a URL do banner:**
```
http://localhost:3000/test
```

5. ✅ **Banner deve aparecer no topo!**

---

### Cenário 2: Testar em Arquivo HTML Externo

**Situação:** Simular um site de terceiro que está carregando o script.

#### Opção A: Live Server (VS Code)

1. **Instale a extensão Live Server** (se não tiver)
   - Extensão: `ritwickdey.liveserver`

2. **Crie um arquivo HTML de teste:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste Local - Magic Banner</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    .info {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>🧪 Teste do Magic Banner - Ambiente Local</h1>
  
  <div class="info">
    <h2>Informações:</h2>
    <p><strong>URL atual:</strong> <span id="current-url"></span></p>
    <p><strong>Hostname:</strong> <span id="hostname"></span></p>
    <p><strong>API usada:</strong> <span id="api-url"></span></p>
  </div>
  
  <div class="info">
    <h2>Instruções:</h2>
    <ol>
      <li>Certifique-se que o servidor Next.js está rodando em <code>localhost:3000</code></li>
      <li>Copie a URL atual desta página</li>
      <li>No painel admin, crie um banner com essa URL</li>
      <li>Recarregue esta página</li>
      <li>O banner deve aparecer no topo!</li>
    </ol>
  </div>
  
  <script>
    // Exibir informações da página
    document.getElementById('current-url').textContent = window.location.href;
    document.getElementById('hostname').textContent = window.location.hostname;
    
    // Simular a lógica do magic-banner.js
    const apiUrl = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : window.location.origin;
    
    document.getElementById('api-url').textContent = apiUrl;
  </script>
  
  <!-- Magic Banner Script -->
  <script src="http://localhost:3000/magic-banner.js"></script>
</body>
</html>
```

3. **Salve como:** `teste-local.html`

4. **Abra com Live Server:**
   - Clique com botão direito no arquivo
   - Selecione **"Open with Live Server"**
   - Abrirá em: `http://127.0.0.1:5500/teste-local.html`

5. **No painel admin (localhost:3000/admin), crie banner:**
   - **URL:** `http://127.0.0.1:5500/teste-local.html`
   - **Imagem:** Upload ou URL
   - Clique em "Criar Banner"

6. **Recarregue a página do teste**

7. ✅ **Banner deve aparecer!**

8. **Verifique o Console (F12):**
   - Deve mostrar: `[Magic Banner] Fazendo requisição para: http://localhost:3000/api/banners?url=...`
   - Deve mostrar: `[Magic Banner] Banner encontrado`
   - Deve mostrar: `[Magic Banner] Banner exibido com sucesso`

#### Opção B: Abrir HTML Direto (file://)

**⚠️ Limitação:** Não funciona com `file://` devido a restrições de CORS.

**Solução:** Use sempre um servidor local (Live Server, http-server, etc.)

---

### Cenário 3: Testar com http-server (Node.js)

1. **Instale globalmente (se não tiver):**
```bash
npm install -g http-server
```

2. **Crie uma pasta de testes:**
```bash
mkdir testes-magic-banner
cd testes-magic-banner
```

3. **Crie um arquivo `index.html`:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Teste HTTP Server</title>
</head>
<body>
  <h1>Teste com http-server</h1>
  <p>Rodando em: <span id="url"></span></p>
  <script>
    document.getElementById('url').textContent = window.location.href;
  </script>
  <script src="http://localhost:3000/magic-banner.js"></script>
</body>
</html>
```

4. **Inicie o servidor:**
```bash
http-server -p 8080
```

5. **Abra no navegador:**
```
http://localhost:8080
```

6. **Crie banner no admin para:**
```
http://localhost:8080
```

7. ✅ **Recarregue e veja o banner!**

---

## 🌍 Testes em Produção (Vercel)

### Cenário 1: Testar na Própria Aplicação Vercel

1. **Após deploy, acesse:**
```
https://seu-projeto.vercel.app/admin
```

2. **Faça login**

3. **Crie um banner:**
   - **URL:** `https://seu-projeto.vercel.app/test`
   - **Imagem:** Upload ou URL
   - Clique em "Criar Banner"

4. **Acesse:**
```
https://seu-projeto.vercel.app/test
```

5. ✅ **Banner aparece no topo!**

---

### Cenário 2: Testar em Site Externo (CodePen)

**Situação:** Simular integração em um site real.

1. **Vá em:** https://codepen.io/pen/

2. **Cole o HTML:**

```html
<h1>Teste Magic Banner - Produção</h1>
<p>URL atual: <span id="url"></span></p>
<p>Este é um teste em site externo (CodePen)</p>

<script>
  document.getElementById('url').textContent = window.location.href;
</script>

<!-- Substitua pela sua URL da Vercel -->
<script src="https://seu-projeto.vercel.app/magic-banner.js"></script>
```

3. **Salve o CodePen** (vai gerar uma URL única)

4. **Copie a URL do CodePen** (ex: `https://codepen.io/pen/abcXYZ`)

5. **No admin da Vercel, crie banner:**
   - **URL:** Cole a URL completa do CodePen
   - **Imagem:** Upload ou URL

6. **Recarregue o CodePen**

7. ✅ **Banner deve aparecer!**

---

### Cenário 3: Testar em Seu Próprio Site

**Se você já tem um site em produção:**

1. **Adicione o script no `<body>`:**

```html
<script src="https://seu-projeto.vercel.app/magic-banner.js"></script>
```

2. **No admin, crie banner para a URL exata da página:**
   - Exemplo: `https://seu-site.com/produtos/cadeira-gamer`

3. **Acesse essa página**

4. ✅ **Banner aparece automaticamente!**

---

## 🔍 Como Verificar Qual Ambiente Está Usando

### No Console do Navegador (F12):

O script `magic-banner.js` imprime logs que mostram a API usada:

**Em Local:**
```
[Magic Banner] Fazendo requisição para: http://localhost:3000/api/banners?url=...
```

**Em Produção:**
```
[Magic Banner] Fazendo requisição para: https://seu-projeto.vercel.app/api/banners?url=...
```

---

## 📋 Checklist de Testes

### ✅ Testes Locais (localhost:3000)

- [ ] Banner aparece na própria aplicação (`localhost:3000/test`)
- [ ] Banner aparece em HTML com Live Server (`127.0.0.1:5500`)
- [ ] Banner aparece em HTML com http-server (`localhost:8080`)
- [ ] Console mostra `http://localhost:3000` como API
- [ ] Upload de imagem funciona
- [ ] Switch ativo/inativo funciona
- [ ] Validação de horário funciona

### ✅ Testes em Produção (Vercel)

- [ ] Banner aparece na própria aplicação (`seu-projeto.vercel.app/test`)
- [ ] Banner aparece em CodePen
- [ ] Banner aparece em site externo
- [ ] Console mostra URL da Vercel como API
- [ ] Login funciona
- [ ] Upload funciona
- [ ] API retorna JSON (`/api/banners/all`)

---

## 🐛 Troubleshooting

### Problema 1: "Banner não aparece em localhost"

**Verificar:**
1. ✅ Servidor Next.js está rodando? (`yarn dev`)
2. ✅ URL do banner corresponde EXATAMENTE à URL da página?
3. ✅ Banner está ativo no admin?
4. ✅ Console (F12) mostra algum erro?

**Console deve mostrar:**
```
[Magic Banner] Fazendo requisição para: http://localhost:3000/api/banners?url=...
[Magic Banner] Banner encontrado: { ... }
[Magic Banner] Banner exibido com sucesso
```

---

### Problema 2: "CORS error em produção"

**Causa:** API não está aceitando requisições de outros domínios.

**Solução:** Headers CORS já estão configurados em todas as rotas da API. Se o erro persistir:

1. Verifique se fez deploy corretamente
2. Limpe cache do navegador
3. Teste em aba anônima

---

### Problema 3: "Banner aparece em local mas não em produção"

**Verificar:**
1. ✅ Deploy foi concluído com sucesso?
2. ✅ Variáveis de ambiente estão configuradas na Vercel?
3. ✅ Supabase Site URL está atualizado?
4. ✅ URL do banner usa HTTPS (não HTTP)?

---

### Problema 4: "Script carrega mas não faz nada"

**Abra o Console (F12) e procure por:**

**Sem erro:**
- ✅ `[Magic Banner] Fazendo requisição para: ...`
- ✅ `[Magic Banner] Nenhum banner encontrado para esta URL`

**Com erro:**
- ❌ `Uncaught ReferenceError: ...`
- ❌ `Failed to fetch`
- ❌ `CORS policy ...`

---

## 💡 Dicas Pro

### Dica 1: URLs devem ser EXATAS

❌ **Não funciona:**
- Banner URL: `https://loja.com/produto`
- Página atual: `https://loja.com/produto/123`

✅ **Funciona:**
- Banner URL: `https://loja.com/produto/123`
- Página atual: `https://loja.com/produto/123`

### Dica 2: Query strings importam

❌ **Não funciona:**
- Banner URL: `https://loja.com/produto`
- Página atual: `https://loja.com/produto?ref=email`

Se quiser que funcione com query strings, a URL do banner deve incluí-las.

### Dica 3: Use o Console

Sempre mantenha o Console (F12) aberto durante os testes para ver:
- Requisições sendo feitas
- Erros de CORS
- Banner encontrado ou não
- Validações de horário

### Dica 4: Teste em Múltiplos Navegadores

- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (se tiver macOS)

---

## 📊 Fluxo de Teste Completo

```
┌─────────────────────────────────────────────┐
│  1. Iniciar servidor local (yarn dev)      │
│     → http://localhost:3000                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. Acessar admin (localhost:3000/admin)    │
│     → Fazer login                           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. Criar banner para URL de teste          │
│     → URL: http://127.0.0.1:5500/test.html  │
│     → Imagem: Upload ou URL                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. Abrir HTML de teste com Live Server     │
│     → http://127.0.0.1:5500/test.html       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  5. Script detecta: hostname = 127.0.0.1    │
│     → Usa API: http://localhost:3000        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  6. Requisição: GET /api/banners?url=...    │
│     → Retorna banner correspondente         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  7. Banner é inserido no topo da página     │
│     → Animação de entrada                   │
│     ✅ SUCESSO!                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Resumo

| Ambiente | Hostname | API Usada | Como Testar |
|----------|----------|-----------|-------------|
| **Local (Next.js)** | `localhost` | `http://localhost:3000` | Acessar `localhost:3000/test` |
| **Local (Live Server)** | `127.0.0.1` | `http://localhost:3000` | Abrir HTML com Live Server |
| **Local (http-server)** | `localhost` | `http://localhost:3000` | `http-server -p 8080` |
| **Produção (Vercel)** | `seu-projeto.vercel.app` | `https://seu-projeto.vercel.app` | Acessar URL da Vercel |
| **Produção (CodePen)** | `codepen.io` | `https://seu-projeto.vercel.app` | Criar pen com script |
| **Produção (Seu site)** | `seu-dominio.com` | `https://seu-projeto.vercel.app` | Adicionar script |

---

**✅ Agora você pode testar em qualquer ambiente sem precisar alterar o código!**

🚀 **O script detecta automaticamente onde está rodando e usa a API correta!**

