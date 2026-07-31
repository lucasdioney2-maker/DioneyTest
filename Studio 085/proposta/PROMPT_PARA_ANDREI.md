# Prompt para o Andrei colar na sessão dele

> Cole este texto inteiro na primeira mensagem da sessão dele (no mesmo
> repositório, branch `claude/cinematographic-photography-site-repqhp`), logo
> depois de ele ter posto as fotos nas pastas indicadas.

---

VÍDEO/AUDIOVISUAL — STUDIO 085

Crie para mim o site institucional cinematográfico do Studio 085, estúdio de vídeo criativo para empresas, sediado no Porto, Portugal.

QUEM SOMOS (não inventar nada além disto — usar só o que está confirmado):
- Andrei Vieira — sócio
- Lucas Dioney — sócio
- Serviços reais: Captação, Edição e Planeamento
- Contacto real: @studio085pt · @dioneyfilmes · studio085pt@gmail.com · +351 913 137 568
- Existe um briefing mais detalhado já no repositório em `Studio 085/proposta/PROMPT_SITE_STUDIO085.md` — leia esse ficheiro primeiro e use-o como fonte de verdade para tudo o que não estiver repetido aqui.

ASSETS: as fotos e vídeos reais já estão (ou vão estar) em:
- `Studio 085/assets/pessoas/` — fotos do Andrei e do Lucas, incluindo `andrei-cracha.jpg` e `lucas-cracha.jpg` na MESMA pose
- `Studio 085/assets/equipamentos/` — fotos reais do equipamento
- `Studio 085/assets/portfolio-real/` — vídeos/fotos reais já organizados por tipo de produto
Analise essas imagens antes de gerar qualquer conteúdo. Preserve fielmente o rosto, corpo e aparência real de cada um. Não recrie pessoas nem equipamento por IA se já existir a foto/vídeo real — use o material real diretamente no site. IA só entra para a peça descrita abaixo (câmera + transição de crachá).

HERO — duas sequências controladas por scroll, uma só depois da outra:

1. Transição "dois sócios, um olhar": a partir da foto real do Andrei com o crachá (`andrei-cracha.jpg`), conforme o visitante rola, ele transforma suavemente (morph/crossfade por frames, nunca gerar uma cara nova) até revelar o Lucas com o crachá (`lucas-cracha.jpg`), na mesma pose. Identidade dos dois 100% preservada.

2. Câmera cinematográfica: gere primeiro UMA imagem hero de uma câmera profissional premium e original, sem marca, logótipo ou texto, flutuando num estúdio escuro sofisticado — corpo grafite, detalhes metálicos, lente grande com reflexos âmbar, iluminação de contorno dramática, partículas subtis, fundo preto profundo. Depois anime essa mesma imagem num ÚNICO vídeo: rotação lenta e perfeitamente suave → vista explodida completa, técnica e elegante (estilo apresentação de produto Apple) — lente, elementos ópticos, anéis, lâminas do diafragma, sensor, obturador, placas internas, botões separam-se em camadas organizadas e suspensas, sem nada quebrar, ser arremessado ou desaparecer. Depois o diafragma abre-se e a câmera virtual atravessa o interior da lente, terminando num quadro escuro pronto para revelar o portefólio. Preserve exatamente o mesmo design da câmera durante toda a animação.

Modelo de vídeo: o mais cinematográfico disponível, preferência Cinema Studio 3.0 em 4K. Proporção 16:9, duração entre 5 e 10 segundos, sem áudio. Gere APENAS este único vídeo — nenhum outro vídeo sintético para secções, categorias do portefólio ou outros elementos. Todo o resto do site é imagem estática real + HTML + CSS + canvas + GSAP + ScrollTrigger + Lenis + máscaras + parallax + zoom + transições.

A câmera é metáfora do olhar da dupla, não um produto: sem especificações técnicas, preço, botão de compra ou linguagem de e-commerce.

ESTRUTURA DO SITE (percurso de venda, do topo ao fecho):
1. Hero — transição Andrei→Lucas + câmera cinematográfica
2. Portefólio — vídeos/fotos reais de `portfolio-real/`, organizados por tipo de produto, apresentados como mini-casos (não só uma grelha solta): cada peça com uma linha curta de contexto, no estilo "case" que estúdios premiados usam, não uma galeria genérica
3. Serviços — Captação · Edição · Planeamento (como trabalhamos)
4. Sobre — Studio 085, Andrei + Lucas, Porto, forma de trabalhar
5. Experiência de atendimento — como é o processo do primeiro contacto até à entrega
6. Depoimentos/prova social real — só os confirmados, nunca inventados
7. CTA de orçamento — ver abaixo
8. Fecho — CTA final estilo "percurso de venda", ver abaixo

SERVIÇOS vs. PRODUTOS (não misturar os dois):
- Serviços (como trabalhamos): Captação, Edição, Planeamento
- Produtos (o que o cliente pode escolher, sem preços à vista): vídeo short-form (redes sociais, curto), vídeo long-form (redes sociais, longo), vídeo institucional, aftermovie, vídeo para clínicas (dentista/estética), vídeo criativo (mais trabalhado, com IA, SFX, ritmo e planeamento avançado)

CTA DE ORÇAMENTO: botão "Pedir orçamento" visível ao longo do site. Ao clicar, o visitante escolhe (seleção clicável, pode escolher mais de um) o(s) tipo(s) de produto acima, depois preenche nome/empresa/WhatsApp, e o envio abre o WhatsApp já com uma mensagem pré-preenchida com o que foi selecionado. Sem preços, sem checkout — só qualificação do pedido para depois montarmos um orçamento personalizado.

FECHO — CTA final ("vamos fechar?"): depois do CTA de orçamento, uma última secção full-screen, estilo fecho de venda de agência audiovisual: frase curta que recapitula a proposta de valor → (só se existir) 1 prova real (depoimento ou número confirmado) → CTA direto e assertivo tipo "Vamos fechar esse vídeo?" com um único botão óbvio para WhatsApp, já com o resumo da seleção. Nada de segunda opção competindo com o botão, nada de letras miúdas. Entrada em cascata sincronizada com o scroll (mesma linguagem visual do resto do site).

ESTILO E TOM: fundo preto/grafite, branco quente, detalhes âmbar, tipografia editorial, bastante espaço visual. Tom cinematográfico mas claramente B2B — o visitante deve sair a pensar "quero contratar este estúdio para o meu vídeo", nunca "quero comprar uma câmera". Inspire-se na forma como estúdios de vídeo premiados apresentam trabalho como "casos" com contexto curto (não só grelha de vídeos soltos), e como fecham a conversão com um único caminho de ação claro — sem copiar layout de nenhum estúdio específico.

TÉCNICO: vídeo da câmera transformado em sequência de frames em `<canvas>`, GSAP + ScrollTrigger a fixar o canvas e sincronizar frames/textos com o scroll (incluindo a transição Andrei→Lucas), Lenis para smooth scroll, rolagem reversível (voltar desfaz as animações). Todo o texto é HTML real, nunca dentro de imagem/vídeo.

VALIDAÇÃO: rode em localhost e confirme no browser — transição Andrei→Lucas, animação da câmera (rotação → explosão → travessia da lente), canvas + GSAP + ScrollTrigger + Lenis, galerias do portefólio, formulário de orçamento com o link para WhatsApp, fecho de venda final, layout mobile, e que a rolagem reversa desfaz as animações — antes de dizer que está pronto.
