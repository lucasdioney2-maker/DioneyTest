"""
Studio 085 — Buscador de Emails por Empresa
Estratégias por ordem:
  1. Google Places API (website oficial)
  2. Extrai email do website encontrado
  3. Pesquisa Google: "{nome} Porto email"
  4. Pesquisa Facebook: "{nome} Porto site:facebook.com"
Gera dois ficheiros:
  - COM_EMAIL.txt  → enviar email amanhã
  - SEM_EMAIL.txt  → ligar / WhatsApp
"""

import requests
import re
import time
import openpyxl
from urllib.parse import quote_plus
from pathlib import Path

INPUT_FILE   = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_DIR   = Path("../prospeccao")
COM_EMAIL    = OUTPUT_DIR / "LISTA_COM_EMAIL.txt"
SEM_EMAIL    = OUTPUT_DIR / "LISTA_SEM_EMAIL.txt"
RESUMO       = OUTPUT_DIR / "LISTA_EMAILS_RESUMO.txt"

GMAPS_KEY = "AIzaSyBaLZi6mZM02kIZJ8fP_nCPKIn1JZrEBPA"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "pt-PT,pt;q=0.9",
}

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}")
BLOCKED  = {"sentry","wix","example","schema","pixel","jquery","google","facebook",
            "instagram","twitter","w3","noreply","no-reply","test","sample",
            "email","mail.","cloudflare","amazonaws","wordpress","squarespace"}

def clean_email(email):
    email = email.strip().lower()
    domain = email.split("@")[-1]
    if any(b in domain for b in BLOCKED): return ""
    if len(email) > 80 or email.count("@") != 1: return ""
    if not re.match(r"^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$", email): return ""
    return email

def extract_emails_from_html(html):
    found = [clean_email(e) for e in EMAIL_RE.findall(html)]
    return [e for e in found if e]

def get_place_website(place_id):
    """Busca website via Google Places API."""
    try:
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        r = requests.get(url, params={
            "place_id": place_id,
            "fields": "website,formatted_phone_number",
            "key": GMAPS_KEY,
            "language": "pt-PT",
        }, timeout=8)
        result = r.json().get("result", {})
        return result.get("website",""), result.get("formatted_phone_number","")
    except Exception:
        return "", ""

def extract_email_from_url(url):
    """Acede a um URL e tenta extrair email."""
    if not url: return ""
    try:
        r = requests.get(url, headers=HEADERS, timeout=8)
        emails = extract_emails_from_html(r.text)
        return emails[0] if emails else ""
    except Exception:
        return ""

def search_web_email(nome, cidade="Porto"):
    """Pesquisa Google por email da empresa."""
    queries = [
        f'"{nome}" {cidade} email contacto',
        f'"{nome}" {cidade} @gmail.com OR @hotmail.com OR @sapo.pt',
        f'"{nome}" {cidade} site:facebook.com email',
    ]
    for q in queries:
        try:
            url = f"https://www.google.com/search?q={quote_plus(q)}&hl=pt-PT&num=5"
            r = requests.get(url, headers=HEADERS, timeout=10)
            emails = extract_emails_from_html(r.text)
            if emails:
                return emails[0], f"Google: {q[:60]}"
            time.sleep(1.2)
        except Exception:
            time.sleep(2)
    return "", ""

def is_mobile(tel):
    if not tel: return False
    t = str(tel).replace(" ","").replace("+351","").replace("351","")
    return t.startswith("9")

def main():
    wb = openpyxl.load_workbook(INPUT_FILE)
    ws = wb["Empresas"]
    rows = list(ws.iter_rows(values_only=True))[1:]
    rows.sort(key=lambda r: (r[4] or 0)*(r[5] or 0), reverse=True)

    com_email    = []
    sem_email_wpp = []
    sem_email_tel = []
    sem_contacto  = []

    total = len(rows)
    for i, row in enumerate(rows, 1):
        nome      = row[0] or ""
        categoria = row[1] or ""
        morada    = row[2] or ""
        telefone  = str(row[3] or "").strip()
        aval      = int(row[4] or 0)
        est       = row[5] or 0
        gmaps     = row[7] or ""
        place_id  = row[12] or ""

        print(f"[{i}/{total}] {nome} ...", end=" ", flush=True)

        email    = ""
        fonte    = ""
        website  = ""

        # 1. Google Maps API → website
        if place_id:
            website, tel_maps = get_place_website(place_id)
            if website:
                email = extract_email_from_url(website)
                if email: fonte = f"Site ({website[:40]})"

        # 2. Pesquisa web se ainda sem email
        if not email:
            cidade = "Gaia" if "Gaia" in morada else "Porto"
            email, fonte = search_web_email(nome, cidade)

        # 3. Tenta página de contacto do website
        if not email and website:
            for slug in ["/contacto", "/contactos", "/contact", "/sobre"]:
                email = extract_email_from_url(website.rstrip("/") + slug)
                if email:
                    fonte = f"Site{slug}"
                    break

        print(f"{'✅ ' + email if email else '❌ sem email'} | tel={telefone or '-'}")

        entry = {
            "nome": nome, "categoria": categoria, "morada": morada,
            "telefone": telefone, "aval": aval, "est": est,
            "gmaps": gmaps, "email": email, "fonte": fonte, "website": website,
        }

        if email:
            com_email.append(entry)
        elif is_mobile(telefone):
            sem_email_wpp.append(entry)
        elif telefone:
            sem_email_tel.append(entry)
        else:
            sem_contacto.append(entry)

        time.sleep(0.8)

    # ── Ficheiro COM EMAIL ────────────────────────────────────────────────────
    with open(COM_EMAIL, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — EMPRESAS COM EMAIL ENCONTRADO\n")
        f.write(f"Total: {len(com_email)} empresas\n")
        f.write("="*70 + "\n\n")
        f.write("ORDEM DE ENVIO (por prioridade):\n\n")
        for idx, e in enumerate(com_email, 1):
            f.write(f"[{idx}] {e['nome']}\n")
            f.write(f"    📧 {e['email']}\n")
            f.write(f"    📍 {e['morada']}\n")
            f.write(f"    ⭐ {e['aval']} avaliações | {e['est']}⭐\n")
            f.write(f"    🔍 Fonte: {e['fonte']}\n")
            f.write(f"    🗺️  {e['gmaps']}\n\n")

    # ── Ficheiro SEM EMAIL ────────────────────────────────────────────────────
    with open(SEM_EMAIL, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — EMPRESAS SEM EMAIL (ligar / WhatsApp)\n")
        f.write("="*70 + "\n\n")

        if sem_email_wpp:
            f.write(f"📱 WHATSAPP ({len(sem_email_wpp)} empresas — número móvel 9xx)\n")
            f.write("-"*50 + "\n")
            for e in sem_email_wpp:
                f.write(f"  • {e['nome']} | 📱 {e['telefone']} | {e['aval']} av. {e['est']}⭐\n")
                f.write(f"    {e['gmaps']}\n\n")

        f.write(f"\n📞 LIGAÇÃO ({len(sem_email_tel)} empresas — número fixo 2xx)\n")
        f.write("-"*50 + "\n")
        for e in sem_email_tel:
            f.write(f"  • {e['nome']} | 📞 {e['telefone']} | {e['aval']} av. {e['est']}⭐\n")
            f.write(f"    {e['gmaps']}\n\n")

        if sem_contacto:
            f.write(f"\n❓ SEM CONTACTO ({len(sem_contacto)} empresas)\n")
            f.write("-"*50 + "\n")
            for e in sem_contacto:
                f.write(f"  • {e['nome']} | {e['gmaps']}\n\n")

    # ── Resumo ────────────────────────────────────────────────────────────────
    with open(RESUMO, "w", encoding="utf-8") as f:
        f.write("STUDIO 085 — RESUMO DE CONTACTOS\n")
        f.write("="*70 + "\n\n")
        f.write(f"📧 Com email encontrado:    {len(com_email):>3} empresas → enviar email amanhã\n")
        f.write(f"📱 WhatsApp (sem email):    {len(sem_email_wpp):>3} empresas → mensagem após emails\n")
        f.write(f"📞 Ligação (sem email):     {len(sem_email_tel):>3} empresas → ligar após emails\n")
        f.write(f"❓ Sem contacto:            {len(sem_contacto):>3} empresas → pesquisa manual\n")
        f.write(f"{'─'*40}\n")
        f.write(f"   TOTAL:                  {total:>3} empresas\n\n")
        f.write("PLANO:\n")
        f.write("  1. Amanhã 8h30 → enviar emails (LISTA_COM_EMAIL.txt)\n")
        f.write("  2. Sem resposta em 7 dias → WhatsApp e ligações (LISTA_SEM_EMAIL.txt)\n")
        f.write("  3. Empresas sem contacto → pesquisa manual no Maps/Facebook\n")

    print(f"\n{'='*60}")
    print(f"✅ COM EMAIL:    {len(com_email)} empresas → {COM_EMAIL.name}")
    print(f"✅ SEM EMAIL:    {len(sem_email_wpp)+len(sem_email_tel)+len(sem_contacto)} empresas → {SEM_EMAIL.name}")
    print(f"✅ Resumo:       {RESUMO.name}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
