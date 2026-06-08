"""
Studio 085 - Buscador de Emails e Contatos via Google Maps API
Usa a API do Google Places para enriquecer a lista de empresas com website, telefone e email.
"""

import requests
import openpyxl
import time
import re
import json
from urllib.parse import urlparse

GOOGLE_MAPS_API_KEY = "AIzaSyBaLZi6mZM02kIZJ8fP_nCPKIn1JZrEBPA"
INPUT_FILE = "../prospeccao/Studio_085___Prospec_o_Porto.xlsx"
OUTPUT_FILE = "../prospeccao/Studio_085_Prospeccao_Enriquecida.xlsx"


def get_place_details(place_id: str) -> dict:
    """Busca detalhes completos de um lugar via Place Details API."""
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,formatted_phone_number,international_phone_number,website,formatted_address,rating,user_ratings_total,opening_hours",
        "key": GOOGLE_MAPS_API_KEY,
        "language": "pt-PT",
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if data.get("status") == "OK":
        return data.get("result", {})
    return {}


def extract_email_from_website(website_url: str) -> str:
    """Tenta encontrar email no site da empresa."""
    if not website_url:
        return ""
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(website_url, headers=headers, timeout=8)
        emails = re.findall(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", resp.text)
        # Filtra emails genéricos/scripts
        blocked = {"example", "sentry", "wix", "schema", "pixel", "jquery"}
        for email in emails:
            domain = email.split("@")[1].lower()
            if not any(b in domain for b in blocked):
                return email
    except Exception:
        pass
    return ""


def load_workbook_data(filepath: str):
    wb = openpyxl.load_workbook(filepath)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    return wb, ws, rows


def enrich_companies():
    print("Carregando planilha...")
    wb_in = openpyxl.load_workbook(INPUT_FILE)
    ws_in = wb_in["Empresas"]
    rows = list(ws_in.iter_rows(values_only=True))

    # Cria novo workbook de saída
    wb_out = openpyxl.Workbook()
    ws_out = wb_out.active
    ws_out.title = "Empresas Enriquecidas"

    # Header
    header = list(rows[0]) + ["Email", "Website Real", "Telefone Internacional"]
    ws_out.append(header)

    total = len(rows) - 1
    for i, row in enumerate(rows[1:], 1):
        nome = row[0]
        place_id = row[12]  # coluna Place ID

        print(f"[{i}/{total}] {nome} ...", end=" ")

        email = ""
        website_real = ""
        telefone_intl = ""

        if place_id:
            try:
                details = get_place_details(place_id)
                website_real = details.get("website", "")
                telefone_intl = details.get("international_phone_number", "") or details.get("formatted_phone_number", "")

                if website_real and website_real != row[6]:
                    print(f"tem website: {website_real}", end=" ")
                    email = extract_email_from_website(website_real)
                else:
                    # Sem site confirmado — tenta email pelo telefone/nome (manual)
                    pass

                time.sleep(0.15)  # respeita rate limit
            except Exception as e:
                print(f"ERRO: {e}", end=" ")

        new_row = list(row) + [email, website_real, telefone_intl]
        ws_out.append(new_row)
        print(f"email={email or '-'}")

    wb_out.save(OUTPUT_FILE)
    print(f"\nFicheiro salvo: {OUTPUT_FILE}")
    print(f"Total processado: {total} empresas")


if __name__ == "__main__":
    enrich_companies()
