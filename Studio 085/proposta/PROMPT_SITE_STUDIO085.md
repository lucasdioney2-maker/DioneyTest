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

- **Andrei Vieira** — Sócio (primo do Lucas)
- **Lucas Dioney** — Sócio

Fontes reais de conteúdo (não inventar dados):
- Instagram: `@studio085pt` (ver nota sobre conexão Windsor no fim do documento)
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
7. **CTA final** — pedido de orçamento (ver §6)

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
