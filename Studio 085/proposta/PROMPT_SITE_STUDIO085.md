# Prompt Mestre — Site Cinematográfico Studio 085

> Adaptado do briefing original de "site de fotografia com rolagem 3D" para o
> site institucional do **Studio 085** (Andrei Vieira + Lucas Dioney),
> estúdio de vídeo criativo para empresas em Portugal.
> Este documento é o briefing a ser executado (Higgsfield MCP + build do site)
> assim que a pasta de assets reais for fornecida.

---

## 1. QUEM SOMOS

**Studio 085** — Porto, Portugal.
Criamos vídeo para empresas: captação, edição e planeamento, do conceito à entrega.

- **Andrei Vieira** — Sócio (primo do Lucas) · Instagram pessoal: `@andreivieirat`
- **Lucas Dioney** — Sócio · Instagram pessoal: `@dioneyfilmes`

Fontes reais de conteúdo (não inventar dados):
- Instagram do estúdio: `@studio085pt` (ver nota sobre conexão Windsor no fim do documento)
- Instagram pessoal de cada sócio: `@andreivieirat` (Andrei) · `@dioneyfilmes` (Lucas)
- Contacto: `@studio085pt` · `@dioneyfilmes` · `studio085pt@gmail.com` · +351 913 137 568
- Base: Porto, Portugal
- Documento interno de posicionamento: `Studio 085/proposta/PROPOSTA_SERVICOS_STUDIO085.md`

Preservar fielmente: nomes reais, papel de cada sócio, contactos, base geográfica,
serviços reais oferecidos. Não inventar prémios, números de clientes ou depoimentos
que não existam — usar apenas o que for confirmado pelo Instagram/Windsor ou
fornecido diretamente por vocês.

---

## 2. ASSETS NECESSÁRIOS (pasta a fornecer)

Estrutura esperada, por exemplo em `Studio 085/assets/`:

```
assets/
  pessoas/
    andrei-cracha.jpg      (Andrei com o crachá, pose de referência)
    andrei-02.jpg ...      (apoio: identidade, poses, rosto)
    lucas-cracha.jpg       (Lucas com o crachá, MESMA pose do Andrei)
    lucas-02.jpg ...       (apoio: identidade, poses, rosto)
  equipamentos/
    camera-01.jpg, gimbal-01.jpg, lente-01.jpg, drone-01.jpg ...
```

Regras:
- Nenhuma imagem/vídeo com pessoas reais (Andrei, Lucas, clientes, equipamento)
  deve ser recriada por IA à toa — usar as fotos reais como referência de
  identidade e, sempre que possível, os assets reais diretamente no site.
- A foto de crachá do Andrei e a do Lucas devem estar na **mesma pose/enquadramento**
  para permitir a transição de rolagem descrita abaixo. Se não existirem ainda
  nessa configuração, sinalizar antes de gerar qualquer conteúdo sintético.
- Vídeos/reels reais do portfólio (short-form, long-form, institucionais,
  aftermovies, clínicas) devem ser usados como estão — nada disso é gerado por IA.

---

## 3. HERO — DUAS SEQUÊNCIAS CONTROLADAS PELA ROLAGEM

### 3.1 Abertura — "Dois sócios, um olhar"
Ponto de partida: foto real do **Andrei** com o crachá do Studio 085, na pose de
referência. Conforme o visitante rola, o Andrei gira/transforma suavemente
(efeito de morph/transição, não geração de rosto novo) até revelar o **Lucas**
com o crachá, na mesma pose exata. Sensação de "a mesma equipa, o mesmo olhar".

- Usar as fotos reais da pasta `pessoas/` como base — identidade 100% preservada,
  sem alterar rosto, corpo ou traços de nenhum dos dois.
- Texto HTML real sobreposto (nunca embutido na imagem): nomes, papel de cada um,
  frase de abertura curta.

### 3.2 Câmera cinematográfica (mantido do prompt original)
Logo a seguir à transição Andrei→Lucas, entra a sequência da câmera:

1. **Imagem hero única**: câmera fotográfica/de vídeo profissional premium,
   original, sem marca/logotipo/texto, corpo grafite, detalhes metálicos, lente
   grande com reflexos âmbar, flutuando em estúdio escuro, iluminação de
   contorno dramática, partículas sutis, fundo preto profundo.
2. **Um único vídeo** animando essa imagem: rotação lenta e perfeitamente suave
   → vista explodida técnica e elegante (estilo apresentação Apple) — lente,
   elementos ópticos, anéis, lâminas do diafragma, sensor, obturador, placas
   internas, botões separam-se em camadas organizadas e suspensas, sem quebrar,
   arremessar ou desaparecer nada. Depois o diafragma abre-se e a "câmera
   virtual" atravessa o interior da lente, terminando num quadro escuro pronto
   para revelar o portefólio.
3. Modelo: o mais cinematográfico disponível, preferência **Cinema Studio 3.0
   em 4K**. Proporção **16:9**, **5–10 segundos**, **sem áudio**.
4. **Gerar apenas este único vídeo.** Nenhum outro vídeo sintético para secções,
   categorias ou elementos do site — o resto do portefólio usa material real.
5. A câmera é metáfora do olhar da dupla, não um produto: sem specs, preço,
   botão de compra ou linguagem de e-commerce.

---

## 4. ESTRUTURA DA LANDING PAGE

1. **Hero** — Andrei→Lucas (crachá) + câmera cinematográfica (rolagem controlada)
2. **Portefólio** — vídeos/imagens reais, organizados por tipo de produto (ver §5)
3. **Serviços** — Captação · Edição · Planeamento
4. **Sobre** — Studio 085, Andrei + Lucas, base no Porto, forma de trabalhar
5. **Experiência de atendimento** — como é o processo do primeiro contacto à entrega
6. **Depoimentos/prova social reais** — apenas os confirmados via Instagram/cliente
7. **CTA de orçamento** — formulário de seleção de produto (ver §6)
8. **Fecho** — CTA final estilo "percurso de venda" (ver §6.1)

Texto sempre em HTML real (nunca dentro de imagem/vídeo). Fundo preto/grafite,
branco quente, detalhes âmbar, tipografia editorial, bastante espaço visual.
Tom: sofisticado, cinematográfico, claramente B2B — "contratar um estúdio de
vídeo", não "comprar câmera".

---

## 5. SERVIÇOS vs. PRODUTOS (não confundir os dois no site)

**Serviços** (como trabalhamos):
- Captação
- Edição
- Planeamento

**Produtos** (o que o cliente pode pedir — sem preços, sem catálogo de e-commerce):
- Vídeo *short-form* (pequenos, redes sociais)
- Vídeo *long-form* (longos, redes sociais)
- Vídeo institucional
- Aftermovie
- Vídeo para clínicas (dentista/estética)
- Vídeo criativo (mais trabalhado, com IA, SFX, ritmo e planeamento avançado)

Nenhum valor é mostrado publicamente. Objetivo do site é qualificar o pedido
para depois montar um orçamento personalizado por empresa/pessoa.

---

## 6. CTA — PEDIDO DE ORÇAMENTO

Fluxo do formulário/CTA final:
1. Botão "Pedir orçamento" visível ao longo do site (não só no fim).
2. Ao clicar, o visitante escolhe (seleção clicável, não texto livre obrigatório):
   - Tipo de produto: short-form / long-form / institucional / aftermovie /
     clínica (dentista/estética) / vídeo criativo (IA + SFX)
   - Pode selecionar mais de um.
3. Após a seleção, dados de contacto simples (nome, empresa, WhatsApp/email).
4. Envio direciona para WhatsApp (mensagem pré-preenchida com as opções
   selecionadas) e/ou formulário que notifica o Studio 085.
5. Sem preços, sem checkout — apenas qualificação do pedido para orçamento
   personalizado manual pela dupla.

---

## 6.1. FECHO — CTA FINAL ("percurso de venda")

Depois do CTA de orçamento (§6), fechar o site com uma secção final única,
no estilo do fecho de venda que agências/estúdios audiovisuais usam: não é
mais um bloco de informação, é o empurrão final para a conversão.

Estrutura da secção (scroll-triggered, full-screen):

1. **Recapitulação emocional curta** — 1 frase que resume a proposta de valor
   (ex.: reforçar "a câmera regista, a dupla constrói a história" adaptado ao
   contexto do estúdio, nunca copiar literalmente a frase do prompt de
   fotografia).
2. **Prova/confiança** — reaproveitar 1 depoimento real ou 1 número real
   (ex.: X vídeos entregues, Y anos no mercado) só se existir dado confirmado;
   caso não haja, omitir em vez de inventar.
3. **CTA direto de fecho** — frase curta e assertiva estilo "Vamos fechar?" /
   "Bora fechar esse vídeo?" (tom informal-confiante, condizente com a marca),
   com botão único e óbvio ligando para WhatsApp já com o resumo do que foi
   selecionado no formulário de orçamento (§6).
4. Sem letras miúdas, sem segunda opção concorrendo com o botão — um único
   caminho de ação nesta secção.

Animação: entrada em cascata (texto → prova → botão), fade/translate suave
sincronizado com o scroll via GSAP/ScrollTrigger (mesma linguagem visual do
resto do site — nada de efeito novo só para esta secção). Deve funcionar como
o último "empurrão" de uma jornada linear: hero (Andrei→Lucas + câmera) →
portefólio → serviços → sobre → atendimento → depoimentos → **fecho**.

---

## 7. STACK TÉCNICA

- Vídeo da câmera transformado em sequência de frames renderizada em `<canvas>`.
- **GSAP + ScrollTrigger**: fixar o canvas, sincronizar frames com a rolagem,
  revelar textos, controlar a transição Andrei→Lucas (morph/crossfade por
  frames, mesma lógica de scroll-scrub).
- **Lenis** para smooth scroll.
- Rolagem reversível: voltar a rolagem deve reverter a animação (câmera e
  transição de crachá).
- Máscaras circulares, parallax, zoom suave e galeria elegante para o
  portefólio real.
- Indicação discreta apenas se e quando houver qualquer imagem auxiliar gerada
  por IA no site (ex.: texturas/elementos abstratos de fundo) — o portefólio em
  si é 100% material real do estúdio.

---

## 8. VALIDAÇÃO ANTES DE "PRONTO"

Rodar em localhost e confirmar no browser: transição Andrei→Lucas controlada
por scroll, animação da câmera (rotação → explosão → travessia da lente),
canvas + GSAP + ScrollTrigger + Lenis, galerias do portefólio, formulário de
orçamento (incluindo o link/mensagem para WhatsApp), layout mobile, e que a
rolagem reversa desfaz as animações corretamente.

---

## 9. NOTA — CONEXÃO INSTAGRAM (Windsor)

A conta atualmente ligada ao Windsor é `dioneyfilmes` (pessoal, bio sem relação
com o estúdio). Para puxar bio/posts/reels reais de `@studio085pt` e usá-los como
fonte de conteúdo do site, é preciso autorizar essa conta especificamente
(fluxo OAuth via Meta/Instagram Business). Link de autorização gerado nesta
sessão:

```
https://onboard.windsor.ai/token_login?access_token=eveGyCjP7rYuxYWPzba3WZUh3yC2rVCOfL77gAADLk&next=/instagram/authorize&origin=mcp&connector=instagram
```

Requisito do lado do Instagram: `@studio085pt` precisa de ser conta
Business/Creator ligada a uma Página do Facebook para a API de Insights
funcionar.

---

## 10. HANDOFF — PRÓXIMA SESSÃO (quando o Andrei entrar com as fotos)

### Já está pronto
- Este briefing (`PROMPT_SITE_STUDIO085.md`), com hero (Andrei→Lucas + câmera),
  estrutura da landing page, serviços vs. produtos, CTA de orçamento e fecho
  ("percurso de venda").
- Pastas de assets criadas e vazias, à espera dos ficheiros:
  - `Studio 085/assets/pessoas/` (ver README dentro — precisa de
    `andrei-cracha.jpg` e `lucas-cracha.jpg` **na mesma pose**, + fotos de
    apoio de cada um)
  - `Studio 085/assets/equipamentos/` (fotos reais do equipamento)
  - `Studio 085/assets/portfolio-real/` (vídeos/fotos reais já organizados por
    tipo de produto: short-form, long-form, institucional, aftermovie,
    clínicas, criativo-ia)

### O que falta para a próxima sessão executar
1. Confirmar que `andrei-cracha.jpg` / `lucas-cracha.jpg` estão na mesma pose
   (bloqueador da transição do hero — perguntar se não estiver claro).
2. Gerar via Higgsfield MCP: a imagem hero da câmera (§3.2) e o único vídeo da
   câmera (rotação → explosão → travessia da lente), usando o melhor modelo
   fotorrealista para a imagem e o modelo mais cinematográfico disponível
   (preferência Cinema Studio 3.0, 4K) para o vídeo — 16:9, 5–10s, sem áudio.
3. Gerar/animar a transição Andrei→Lucas a partir das fotos reais de crachá
   (morph/crossfade por frames, mesma lógica de scroll-scrub do §7).
4. Montar o projeto do site (Vite/React ou HTML+GSAP simples — decidir stack
   na hora considerando o que já existe em `Studio 085/demo-site` como
   referência de setup, mas este site é institucional do próprio Studio 085,
   não uma demo para cliente).
5. Integrar o portefólio real (`portfolio-real/`) nas galerias com máscaras
   circulares, parallax e zoom suave.
6. Implementar o CTA de orçamento (§6) e o fecho de venda (§6.1), incluindo o
   link/mensagem para WhatsApp.
7. Rodar em localhost e validar tudo conforme o checklist do §8 antes de dizer
   que está pronto.

### Se quiser, também
- Autorizar `@studio085pt` no Windsor (link no §9) para puxar bio/posts reais
  em vez de depender só do que for descrito manualmente.
