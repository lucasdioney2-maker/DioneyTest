"""
Studio 085 — Emails Personalizados por Nicho
Cada categoria de negócio recebe um email diferente, falando a linguagem do sector.
"""

import openpyxl
from pathlib import Path

INPUT_FILE = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_DIR = Path("../emails/por_empresa")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Dados do Studio ───────────────────────────────────────────────────────────
NOME_STUDIO   = "Lucas | Studio 085"
TEL_STUDIO    = "+351 XXX XXX XXX"    # ← preencher
INSTAGRAM     = "@studio085"           # ← preencher
EMAIL_STUDIO  = "studio085@gmail.com"  # ← preencher
PORTFOLIO_URL = "https://linktr.ee/studio085"  # ← preencher

# ── Templates por nicho ───────────────────────────────────────────────────────

TEMPLATES = {

"restaurant": {
"assunto": "O {nome} tem tudo para estar no topo do Google 🍽️",
"corpo": """\
Olá, equipa do {nome},

Sou o Lucas, do Studio 085 — estúdio audiovisual e criativo do Porto.

Encontrei o vosso restaurante no Google Maps e fiquei mesmo impressionado: {aval} avaliações com {est}⭐. Isso é o tipo de reputação que a maioria dos restaurantes leva anos a construir.

O problema? Quem pesquisa "restaurante no Porto" no Google não vos encontra — porque sem site, ficam invisíveis para novos clientes que não conhecem o vosso espaço.

Queremos resolver isso:

🌐 Site profissional com menu, fotos e localização
   → Pagam apenas hospedagem + domínio (~10€/mês). Criação sem custo.

📸 Sessão fotográfica dos pratos, espaço e equipa
   → Imagens profissionais que fazem as pessoas querer reservar mesa

📱 Conteúdo para Instagram e Google
   → Publicações regulares que atraem novos clientes

A lógica é simples: o site fica praticamente de graça para nós estabelecermos uma parceria. Um restaurante com a vossa qualidade merece uma vitrina à altura.

Se quiserem ver exemplos do nosso trabalho: {portfolio}

Podem responder a este email ou ligar/WhatsApp para {tel}.

Bom serviço,
{remetente}
"""},

"cafe": {
"assunto": "O {nome} merece ser descoberto por mais pessoas ☕",
"corpo": """\
Olá, equipa do {nome},

O meu nome é Lucas, sou do Studio 085, estúdio criativo no Porto.

Vi o vosso espaço no Google Maps — {aval} avaliações com {est}⭐ fala por si. Claramente têm uma base de clientes fiel e um produto que as pessoas adoram.

Mas muita gente que procura "café/pastelaria no Porto" nunca vos vai encontrar — porque sem site, ficam fora dos resultados de pesquisa.

O que propomos:

☕ Site elegante com a vossa história, produtos e horário
   → Pagam apenas ~10€/mês de hospedagem. Desenvolvemos sem cobrar criação.

📸 Fotografia profissional dos vossos produtos e espaço
   → Imagens que transmitem o ambiente e fazem as pessoas querer vir

📱 Presença activa no Instagram
   → Conteúdos que fidelizam e atraem novos clientes

Queremos ser o vosso parceiro de comunicação a longo prazo — e por isso a criação do site é praticamente de graça.

Exemplos do nosso trabalho: {portfolio}

Respondam quando puderem ou liguem: {tel}

Com simpatia,
{remetente}
"""},

"bar": {
"assunto": "O {nome} ainda não está no mapa online — vamos mudar isso 🍸",
"corpo": """\
Olá, equipa do {nome},

Sou o Lucas, do Studio 085 — estúdio audiovisual no Porto.

O vosso bar tem {aval} avaliações com {est}⭐ no Google Maps. Isso é excelente. Mas quem pesquisa "bar no Porto" no Google não vos encontra porque não têm site.

Queremos ajudar a mudar isso, sem grande investimento da vossa parte:

🍸 Site moderno com a identidade do bar, eventos e localização
   → Apenas ~10€/mês de hospedagem. Criação sem custo.

🎥 Vídeo e foto do espaço, ambiente e cocktails
   → Conteúdo que mostra a vibe do bar e atrai o público certo

📱 Instagram activo e consistente
   → Stories, reels e publicações que criam comunidade

O site é praticamente de graça — queremos ser o vosso parceiro de conteúdo a longo prazo.

Portfolio: {portfolio}
Contacto: {tel}

Abraço,
{remetente}
"""},

"bakery": {
"assunto": "A {nome} tem {aval} fãs — está na hora de estar online 🥐",
"corpo": """\
Olá, equipa da {nome},

O meu nome é Lucas, do Studio 085.

{aval} avaliações com {est}⭐ no Google Maps é extraordinário para uma padaria/confeitaria. As pessoas adoram o que fazem — e querem partilhar isso com o mundo.

O que ainda falta? Uma presença online onde novos clientes vos possam encontrar e descobrir o vosso trabalho.

🥐 Site com os vossos produtos, história e horário
   → Só pagam ~10€/mês de hospedagem. Criação por nossa conta.

📸 Fotografia profissional dos vossos produtos
   → Imagens que fazem crescer água na boca e aumentam as encomendas

📱 Instagram com vida
   → Publicações regulares que mostram o dia-a-dia e atraem mais clientes

Um negócio com a vossa reputação merece ser encontrado por muito mais pessoas.

Portfolio: {portfolio}
Contacto: {tel}

Com carinho,
{remetente}
"""},

"hair_care": {
"assunto": "Novos clientes estão a procurar o {nome} — mas não vos encontram ✂️",
"corpo": """\
Olá, equipa do {nome},

Sou o Lucas, do Studio 085, estúdio criativo no Porto.

Vi o vosso salão no Google Maps — {aval} avaliações com {est}⭐ mostra que têm uma clientela fiel e um trabalho de qualidade.

Mas hoje em dia, quem procura "cabeleireiro no Porto" no Google espera encontrar um site com fotos, serviços e forma de contacto. Sem isso, perdem clientes antes de sequer os conhecer.

Queremos ajudar:

✂️ Site profissional com serviços, galeria de trabalhos e reserva de marcações
   → Apenas ~10€/mês de hospedagem. Criação sem custo.

📸 Fotografia dos vossos cortes, colorações e espaço
   → Portfólio visual que atrai novos clientes e mostra o vosso estilo

📱 Instagram actualizado e apelativo
   → Publicações de before/after e tendências que aumentam a visibilidade

Queremos ser o vosso parceiro de comunicação — e o site é a nossa forma de começar a parceria.

Portfolio: {portfolio}
Contacto: {tel}

Cumprimentos,
{remetente}
"""},

"beauty_salon": {
"assunto": "O {nome} merece brilhar online ✨",
"corpo": """\
Olá, equipa do {nome},

O meu nome é Lucas, do Studio 085 — estúdio de comunicação e audiovisual no Porto.

{aval} avaliações com {est}⭐ no Google Maps. Fica claro que o vosso trabalho deixa as clientes satisfeitas.

O próximo passo natural é ter uma presença online que reflicta essa qualidade e traga novas clientes:

💅 Site elegante com serviços, galeria e marcações online
   → Pagam apenas a hospedagem (~10€/mês). Criação sem custo.

📸 Fotografia profissional do espaço e dos vossos tratamentos
   → Imagens que transmitem confiança e elevam a percepção da marca

📱 Instagram consistente e apelativo
   → Conteúdo visual que posiciona o salão como referência na zona

Portfolio: {portfolio}
Contacto: {tel}

Com carinho,
{remetente}
"""},

"physiotherapist": {
"assunto": "A {nome} pode estar a perder pacientes sem saber 🏥",
"corpo": """\
Olá, equipa da {nome},

Sou o Lucas, do Studio 085.

A vossa clínica tem {aval} avaliações com {est}⭐ — uma reputação excelente. Mas quando alguém pesquisa "fisioterapia no Porto", não vos encontra porque não têm site.

Hoje, os pacientes pesquisam online antes de marcar consulta. Um site profissional transmite credibilidade e facilita o contacto.

🏥 Site clínico com serviços, equipa, localização e formulário de marcação
   → Apenas ~10€/mês de hospedagem. Criação sem custo.

📸 Fotografia profissional das instalações e equipa
   → Imagens que transmitem confiança e profissionalismo

📱 Presença digital activa
   → Conteúdo sobre saúde e bem-estar que posiciona a clínica como referência

Portfolio: {portfolio}
Contacto: {tel}

Cumprimentos,
{remetente}
"""},

"gym": {
"assunto": "O {nome} pode atrair muito mais membros com uma presença online 💪",
"corpo": """\
Olá, equipa do {nome},

O meu nome é Lucas, do Studio 085 — estúdio audiovisual no Porto.

{aval} avaliações com {est}⭐ no Google Maps é excelente. Mas sem site, quem pesquisa "ginásio no Porto" não vos encontra.

Queremos ajudar a mudar isso:

💪 Site com modalidades, horários, preços e tour virtual
   → Apenas ~10€/mês de hospedagem. Criação sem custo.

🎥 Vídeo e foto das instalações e aulas
   → Conteúdo que mostra a energia do ginásio e converte visitantes em membros

📱 Instagram activo com transformações, dicas e promoções
   → Publicações que criam comunidade e trazem novos sócios

Portfolio: {portfolio}
Contacto: {tel}

Força,
{remetente}
"""},

"store": {
"assunto": "A {nome} pode vender para todo o Porto — com um site simples 🛍️",
"corpo": """\
Olá, equipa da {nome},

Sou o Lucas, do Studio 085.

{aval} avaliações com {est}⭐ no Google Maps mostra que têm clientes satisfeitos. Mas sem site, ficam invisíveis para todos os que não passam pela vossa porta.

O que propomos:

🛍️ Site com produtos, serviços e localização
   → Apenas ~10€/mês de hospedagem. Criação sem custo.
   → No futuro, podemos adicionar loja online se precisarem.

📸 Fotografia profissional dos produtos e espaço
   → Imagens que aumentam o desejo de compra

📱 Instagram e Google actualizados
   → Conteúdo que traz tráfego online e presencial

Portfolio: {portfolio}
Contacto: {tel}

Cumprimentos,
{remetente}
"""},

"clothing_store": {
"assunto": "A {nome} merece uma vitrina online à altura da loja 👗",
"corpo": """\
Olá, equipa da {nome},

O meu nome é Lucas, do Studio 085 — estúdio criativo no Porto.

{aval} avaliações com {est}⭐ mostra que têm um produto e serviço que as pessoas adoram. Agora é altura de ter uma presença online que reflicta isso.

👗 Site com look-book, colecções e contactos
   → Apenas ~10€/mês de hospedagem. Criação por nossa conta.

📸 Sessão fotográfica editorial das peças e espaço
   → Imagens de moda que elevam a marca e aumentam as vendas

📱 Instagram de moda activo e consistente
   → Conteúdo que cria desejo e fideliza clientes

Portfolio: {portfolio}
Contacto: {tel}

Com estilo,
{remetente}
"""},
}

# Fallback genérico
TEMPLATE_GENERICO = {
"assunto": "O {nome} merece estar online 🌐",
"corpo": """\
Olá, equipa do {nome},

Sou o Lucas, do Studio 085 — estúdio audiovisual e criativo no Porto.

Encontrei o vosso negócio no Google Maps: {aval} avaliações com {est}⭐. É excelente! Mas sem site, quem pesquisa no Google não vos encontra.

O que propomos:

🌐 Site profissional → pagam apenas ~10€/mês de hospedagem (criação sem custo)
📸 Fotografia e vídeo do vosso negócio
📱 Conteúdo para Instagram

Queremos ser o vosso parceiro de comunicação a longo prazo.

Portfolio: {portfolio}
Contacto: {tel}

Cumprimentos,
{remetente}
"""}

FOOTER = """
──────────────────────────────────────
{remetente}
📞 {tel}
📷 {instagram}
✉️  {email}
{portfolio}
──────────────────────────────────────
"""

FOLLOWUP = """\
ASSUNTO: RE: {assunto_original}

Olá,

Só uma nota rápida — enviei uma mensagem há alguns dias sobre criar um site para o {nome} praticamente sem custo.

Se não for o momento certo, sem problema! Mas se tiverem 5 minutos, adorava mostrar como outros negócios do Porto já beneficiaram.

Portfolio: {portfolio}

{remetente}
"""

WHATSAPP = """\
Olá! 👋 Sou o Lucas do Studio 085 🎥

Vi o *{nome}* no Google Maps — {aval} avaliações com {est}⭐, impressionante! 🙌

Estamos a criar sites profissionais para negócios do Porto sem presença online — praticamente de graça (só pagam ~10€/mês de hospedagem).

Também fazemos foto, vídeo e gestão de Instagram 📸

Posso enviar mais info? Sem compromisso 🙏
"""

GUIAO_LIGACAO = """\
📞 GUIÃO DE LIGAÇÃO — {nome}
Número: {telefone}
Categoria: {categoria}
Avaliações: {aval}⭐ {est}
──────────────────────────────────────
"Bom dia/tarde, falo com o/a responsável do {nome}?
 O meu nome é Lucas, sou do Studio 085, um estúdio audiovisual no Porto.
 Encontrei o vosso negócio no Google Maps com {aval} avaliações — excelente!
 Queria partilhar uma proposta rápida: criamos sites profissionais para
 negócios do Porto praticamente de graça, só pagam a hospedagem.
 Tem um minutinho para eu explicar melhor?"

Se sim → "Ótimo! Posso enviar um email com todos os detalhes?
           Qual é o melhor email para contactar?"

Se não for boa altura → "Claro, sem problema! Quando seria melhor ligar?"
──────────────────────────────────────
"""

CATEGORIA_PT = {
    "restaurant": "Restaurante", "cafe": "Café / Pastelaria",
    "bar": "Bar", "bakery": "Padaria / Confeitaria",
    "hair_care": "Cabeleireiro", "beauty_salon": "Salão de Beleza",
    "physiotherapist": "Clínica / Fisioterapia", "gym": "Ginásio",
    "store": "Loja", "clothing_store": "Loja de Roupa",
}

def is_mobile(tel):
    if not tel: return False
    t = str(tel).replace(" ", "").replace("+351", "").replace("351", "")
    return t.startswith("9")

def render(template_str, **kw):
    return template_str.format(**kw)

def main():
    wb = openpyxl.load_workbook(INPUT_FILE)
    ws = wb["Empresas"]
    rows = list(ws.iter_rows(values_only=True))[1:]

    # Ordena por score
    rows.sort(key=lambda r: (r[4] or 0) * (r[5] or 0), reverse=True)

    emails_out    = []
    wpp_out       = []
    ligacoes_out  = []
    followups_out = []
    index_out     = []

    for idx, row in enumerate(rows, 1):
        nome      = row[0] or ""
        categoria = row[1] or ""
        morada    = row[2] or ""
        telefone  = str(row[3] or "").strip()
        aval      = int(row[4] or 0)
        est       = row[5] or 0
        gmaps     = row[7] or ""
        cat_pt    = CATEGORIA_PT.get(categoria, categoria)
        mobile    = is_mobile(telefone)

        tmpl = TEMPLATES.get(categoria, TEMPLATE_GENERICO)
        kw = dict(
            nome=nome, aval=aval, est=est, tel=TEL_STUDIO,
            portfolio=PORTFOLIO_URL, remetente=NOME_STUDIO,
            instagram=INSTAGRAM, email=EMAIL_STUDIO,
        )

        assunto = render(tmpl["assunto"], **kw)
        corpo   = render(tmpl["corpo"], **kw)
        footer  = render(FOOTER, **kw)
        full_email = f"ASSUNTO: {assunto}\n\n{corpo}{footer}"
        full_followup = render(FOLLOWUP, assunto_original=assunto, **kw)
        wpp_msg = render(WHATSAPP, **kw)
        guiao   = render(GUIAO_LIGACAO, nome=nome, telefone=telefone,
                         categoria=cat_pt, aval=est, est=aval)

        canal = "📱 WhatsApp" if mobile else ("📞 Ligação" if telefone else "❓ Sem contacto")

        # Ficheiro individual por empresa
        safe_name = "".join(c if c.isalnum() or c in " _-" else "_" for c in nome)[:40]
        empresa_file = OUTPUT_DIR / f"{idx:02d}_{safe_name}.txt"
        with open(empresa_file, "w", encoding="utf-8") as f:
            f.write(f"{'='*70}\n")
            f.write(f"EMPRESA #{idx}: {nome.upper()}\n")
            f.write(f"Categoria: {cat_pt} | {aval} avaliações | {est}⭐\n")
            f.write(f"Morada: {morada}\n")
            f.write(f"Tel: {telefone or 'sem telefone'} | Canal: {canal}\n")
            f.write(f"Maps: {gmaps}\n")
            f.write(f"{'='*70}\n\n")
            f.write("── EMAIL INICIAL ──\n\n")
            f.write(full_email)
            f.write("\n\n── FOLLOW-UP (7 dias depois) ──\n\n")
            f.write(full_followup)
            if mobile:
                f.write("\n\n── WHATSAPP ──\n\n")
                f.write(wpp_msg)
            if telefone:
                f.write("\n\n── LIGAÇÃO ──\n\n")
                f.write(guiao)

        emails_out.append((idx, nome, cat_pt, aval, est, assunto, full_email))
        followups_out.append((idx, nome, full_followup))
        if mobile:
            wpp_out.append((idx, nome, aval, est, telefone, wpp_msg))
        if telefone and not mobile:
            ligacoes_out.append((idx, nome, aval, est, telefone, guiao))
        index_out.append((idx, nome, cat_pt, aval, est, canal, telefone, gmaps))

    # ── Ficheiro mestre de emails ─────────────────────────────────────────────
    with open("../emails/gerados/01_EMAILS_COMPLETOS.txt", "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — TODOS OS EMAILS POR PRIORIDADE\n")
        f.write("="*70 + "\n\n")
        f.write("COMO USAR:\n")
        f.write("1. Para cada empresa, pesquisa '{Nome} Porto email' no Google\n")
        f.write("2. Copia o email encontrado → envia o texto abaixo\n")
        f.write("3. Marca na planilha: Estado→Contactado, Data, etc.\n")
        f.write("4. Sem resposta em 7 dias → envia o Follow-up\n")
        f.write("="*70 + "\n\n")
        for idx, nome, cat, aval, est, assunto, email_txt in emails_out:
            f.write(f"[{idx}] {nome.upper()} — {cat} | {aval} av. {est}⭐\n\n")
            f.write(email_txt + "\n" + "─"*70 + "\n\n")

    # ── Follow-ups ────────────────────────────────────────────────────────────
    with open("../emails/gerados/01b_FOLLOWUPS.txt", "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — FOLLOW-UPS (enviar 7 dias após email inicial)\n")
        f.write("="*70 + "\n\n")
        for idx, nome, fup in followups_out:
            f.write(f"[{idx}] {nome.upper()}\n\n{fup}\n" + "─"*70 + "\n\n")

    # ── WhatsApp ──────────────────────────────────────────────────────────────
    with open("../emails/gerados/02_WHATSAPP.txt", "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — MENSAGENS WHATSAPP (números móveis 9xx)\n")
        f.write("="*70 + "\n\n")
        for idx, nome, aval, est, tel, msg in wpp_out:
            f.write(f"[{idx}] {nome.upper()} | 📱 {tel}\n\n{msg}\n" + "─"*70 + "\n\n")

    # ── Ligações ──────────────────────────────────────────────────────────────
    with open("../emails/gerados/03_LIGACOES.txt", "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — LISTA DE LIGAÇÕES (números fixos 2xx)\n")
        f.write("="*70 + "\n\n")
        for idx, nome, aval, est, tel, guiao in ligacoes_out:
            f.write(f"[{idx}] {nome.upper()} | 📞 {tel} | {aval} av. {est}⭐\n\n{guiao}\n" + "─"*70 + "\n\n")

    # ── Índice ────────────────────────────────────────────────────────────────
    with open("../emails/gerados/00_INDICE.txt", "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — ÍNDICE DE PROSPECÇÃO\n")
        f.write("="*70 + "\n\n")
        f.write(f"{'Nº':<4} {'Nome':<35} {'Categoria':<22} {'Av.':<6} {'⭐':<5} {'Canal':<16} {'Tel'}\n")
        f.write("─"*110 + "\n")
        for idx, nome, cat, aval, est, canal, tel, gmaps in index_out:
            f.write(f"{idx:<4} {nome[:34]:<35} {cat[:21]:<22} {aval:<6} {est:<5} {canal:<16} {tel}\n")
        f.write(f"\nTOTAL: {len(index_out)} empresas | {len(wpp_out)} WhatsApp | {len(ligacoes_out)} ligações\n")

    print(f"\n{'='*50}")
    print(f"✅ {len(index_out)} emails personalizados por nicho gerados")
    print(f"✅ {len(wpp_out)} mensagens WhatsApp")
    print(f"✅ {len(ligacoes_out)} guiões de ligação")
    print(f"✅ Ficheiro individual por empresa em: emails/por_empresa/")
    print(f"{'='*50}")
    print(f"\nFICHEIROS PRINCIPAIS:")
    print(f"  00_INDICE.txt            — visão geral de todas as empresas")
    print(f"  01_EMAILS_COMPLETOS.txt  — todos os emails por ordem de prioridade")
    print(f"  01b_FOLLOWUPS.txt        — follow-ups para enviar após 7 dias")
    print(f"  02_WHATSAPP.txt          — mensagens WhatsApp prontas")
    print(f"  03_LIGACOES.txt          — guiões de ligação")
    print(f"  por_empresa/             — ficheiro individual de cada empresa")


if __name__ == "__main__":
    main()
