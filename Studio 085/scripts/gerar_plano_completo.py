"""
Studio 085 — Gerador do Plano Completo de Prospecção
Cria:
  1. Planilha Excel de tracking com todos os contactos classificados
  2. Ficheiro de emails prontos (por prioridade)
  3. Ficheiro WhatsApp/SMS prontos (por prioridade)
  4. Ficheiro de ligações (por prioridade)
  5. Resumo executivo
"""

import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from pathlib import Path

INPUT_FILE  = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_XLSX = "../prospeccao/Studio_085_Plano_Prospeccao.xlsx"
EMAILS_TXT  = "../emails/gerados/01_emails_prontos.txt"
WPP_TXT     = "../emails/gerados/02_whatsapp_prontos.txt"
LIGACOES_TXT= "../emails/gerados/03_ligacoes_lista.txt"
RESUMO_TXT  = "../emails/gerados/00_resumo_plano.txt"

NOME_STUDIO   = "Lucas | Studio 085"
TEL_STUDIO    = "+351 XXX XXX XXX"   # ← substituir
INSTAGRAM     = "@studio085"          # ← substituir
EMAIL_STUDIO  = "studio085@gmail.com" # ← substituir

CATEGORIA_PT = {
    "restaurant": "Restaurante",
    "cafe": "Café / Pastelaria",
    "bar": "Bar",
    "bakery": "Padaria / Confeitaria",
    "hair_care": "Cabeleireiro",
    "beauty_salon": "Salão de Beleza",
    "physiotherapist": "Clínica / Fisioterapia",
    "gym": "Ginásio",
    "store": "Loja",
    "clothing_store": "Loja de Roupa",
}

def is_mobile(tel):
    if not tel: return False
    t = str(tel).replace(" ", "").replace("+351", "").replace("351", "")
    return t.startswith("9")

def canal(tel):
    if not tel: return "❓ Sem contacto"
    return "📱 WhatsApp" if is_mobile(tel) else "📞 Ligação"

def score(aval, est):
    return round((aval or 0) * (est or 0))

# ---------- Templates ----------

def email_frio(nome, categoria, aval, est):
    cat = CATEGORIA_PT.get(categoria, categoria)
    return f"""\
ASSUNTO: O {nome} merece estar online 🌐

Olá, equipa do {nome},

O meu nome é Lucas, sou do Studio 085 — um estúdio audiovisual e criativo sediado no Porto.

Encontrei o vosso {cat.lower()} no Google Maps e fiquei impressionado: {int(aval)} avaliações com {est}⭐ é excelente! Fica claro que o vosso trabalho fala por si.

Por isso mesmo, quero partilhar uma proposta que pode fazer todo o sentido para vocês:

🌐 SITE PROFISSIONAL — 150€ de criação + 50€/mês de manutenção (hospedagem incluída).
   Um investimento mínimo para ter uma presença online profissional.

📸 FOTOGRAFIA & VÍDEO — captamos o vosso espaço, equipa e produto com qualidade profissional.

📱 CONTEÚDO PARA INSTAGRAM & SITE — mantemos os vossos perfis activos e atrativos com novos clientes a aparecer.

A lógica é simples: queremos ser o vosso parceiro de conteúdo a longo prazo. O site tem um custo mínimo — porque acreditamos que um negócio com a vossa reputação merece ser visto por muito mais pessoas.

Se quiserem ver exemplos do nosso trabalho e perceber como funciona, é só responder a este email. Sem compromisso nenhum.

Cumprimentos,
{NOME_STUDIO}
📞 {TEL_STUDIO}
📷 {INSTAGRAM}
✉️  {EMAIL_STUDIO}
"""

def wpp_frio(nome, categoria, aval, est):
    cat = CATEGORIA_PT.get(categoria, categoria).lower()
    return f"""\
Olá! Sou o Lucas do Studio 085 🎥

Vi o *{nome}* no Google Maps — {int(aval)} avaliações com {est}⭐, impressionante para um {cat}! 👏

Estamos a criar sites profissionais para negócios do Porto sem presença online, praticamente de graça — 150€ de criação + 50€/mês de manutenção.

Também fazemos foto, vídeo e gestão de Instagram se precisarem 📸

Posso enviar mais info? Sem compromisso 🙏
"""

def followup_email(nome):
    return f"""\
ASSUNTO: RE: O {nome} merece estar online 🌐

Olá,

Só uma nota rápida — enviei uma mensagem há alguns dias sobre a criação de um site para o {nome}, praticamente sem custo.

Se não for o momento certo, sem problema! Mas se tiverem 5 minutos, adorava mostrar como outros negócios do Porto já estão a beneficiar.

Aqui vai um exemplo do nosso trabalho: {INSTAGRAM}

Bom trabalho!
{NOME_STUDIO}
"""

# ---------- Main ----------

def main():
    wb_in = openpyxl.load_workbook(INPUT_FILE)
    ws_in = wb_in["Empresas"]
    rows = [r for r in ws_in.iter_rows(values_only=True)][1:]

    # Enriquece e ordena
    empresas = []
    for row in rows:
        nome      = row[0] or ""
        categoria = row[1] or ""
        morada    = row[2] or ""
        telefone  = str(row[3] or "").strip()
        avaliacoes= float(row[4] or 0)
        estrelas  = float(row[5] or 0)
        gmaps     = row[7] or ""

        empresas.append({
            "nome": nome, "categoria": categoria, "morada": morada,
            "telefone": telefone, "avaliacoes": avaliacoes, "estrelas": estrelas,
            "gmaps": gmaps, "canal": canal(telefone),
            "score": score(avaliacoes, estrelas),
        })

    empresas.sort(key=lambda x: -x["score"])

    # Listas separadas por canal
    wpp_list  = [e for e in empresas if e["canal"] == "📱 WhatsApp"]
    call_list = [e for e in empresas if e["canal"] == "📞 Ligação"]
    sem_tel   = [e for e in empresas if e["canal"] == "❓ Sem contacto"]

    # ── 1. Excel de Tracking ──────────────────────────────────────────────────
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Plano Prospecção"

    # Cores
    verde  = PatternFill("solid", fgColor="C6EFCE")
    amarelo= PatternFill("solid", fgColor="FFEB9C")
    vermelho=PatternFill("solid", fgColor="FFC7CE")
    azul   = PatternFill("solid", fgColor="BDD7EE")
    cinza  = PatternFill("solid", fgColor="D9D9D9")
    header_fill = PatternFill("solid", fgColor="1F3864")

    header_font = Font(color="FFFFFF", bold=True, size=10)
    bold = Font(bold=True)

    cols = [
        "Nº", "Nome", "Categoria", "Morada", "Telefone",
        "Avaliações", "Estrelas", "Score", "Canal",
        "Estado", "Data Contacto", "Resposta", "Follow-up", "Notas", "Google Maps"
    ]
    ws.append(cols)
    for c in range(1, len(cols)+1):
        cell = ws.cell(1, c)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Larguras
    widths = [4, 30, 18, 38, 16, 11, 8, 8, 14, 16, 14, 14, 12, 25, 45]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[1].height = 28

    canal_fill = {
        "📱 WhatsApp": verde,
        "📞 Ligação":  amarelo,
        "❓ Sem contacto": vermelho,
    }

    for idx, e in enumerate(empresas, 1):
        row_data = [
            idx, e["nome"], CATEGORIA_PT.get(e["categoria"], e["categoria"]),
            e["morada"], e["telefone"],
            int(e["avaliacoes"]), e["estrelas"], e["score"],
            e["canal"], "Por contactar", "", "", "", "", e["gmaps"]
        ]
        ws.append(row_data)
        r = ws.max_row
        fill = canal_fill.get(e["canal"], cinza)
        for c in range(1, len(cols)+1):
            ws.cell(r, c).fill = fill
            ws.cell(r, c).alignment = Alignment(vertical="center", wrap_text=True)
        ws.cell(r, 1).font  = bold
        ws.cell(r, 1).alignment = Alignment(horizontal="center", vertical="center")
        ws.cell(r, 9).font  = bold

    ws.freeze_panes = "B2"
    wb.save(OUTPUT_XLSX)
    print(f"✅ Excel: {OUTPUT_XLSX}")

    # ── 2. Emails prontos ────────────────────────────────────────────────────
    Path(EMAILS_TXT).parent.mkdir(parents=True, exist_ok=True)
    with open(EMAILS_TXT, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — EMAILS DE PROSPECÇÃO (ordenados por prioridade)\n")
        f.write("="*70 + "\n\n")
        f.write("⚠️  COMO USAR:\n")
        f.write("  1. Para cada empresa abaixo, pesquisa no Google: '{Nome} Porto email'\n")
        f.write("  2. Copia o email encontrado e envia o texto abaixo\n")
        f.write("  3. Marca na planilha Excel: Estado → 'Contactado', Data, etc.\n")
        f.write("  4. Se não responder em 7 dias → usar o Follow-up (no final)\n\n")
        f.write("="*70 + "\n\n")
        for i, e in enumerate(empresas, 1):
            f.write(f"[{i}] {e['nome'].upper()} | {int(e['avaliacoes'])} avaliações {e['estrelas']}⭐\n")
            f.write(f"Morada: {e['morada']}\n")
            f.write(f"Tel: {e['telefone'] or 'sem telefone'}\n")
            f.write(f"Maps: {e['gmaps']}\n\n")
            f.write(email_frio(e["nome"], e["categoria"], e["avaliacoes"], e["estrelas"]))
            f.write("\n" + "-"*70 + "\n\n")
        f.write("\n\n" + "="*70 + "\n")
        f.write("TEMPLATES DE FOLLOW-UP (enviar 7 dias depois se não houver resposta)\n")
        f.write("="*70 + "\n\n")
        for e in empresas:
            f.write(followup_email(e["nome"]))
            f.write("\n" + "-"*50 + "\n\n")
    print(f"✅ Emails: {EMAILS_TXT}")

    # ── 3. WhatsApp ──────────────────────────────────────────────────────────
    with open(WPP_TXT, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — MENSAGENS WHATSAPP (ordenadas por prioridade)\n")
        f.write("="*70 + "\n\n")
        f.write("⚠️  SÓ ENVIAR após tentar email (ou se não houver email)\n")
        f.write("  • Abre o WhatsApp e copia o texto abaixo para o número indicado\n")
        f.write("  • Números móveis (9xx) têm muito maior probabilidade de ter WhatsApp\n\n")
        f.write("="*70 + "\n\n")
        for i, e in enumerate(wpp_list, 1):
            f.write(f"[{i}] {e['nome'].upper()} | {int(e['avaliacoes'])} avaliações {e['estrelas']}⭐\n")
            f.write(f"📱 Número: {e['telefone']}\n")
            f.write(f"Maps: {e['gmaps']}\n\n")
            f.write(wpp_frio(e["nome"], e["categoria"], e["avaliacoes"], e["estrelas"]))
            f.write("\n" + "-"*70 + "\n\n")
    print(f"✅ WhatsApp: {WPP_TXT}")

    # ── 4. Ligações ──────────────────────────────────────────────────────────
    with open(LIGACOES_TXT, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — LISTA DE LIGAÇÕES (números fixos)\n")
        f.write("="*70 + "\n\n")
        f.write("⚠️  GUIÃO RÁPIDO PARA A LIGAÇÃO:\n\n")
        f.write('  "Bom dia, falo com [nome do responsável]? O meu nome é Lucas,\n')
        f.write('   sou do Studio 085, um estúdio audiovisual no Porto.\n')
        f.write('   Encontrei o vosso negócio no Google Maps com excelentes avaliações\n')
        f.write('   e queria partilhar uma proposta — criamos sites profissionais\n')
        f.write('   para negócios do Porto 150€ de criação e 50€/mês de manutenção.\n')
        f.write('   Tem um minutinho para eu explicar?"\n\n')
        f.write("="*70 + "\n\n")
        for i, e in enumerate(call_list, 1):
            f.write(f"[{i}] {e['nome'].upper()}\n")
            f.write(f"    📞 {e['telefone']}\n")
            f.write(f"    {CATEGORIA_PT.get(e['categoria'], e['categoria'])} | {int(e['avaliacoes'])} avaliações {e['estrelas']}⭐\n")
            f.write(f"    Morada: {e['morada']}\n")
            f.write(f"    Maps: {e['gmaps']}\n\n")
        if sem_tel:
            f.write("\n" + "="*70 + "\n")
            f.write("SEM CONTACTO (tentar encontrar manualmente no Maps)\n")
            f.write("="*70 + "\n\n")
            for e in sem_tel:
                f.write(f"  • {e['nome']} | {e['gmaps']}\n")
    print(f"✅ Ligações: {LIGACOES_TXT}")

    # ── 5. Resumo ────────────────────────────────────────────────────────────
    with open(RESUMO_TXT, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — PLANO DE PROSPECÇÃO | PORTO\n")
        f.write("="*70 + "\n\n")
        f.write(f"TOTAL DE EMPRESAS: {len(empresas)}\n\n")
        f.write(f"  📱 WhatsApp (número móvel 9xx): {len(wpp_list)} empresas\n")
        f.write(f"  📞 Ligação (número fixo 2xx):   {len(call_list)} empresas\n")
        f.write(f"  ❓ Sem contacto:                {len(sem_tel)} empresas\n\n")
        f.write("ORDEM DE ATAQUE:\n")
        f.write("  1. Pesquisar email de cada empresa no Google antes de enviar\n")
        f.write("  2. Enviar EMAIL (mais formal, melhor taxa de conversão B2B)\n")
        f.write("  3. Se sem resposta em 7 dias → WhatsApp (números 9xx)\n")
        f.write("  4. Se sem resposta → Ligação telefónica\n\n")
        f.write("TOP 10 EMPRESAS (por score):\n")
        for i, e in enumerate(empresas[:10], 1):
            f.write(f"  {i}. {e['nome']} | {int(e['avaliacoes'])} av. {e['estrelas']}⭐ | {e['canal']} {e['telefone']}\n")
        f.write("\nFICHEIROS:\n")
        f.write(f"  📊 Planilha tracking:  prospeccao/Studio_085_Plano_Prospeccao.xlsx\n")
        f.write(f"  📧 Emails prontos:     emails/gerados/01_emails_prontos.txt\n")
        f.write(f"  📱 WhatsApp prontos:   emails/gerados/02_whatsapp_prontos.txt\n")
        f.write(f"  📞 Lista de ligações:  emails/gerados/03_ligacoes_lista.txt\n\n")
        f.write("⚠️  ANTES DE COMEÇAR:\n")
        f.write("  - Actualizar em gerar_plano_completo.py: TEL_STUDIO, INSTAGRAM, EMAIL_STUDIO\n")
        f.write("  - Adicionar link do portfolio nos templates\n")
    print(f"✅ Resumo: {RESUMO_TXT}")
    print(f"\n🎯 {len(empresas)} empresas | {len(wpp_list)} WhatsApp | {len(call_list)} ligações | {len(sem_tel)} sem contacto")


if __name__ == "__main__":
    main()
