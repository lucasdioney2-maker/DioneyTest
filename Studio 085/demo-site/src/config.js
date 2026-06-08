// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURAÇÃO DA EMPRESA — alterar por cliente
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const empresa = {
  nome:       "Oporto Confeitaria",
  tagline:    "Tradição e sabor no coração do Porto desde sempre.",
  descricao:  "Uma confeitaria que é ponto de encontro. Mais de 2.000 clientes confirmam o que já sabíamos: aqui o produto fala por si.",
  morada:     "Rua da Alegria 2112, Porto",
  telefone:   "22 502 0666",
  horario:    "Seg–Dom: 7h30–20h00",
  avaliacoes: "2.295",
  estrelas:   "4.6",
  categoria:  "Pastelaria · Café · Porto",

  // Cor de destaque (adaptar à identidade do cliente)
  accentColor: "#e8c97a",

  // Serviços / produtos (3 a 4 items)
  servicos: [
    { icon: "☕", titulo: "Café & Bebidas",    desc: "Café de especialidade e bebidas quentes preparadas na hora." },
    { icon: "🥐", titulo: "Pastelaria",        desc: "Bolos, croissants e doces tradicionais feitos diariamente." },
    { icon: "🎂", titulo: "Bolos por Encomenda", desc: "Bolos personalizados para qualquer ocasião especial." },
    { icon: "🥪", titulo: "Snacks & Sandes",   desc: "Opções salgadas frescas para qualquer hora do dia." },
  ],

  // Depoimentos (copiar das avaliações reais do Google Maps)
  depoimentos: [
    { nome: "Maria S.", texto: "Melhor confeitaria do Porto, sem dúvida. Voltamos sempre!", estrelas: 5 },
    { nome: "João F.",  texto: "Os bolos são extraordinários. Atendimento muito simpático.", estrelas: 5 },
    { nome: "Ana C.",   texto: "Um clássico do Porto. O ambiente é acolhedor e os produtos são deliciosos.", estrelas: 5 },
  ],

  gmaps: "https://maps.google.com/?cid=ChIJtyK_p15kJA0R74rzbKMMGJo",
}
