// Todas as strings visíveis ao jogador — PT-BR
export const STR = {
  title: "DIONEYMAKER",
  subtitle: "Do Sertão para o Mundo",
  tapToStart: "Toque ou pressione ESPAÇO para começar",
  money: "R$",
  euro: "€",
  rep: "REP",
  skill: "TÉCNICA",
  day: "Dia",
  chapter: "Capítulo",
  friendship: "Amizade",

  // Ações
  actRecord:   "🎥 Gravar",
  actEdit:     "✂️ Editar",
  actPublish:  "📤 Publicar",
  actWork:     "💪 Biscate",
  actTalk:     "💬 Conversar",
  actShop:     "🛒 Loja",
  actDance:    "🕺 Dançar",
  actNext:     "Continuar ▶",
  actCoverage: "📹 Cobrir",
  actStabilize:"🎯 Estabilizar",
  actTimeline: "🎬 Montar",

  // Guitar-hero de câmera
  recordHint:    "Acerta as técnicas no ritmo! A S D F ou toca nas zonas",
  recordPerfect: "TOMADA PERFEITA!",
  recordGood:    "Boa tomada!",
  recordBad:     "Tremido... precisa de estabilizador",
  lanes:  ["PLANO", "FOCO", "ZOOM", "ESTÁVEL"],
  combo:  "COMBO",
  tips: [
    "Regra dos terços: olhos no terço superior!",
    "Plano aberto situa, close emociona.",
    "Foco no olhar — sempre.",
    "Zoom com intenção, nunca por acaso.",
    "Estabiliza o corpo: cotovelos colados.",
    "4K 120fps = slow motion cristalino.",
    "Luz dourada: grava no fim da tarde.",
    "Corta no movimento, o corte some.",
    "Áudio ruim mata vídeo bom.",
    "Conta uma história, não junta clipes.",
    "B-roll: 3× mais do que tu pensas que precisas.",
    "Regra 180°: não cruzes o eixo de ação.",
    "Steadicam walk-in = entrada com drama.",
    "Drone alto → low angle → volta ao drone: cobertura completa.",
  ],

  // Dança
  danceHint:      "Repete a sequência! Usa as setas ou toca nos botões.",
  danceSwipeHint: "Arrasta o mouse/dedo na direção da seta no ritmo!",
  danceWin:       "A plateia foi ao delírio! +REP",
  danceFail:      "Errou o passo... tenta de novo!",

  // Cobrir Evento (coverage)
  coverageHint: "Captura os shots! Toca/clica nos ícones a tempo",
  coverageWin:  "Cobertura incrível! Footage de qualidade",
  coverageFail: "Perdeste alguns ângulos importantes...",

  // Estabilizar (stabilize)
  stabilizeHint: "Mantém a mira no alvo! Toca para recentrar",
  stabilizeWin:  "Câmera estável! Take profissional",
  stabilizeFail: "Tremido demais... treina mais",

  // Montar Timeline (timeline)
  timelineHint:  "Ordena os clips: clica um clip e depois um slot",
  timelineWin:   "Montagem perfeita! O corte é a magia.",
  timelineFail:  "Ordem errada... a narrativa precisa de ritmo.",
  clipLabels:    ["ABERTURA", "APRESENTAÇÃO", "DESENVOLVIMENTO", "CLÍMAX", "ENCERRAMENTO"],

  walkHint:       "WASD/setas para andar · ESPAÇO para interagir",
  walkHintTouch:  "Toca no chão para andar · toca no ícone para interagir",
  interactPrompt: "ESPAÇO",

  noFootage:   "Sem footage! Grava primeiro.",
  noEdited:    "Nada editado! Edita primeiro.",
  edited:      "Vídeo editado!",
  published:   "Publicado! +REP +",
  workDone:    "Dia de trabalho duro. Dinheiro no bolso, mas zero arte.",
  notEnough:   "Dinheiro insuficiente!",
  bought:      "Comprado: ",
  goalLabel:   "META",
  chapterDone: "CAPÍTULO CONCLUÍDO!",
  gameOver:    "FIM",
  theEnd:      "DO SERTÃO PARA O MUNDO.\nOBRIGADO POR JOGAR!",
  credits:     "Um jogo sobre a vida de um videomaker.\nDioney Filmes © Canindé → Porto",

  // Eventos aleatórios
  eventViral:   "🔥 Vídeo viral!",
  eventClient:  "📱 Cliente novo!",
  eventFail:    "💔 Equipamento falhou...",
  eventFeature: "⭐ Media internacional notou!",
  eventBonus:   "🎉 Projeto bónus!",

  // Skill panel
  skillPanel: "TÉCNICAS DESBLOQUEADAS",
  skillClose: "Fechar",
  skillNames: [
    "Enquadramento básico",
    "Foco manual",
    "Movimento de câmera",
    "Estabilização",
    "Edição de corte",
    "Edição com efeitos",
    "Cor e LUT",
    "Slow Motion 120fps",
    "Drone aéreo",
    "Direção de produção",
  ],

  shopTitle: "EQUIPAMENTOS",
  shopClose:  "Fechar",
  owned:      "✓ TENS",
  equip: [
    { id: "v3",    name: "Motorola V3",       desc: "240p, mas é teu",       price: 80   },
    { id: "n73",   name: "Nokia N73",          desc: "480p! Que evolução",    price: 250  },
    { id: "wmm",   name: "Windows Movie Maker",desc: "Aprende a cortar",      price: 0    },
    { id: "vegas", name: "Sony Vegas",         desc: "Zooms e efeitos!",      price: 400  },
    { id: "hd",    name: "Smartphone HD",      desc: "720p no bolso",         price: 900  },
    { id: "dslr",  name: "Canon DSLR",         desc: "1080p cinema",          price: 2500 },
    { id: "stab",  name: "Estabilizador",      desc: "Adeus tremido",         price: 1200 },
    { id: "a7",    name: "Sony A7",            desc: "4K 120fps",             price: 6000 },
    { id: "drone", name: "Drone",              desc: "O céu é o limite",      price: 4500 },
  ],
};

// Capítulos — 13 capítulos, 3 atos
export const CHAPTERS = [
  // ─── ATO 1: BRASIL ───────────────────────────────────────────────
  {
    id: "caninde", act: 1, place: "Canindé, Ceará",
    intro: ["Sertão do Ceará, anos 2000.", "Dioney é um jovem que respira arte.", "Antes da câmera, veio a dança.", "O mundo ainda não sabia o que vinha aí..."],
    goal: { rep: 30 }, goalText: "Ganha 30 REP dançando",
    actions: ["dance", "talk"], bgKey: "caninde",
    npcs: [
      { name: "Luan",  lines: ["Irmão, bora dançar na praça hoje!", "A gente nasceu pra isso.", "O Stari Rebol vai mudar tudo!"] },
      { name: "Junin", lines: ["Primo, e se a gente filmasse os ensaios?", "Tem o celular do teu pai, o V3!", "Seria incrível documentar isso tudo."] },
    ],
    outro: ["As apresentações bombaram.", "Mas Junin tinha razão...", "Alguém precisava REGISTRAR aquilo.", "Dioney pegou o Motorola V3 emprestado."],
  },
  {
    id: "caninde2", act: 1, place: "Canindé — Stari Rebol",
    intro: ["Com o V3 na mão, tudo mudou.", "Gravar virou obsessão.", "À noite, no Windows Movie Maker,", "ele aprendia a cortar, sozinho."],
    goal: { money: 300, skill: 20 }, goalText: "R$300 + 20 TÉCNICA",
    actions: ["record", "edit", "publish", "work", "talk", "shop"], bgKey: "caninde",
    npcs: [
      { name: "Luan",  lines: ["Esses vídeos do grupo tão ficando bons!", "O Stari Rebol vai ficar famoso!", "Tu tem jeito pra isso, mano."] },
      { name: "Junin", lines: ["Ouvi falar de um humorista em Fortaleza...", "Tirullipa. Ele tá procurando videomaker!", "Isso pode mudar tua vida, primo."] },
    ],
    outro: ["Os vídeos do Stari Rebol rodaram a região.", "E aí chegou o convite:", "FORTALEZA. Trabalhar com Tirullipa."],
  },
  {
    id: "fortaleza", act: 1, place: "Fortaleza, Capital",
    intro: ["A capital. O mar. As luzes.", "Trabalhar com Tirullipa era outro nível.", "Sony Vegas, zooms, cortes rápidos...", "A paixão só crescia."],
    goal: { money: 1500, rep: 80 }, goalText: "R$1500 + 80 REP",
    actions: ["record", "edit", "publish", "work", "talk", "shop"], bgKey: "fortaleza",
    npcs: [
      { name: "Tirullipa", lines: ["Ô meu fí, esses vídeos tão massa!", "Precisamos evoluir o conteúdo.", "Que tal cobrir o próximo show ao vivo?"] },
      { name: "Luan",      lines: ["Mano, tu tá vivendo o sonho!", "Canindé inteiro tá orgulhoso.", "Não esquece de onde viemos!"] },
    ],
    outro: ["Os vídeos viralizavam.", "Tirullipa tinha um plano maior.", "Um show enorme ia acontecer.", "E Dioney ia cobrir TUDO."],
  },
  {
    id: "fortaleza2", act: 1, place: "Fortaleza — Show Viral",
    intro: ["Tirullipa no palco principal.", "Câmera no ombro, drone no ar.", "Uma cobertura completa do show.", "Era a chance de ir VIRAL de verdade."],
    goal: { rep: 160 }, goalText: "160 REP cobrindo o show",
    actions: ["coverage", "edit", "publish", "talk"], bgKey: "fortaleza",
    npcs: [
      { name: "Tirullipa", lines: ["Captura tudo! Público, palco, bastidor!", "Esse show vai ser histórico.", "Com teu trabalho, vai bombar no YouTube!"] },
      { name: "Luan",      lines: ["Dá pra ver teus vídeos no telão!", "Cara, tu tá ficando famoso!", "Bora celebrar depois do show."] },
    ],
    outro: ["Um milhão de views em 48 horas.", "O nome de Tirullipa explodia.", "E com ele, o videomaker atrás das câmeras.", "A turnê pelo Brasil era inevitável."],
  },
  {
    id: "tour", act: 1, place: "Brasil Norte — Turnê",
    intro: ["Ônibus, palcos, cidades.", "Norte e Nordeste de cabo a rabo.", "Gravando de dia, editando de madrugada.", "A técnica evoluía a cada show."],
    goal: { money: 3000, skill: 40 }, goalText: "R$3000 + 40 TÉCNICA",
    actions: ["record", "stabilize", "edit", "publish", "talk", "shop"], bgKey: "tour",
    npcs: [
      { name: "Tirullipa", lines: ["Norte a sul, meu fí!", "Tu tá ficando um mestre da câmera.", "Aprendi muito contigo também."] },
      { name: "Luan",      lines: ["Manda foto do Nordeste pra gente!", "Quando tu voltar, a festa é aqui."] },
    ],
    outro: ["O Norte foi épico.", "Mas o Sul chamava.", "São Paulo. Rio. Florianópolis.", "O fim do contrato se aproximava..."],
  },
  {
    id: "tour_sul", act: 1, place: "Sul do Brasil — Fim de Contrato",
    intro: ["São Paulo. Rio. Florianópolis.", "Meses na estrada, câmera no ombro.", "O contrato com Tirullipa chegava ao fim.", "Dioney precisava de um plano B."],
    goal: { money: 6000, skill: 55 }, goalText: "R$6000 + 55 TÉCNICA",
    actions: ["record", "stabilize", "edit", "publish", "talk", "shop"], bgKey: "tour",
    npcs: [
      { name: "Tirullipa", lines: ["Foram anos incríveis, meu fí.", "O contrato acaba, mas a amizade não.", "Tu és bom demais pro Brasil só... vai pro mundo!"] },
      { name: "Luan",      lines: ["Ouvi que tem oportunidade em Portugal.", "Primos nossos foram pra lá e tão bem.", "Coragem, irmão!"] },
    ],
    outro: ["O contrato acabou.", "Dioney olhou para o horizonte.", "Uma oportunidade na EUROPA.", "Mas ir significava... recomeçar do ZERO."],
  },
  // ─── ATO 2: EUROPA ───────────────────────────────────────────────
  {
    id: "porto", act: 2, place: "Porto, Portugal",
    intro: ["Porto. Frio. Chuva. Sotaque novo.", "Tudo que ele era no Brasil... não valia aqui.", "Trabalhos de restauração para o documento.", "A câmera ficou na gaveta. Mas não o sonho."],
    goal: { money: 2000 }, goalText: "Junta €2000 trabalhando",
    actions: ["work", "talk"], bgKey: "porto",
    npcs: [
      { name: "André", lines: ["Primo! Tu por cá!", "Aguenta firme. Isto melhora.", "Um dia montamos algo juntos.", "Vai dar certo, tens talento."] },
    ],
    outro: ["Meses de pratos, copas e cozinhas.", "Documento na mão.", "E na montra de uma loja... uma câmera.", "Era hora de RECOMEÇAR."],
  },
  {
    id: "porto2", act: 2, place: "Porto — Recomeço",
    intro: ["Documento aprovado. Poupança feita.", "Numa loja viu uma câmera na montra.", "Primeiro cliente: um casamento.", "Era hora de voltar a ser videomaker."],
    goal: { money: 4000, skill: 45 }, goalText: "€4000 + 45 TÉCNICA",
    actions: ["record", "stabilize", "publish", "work", "talk", "shop"], bgKey: "porto",
    npcs: [
      { name: "André", lines: ["Vi o teu trabalho de casamento. Incrível!", "Tens clientes a aparecer por indicação.", "Lisboa é o próximo passo, primo."] },
    ],
    outro: ["Primeiro cliente: casamento.", "Segundo: vídeo corporativo.", "Terceiro: anúncio para marca.", "Lisboa estava chamando."],
  },
  {
    id: "lisboa", act: 2, place: "Lisboa",
    intro: ["Lisboa abriu portas.", "Primeiro o telemóvel. Depois a DSLR.", "Nível a nível, de novo.", "André começou a aparecer nos projetos..."],
    goal: { money: 10000, rep: 200 }, goalText: "€10000 + 200 REP",
    actions: ["record", "edit", "publish", "work", "talk", "shop"], bgKey: "lisboa",
    npcs: [
      { name: "André", lines: ["Estes trabalhos estão a correr bem!", "Já pensaste? Uma empresa. Nossa.", "Tu e eu, primo. Dioney Filmes.", "Tens a visão, eu tenho os contactos."] },
    ],
    outro: ["Os clientes voltavam. A agenda enchia.", "André e Dioney apertaram as mãos.", "Nascia a EMPRESA. No Porto."],
  },
  // ─── ATO 3: EMPRESA ──────────────────────────────────────────────
  {
    id: "empresa", act: 3, place: "Porto — Dioney Filmes",
    intro: ["Estúdio próprio. Sócio. Crew.", "Alex, Yuri, Luan, Rox, Bruni...", "A caverna estava completa.", "E os clientes? Cada vez maiores."],
    goal: { money: 25000, rep: 300 }, goalText: "€25000 + 300 REP",
    actions: ["record", "timeline", "edit", "publish", "talk", "shop"], bgKey: "studio",
    npcs: [
      { name: "André", lines: ["Sócio, chegou um email...", "WARNER BROS. Querem-nos!", "É a nossa maior oportunidade."] },
      { name: "Alex",  lines: ["A crew tá pronta pra qualquer desafio!", "Novo equipamento chegou ontem.", "Bora fazer história!"] },
    ],
    outro: ["A empresa crescia.", "E chegou o email que mudaria tudo.", "Warner Bros Portugal.", "O maior projeto da carreira."],
  },
  {
    id: "warner", act: 3, place: "Warner Bros — Lisboa",
    intro: ["Warner Bros. Uma reunião.", "André e Dioney de facto e gravata.", "O maior cliente da carreira.", "Uma só chance de convencer."],
    goal: { money: 40000, rep: 380 }, goalText: "€40000 + 380 REP",
    actions: ["record", "coverage", "edit", "publish", "talk", "shop"], bgKey: "warner",
    npcs: [
      { name: "André", lines: ["Fechámos! Três clipes musicais.", "E depois vem a tour europeia.", "Próxima paragem: Ibiza com Wesley Safadão!"] },
      { name: "Alex",  lines: ["Warner Bros! A crew não acredita.", "Precisamos de mais drones.", "Vamos precisar de toda a técnica."] },
    ],
    outro: ["Contrato assinado.", "Projeto: 3 clipes musicais, tour europeia.", "Próxima paragem: Ibiza.", "Com Wesley Safadão."],
  },
  {
    id: "ibiza", act: 3, place: "Ibiza — Wesley Safadão",
    intro: ["Ibiza. Sol. Mar. Forró.", "O maior show da carreira.", "Wesley Safadão no palco.", "Drone no ar. A crew inteira pronta."],
    goal: { rep: 430 }, goalText: "430 REP no show de Ibiza",
    actions: ["coverage", "dance", "record", "talk"], bgKey: "ibiza",
    npcs: [
      { name: "Wesley Safadão", lines: ["Vumbora filmar esse show histórico!", "Quero que este vídeo chegue ao mundo todo.", "Tu és o melhor do Brasil em Portugal!"] },
      { name: "André", lines: ["5 milhões de views em 3 dias!", "Estamos a receber convites do mundo todo.", "Egito com a produção da Sony vem a seguir."] },
      { name: "Alex",  lines: ["Ibiza! Que loucura incrível!", "Esse vai ser o melhor vídeo da empresa."] },
    ],
    outro: ["O vídeo de Ibiza: 5 milhões de views.", "Convites do mundo todo.", "Mas o projeto mais épico estava chegando.", "EGITO. As pirâmides."],
  },
  {
    id: "mundo", act: 3, place: "Egito — Produção Final",
    intro: ["Pirâmides douradas ao entardecer.", "O drone sobe.", "A crew inteira atrás do monitor.", "A última tomada da jornada... por enquanto."],
    goal: { rep: 500 }, goalText: "500 REP — a tomada final",
    actions: ["record", "stabilize", "edit", "publish", "talk"], bgKey: "egypt",
    npcs: [
      { name: "Wesley Safadão", lines: ["Vumbora gravar esse clipe histórico!"] },
      { name: "André",          lines: ["Do sertão para o mundo, primo.", "Do sertão para o mundo."] },
      { name: "Alex",           lines: ["Que cena épica. Nunca esquecerei."] },
    ],
    outro: ["FIM... ou só o começo."],
  },
];
