# Demo Site — Studio 085
## Stack: React + Framer Motion + Vite + Tailwind

---

## PARA CRIAR A DEMO DE UMA EMPRESA (10 minutos)

### 1. Abrir o ficheiro de configuração
```
demo-site/src/config.js
```

Alterar apenas estes campos:
- `nome` — nome da empresa
- `tagline` — frase curta e apelativa
- `descricao` — 2 linhas sobre o negócio
- `morada`, `telefone`, `horario`
- `avaliacoes`, `estrelas` — copiar do Google Maps
- `categoria` — ex: "Restaurante · Porto"
- `accentColor` — cor principal (adaptar à identidade visual)
- `servicos` — 3 a 4 serviços/produtos com ícone emoji
- `depoimentos` — copiar 3 avaliações reais do Google Maps
- `gmaps` — link do Maps da empresa

### 2. Arrancar o servidor local
```bash
cd "Studio 085/demo-site"
npm run dev
```
Abre automaticamente em http://localhost:5173

### 3. Mostrar ao cliente
- Abre o browser, vai a localhost:5173
- Mostra desktop + mobile (F12 → toggle device)
- O cliente vê o site COM O NOME E DADOS DELES

---

## O QUE ESTÁ ANIMADO (Framer Motion)

| Elemento | Animação |
|---------|---------|
| Navbar | Slide down ao carregar + blur ao scroll |
| Hero título | Fade up em cascata (3 elementos) |
| Hero fundo | Parallax ao scroll |
| Botões | Scale hover + tap |
| Cards serviços | Fade up em stagger + hover lift |
| Cards depoimentos | Fade up em stagger |
| Todas as secções | Fade up quando entram no viewport |
| Badge avaliações | Fade in com delay |

---

## PARA CADA NOVO CLIENTE — CHECKLIST

- [ ] Preencher config.js com dados reais
- [ ] Escolher `accentColor` que combine com a identidade
- [ ] Copiar 3 avaliações reais do Google Maps (depoimentos)
- [ ] Confirmar telefone e horário
- [ ] `npm run dev` e testar mobile
- [ ] Fazer screenshot para enviar por email/WhatsApp
- [ ] Se aprovado → `npm run build` → fazer deploy (Netlify/Vercel grátis)

---

## STACK COMPLETA (do PDF)

| Ferramenta | Instalado | Para quê |
|-----------|-----------|---------|
| Claude Code | ✅ | Criar e editar o site com prompts |
| Framer Motion | ✅ | Todas as animações |
| Vite + React | ✅ | Base do projecto |
| 21st.dev | 🔜 | Biblioteca de componentes prontos |
| UI UX Pro Max skill | 🔜 | Elevar o design system |

### Instalar UI UX Pro Max skill:
No Claude Code, escreve:
```
/install-skill ui-ux-pro-max
```

### Conectar 21st.dev:
1. Vai a https://21st.dev
2. Copia o comando de integração
3. Cola no terminal dentro do Claude Code

---

## PERSONALIZAR COM PROMPT (dica do PDF)

Em vez de criar do zero, abre um componente do 21st.dev
e diz ao Claude Code:

> "Adapta este componente para uma confeitaria chamada
>  Oporto Confeitaria, com 2295 avaliações, cor dourada,
>  tom elegante e acolhedor"

O resultado fica 10x melhor que partir do zero.
