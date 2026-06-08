"""
Studio 085 — Gerador de Emails Personalizados por Empresa
Lê a planilha e gera um ficheiro TXT com todos os emails prontos a enviar.
"""

import openpyxl
from pathlib import Path

INPUT_FILE = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_DIR = Path("../emails/gerados")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REMETENTE_NOME = "Lucas Dioney"
REMETENTE_TELEFONE = "+351 XXX XXX XXX"
REMETENTE_INSTAGRAM = "@studio085"

TEMPLATE_EMAIL = """\
ASSUNTO: O {nome} merece estar online 🌐
PARA: {email_destino}
TELEFONE: {telefone}
GOOGLE MAPS: {gmaps}
AVALIAÇÕES: {avaliacoes} avaliações | {estrelas}⭐
---

Olá, equipa do {nome},

O meu nome é Lucas, sou do **Studio 085**, um estúdio audiovisual e criativo sediado no Porto.

Encontrei o vosso negócio no Google Maps e fiquei impressionado com as avaliações que têm — {estrelas} estrelas com {avaliacoes} avaliações é excelente! Fica claro que o vosso trabalho fala por si.

Por isso mesmo queria partilhar algo convosco:

Muitos negócios de qualidade no Porto ainda não têm presença online — sem site, sem forma de novos clientes vos encontrarem facilmente. Queremos ajudar a mudar isso, de forma simples e sem riscos para vocês.

**O que oferecemos:**
✅ Site profissional — entregamos o site a preço de custo (pagam apenas a hospedagem e plataforma, ~5-10€/mês, sem margem nossa)
📸 Fotografia e vídeo — captamos o vosso espaço, produtos e equipa com qualidade profissional
📱 Conteúdo para Instagram e site — mantemos os vossos perfis ativos e atrativos

A lógica é simples: o site não nos dá lucro. Queremos estabelecer uma parceria de conteúdo a longo prazo, porque um negócio com a vossa reputação merece ser visto por muito mais pessoas.

Se quiserem, posso enviar exemplos do nosso trabalho e conversar sem qualquer compromisso.

Cumprimentos,
{remetente_nome}
Studio 085 | Porto
📞 {remetente_telefone}
📷 {remetente_instagram}
"""

TEMPLATE_WHATSAPP = """\
WHATSAPP/SMS para: {telefone}
Negócio: {nome}
---
Olá! Sou o Lucas do Studio 085 🎥
Vi o {nome} no Google Maps — {estrelas}⭐ com {avaliacoes} avaliações, impressionante! 👏
Estamos a oferecer sites a preço de custo* a negócios do Porto sem presença online.
*Apenas pagam a hospedagem (~5-10€/mês), nós tratamos de tudo.
Posso enviar mais info? Sem compromisso 🙏
"""


def categorias_br(cat):
    mapping = {
        "restaurant": "Restaurante",
        "cafe": "Café / Pastelaria",
        "bar": "Bar",
        "bakery": "Padaria / Confeitaria",
        "hair_care": "Cabeleireiro / Barbearia",
        "beauty_salon": "Salão de Beleza",
        "physiotherapist": "Clínica / Fisioterapia",
        "gym": "Ginásio",
        "store": "Loja",
        "clothing_store": "Loja de Roupa",
    }
    return mapping.get(cat, cat)


def main():
    wb = openpyxl.load_workbook(INPUT_FILE)
    ws = wb["Empresas"]
    rows = list(ws.iter_rows(values_only=True))

    all_emails = []
    all_whatsapp = []
    priority = []

    for row in rows[1:]:
        nome, categoria, morada, telefone, avaliacoes, estrelas, website, gmaps, estado = row[:9]

        if estado and estado != "Por contactar":
            continue  # já contactado

        email_destino = ""  # será preenchido manualmente ou pelo script de enriquecimento

        email_text = TEMPLATE_EMAIL.format(
            nome=nome or "",
            email_destino=email_destino or "(a preencher)",
            telefone=telefone or "(sem telefone)",
            gmaps=gmaps or "",
            avaliacoes=int(avaliacoes) if avaliacoes else 0,
            estrelas=estrelas or "",
            remetente_nome=REMETENTE_NOME,
            remetente_telefone=REMETENTE_TELEFONE,
            remetente_instagram=REMETENTE_INSTAGRAM,
        )

        wpp_text = TEMPLATE_WHATSAPP.format(
            nome=nome or "",
            telefone=telefone or "(sem telefone)",
            estrelas=estrelas or "",
            avaliacoes=int(avaliacoes) if avaliacoes else 0,
        )

        all_emails.append(email_text)
        if telefone:
            all_whatsapp.append(wpp_text)

        # Prioridade: +200 avaliações e +4.3 estrelas
        if avaliacoes and avaliacoes >= 200 and estrelas and estrelas >= 4.3:
            priority.append(f"{nome} | {categorias_br(categoria)} | ⭐{estrelas} | {int(avaliacoes)} avaliações | {telefone or 'sem tel'}")

    # Salva emails
    with open(OUTPUT_DIR / "todos_os_emails.txt", "w", encoding="utf-8") as f:
        f.write("\n\n" + "="*70 + "\n\n".join(all_emails))
    print(f"✅ {len(all_emails)} emails gerados → {OUTPUT_DIR}/todos_os_emails.txt")

    # Salva WhatsApp
    with open(OUTPUT_DIR / "mensagens_whatsapp.txt", "w", encoding="utf-8") as f:
        f.write("\n\n" + "="*70 + "\n\n".join(all_whatsapp))
    print(f"✅ {len(all_whatsapp)} mensagens WhatsApp → {OUTPUT_DIR}/mensagens_whatsapp.txt")

    # Salva lista de prioridade
    with open(OUTPUT_DIR / "empresas_prioritarias.txt", "w", encoding="utf-8") as f:
        f.write("EMPRESAS PRIORITÁRIAS (200+ avaliações, 4.3+ estrelas)\n")
        f.write("="*70 + "\n\n")
        for p in priority:
            f.write(p + "\n")
    print(f"✅ {len(priority)} empresas prioritárias → {OUTPUT_DIR}/empresas_prioritarias.txt")


if __name__ == "__main__":
    main()
