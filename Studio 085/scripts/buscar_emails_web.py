"""
Studio 085 — Busca de Emails via Web (Google Search + scraping de páginas)
Para empresas sem site oficial, tenta encontrar emails via:
  1. Google Search: "{nome} Porto email contacto"
  2. Página de resultados do Google (snippets)
  3. Facebook / Instagram (se aparecerem nos resultados)
"""

import requests
import re
import time
import openpyxl
from urllib.parse import quote_plus

INPUT_FILE  = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_FILE = "../prospeccao/Studio_085_Contactos_Completos.xlsx"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
BLOCKED_DOMAINS = {
    "sentry", "wix", "example", "schema", "pixel", "jquery",
    "google", "facebook", "instagram", "twitter", "w3",
    "email", "test", "sample", "noreply", "no-reply",
}


def clean_email(email: str) -> str:
    email = email.strip().lower()
    domain = email.split("@")[1] if "@" in email else ""
    if any(b in domain for b in BLOCKED_DOMAINS):
        return ""
    if len(email) > 80 or "." not in domain:
        return ""
    return email


def search_google_for_email(nome: str, morada: str) -> tuple[str, str]:
    """Devolve (email_encontrado, fonte)."""
    cidade = "Porto"
    queries = [
        f'"{nome}" {cidade} email contacto',
        f'"{nome}" {cidade} site:facebook.com',
        f'"{nome}" {cidade} @gmail.com OR @hotmail.com OR @sapo.pt OR @mail.pt',
    ]
    for q in queries:
        try:
            url = f"https://www.google.com/search?q={quote_plus(q)}&hl=pt-PT&num=5"
            r = requests.get(url, headers=HEADERS, timeout=10)
            emails = [clean_email(e) for e in EMAIL_RE.findall(r.text)]
            emails = [e for e in emails if e]
            if emails:
                return emails[0], f"Google: {q}"
            time.sleep(1.5)
        except Exception:
            time.sleep(2)
    return "", ""


def is_mobile_pt(telefone: str) -> bool:
    """Portugal: móvel começa com 9 (91x, 93x, 96x). WhatsApp existe em números móveis."""
    if not telefone:
        return False
    t = telefone.replace(" ", "").replace("+351", "").replace("351", "")
    return t.startswith("9")


def canal_contacto(email: str, telefone: str) -> str:
    if email:
        return "📧 Email"
    if is_mobile_pt(telefone):
        return "📱 WhatsApp"
    if telefone:
        return "📞 Ligação"
    return "❓ Sem contacto"


def main():
    wb_in = openpyxl.load_workbook(INPUT_FILE)
    ws_in = wb_in["Empresas"]
    rows = list(ws_in.iter_rows(values_only=True))

    wb_out = openpyxl.Workbook()
    ws_out = wb_out.active
    ws_out.title = "Contactos"

    header = [
        "Prioridade", "Nome", "Categoria", "Morada", "Telefone",
        "Avaliações", "Estrelas", "Canal Contacto",
        "Email Encontrado", "Fonte Email",
        "Google Maps", "Estado", "Email Enviado", "Resposta", "Notas"
    ]
    ws_out.append(header)

    total = len(rows) - 1
    resultados = []

    for i, row in enumerate(rows[1:], 1):
        nome      = row[0] or ""
        categoria = row[1] or ""
        morada    = row[2] or ""
        telefone  = str(row[3] or "").strip()
        avaliacoes= row[4] or 0
        estrelas  = row[5] or 0
        gmaps     = row[7] or ""

        print(f"[{i}/{total}] {nome} ...", end=" ", flush=True)

        email_encontrado, fonte = search_google_for_email(nome, morada)
        canal = canal_contacto(email_encontrado, telefone)

        # Prioridade: mais avaliações + mais estrelas
        prioridade = round((avaliacoes or 0) * (estrelas or 0))

        print(f"{canal} | email={email_encontrado or '-'}")

        resultados.append({
            "prioridade": prioridade,
            "nome": nome,
            "categoria": categoria,
            "morada": morada,
            "telefone": telefone,
            "avaliacoes": avaliacoes,
            "estrelas": estrelas,
            "canal": canal,
            "email": email_encontrado,
            "fonte": fonte,
            "gmaps": gmaps,
        })

        time.sleep(1)

    # Ordena por prioridade decrescente
    resultados.sort(key=lambda x: x["prioridade"], reverse=True)

    for idx, r in enumerate(resultados, 1):
        ws_out.append([
            idx,
            r["nome"], r["categoria"], r["morada"], r["telefone"],
            r["avaliacoes"], r["estrelas"], r["canal"],
            r["email"], r["fonte"], r["gmaps"],
            "Por contactar", "Não", "", ""
        ])

    wb_out.save(OUTPUT_FILE)
    print(f"\n✅ Ficheiro salvo: {OUTPUT_FILE}")

    # Resumo
    canais = {}
    for r in resultados:
        canais[r["canal"]] = canais.get(r["canal"], 0) + 1
    print("\nRESUMO POR CANAL:")
    for c, n in sorted(canais.items(), key=lambda x: -x[1]):
        print(f"  {c}: {n} empresas")


if __name__ == "__main__":
    main()
