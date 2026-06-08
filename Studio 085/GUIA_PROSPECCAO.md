# Studio 085 — Guia de Prospecção de Sites para Empresas do Porto

## O QUE TEMOS
- **52 empresas** do Porto sem site mas com boas avaliações no Google Maps
- Restaurantes, cafés, cabeleireiros, bares, clínicas, lojas, ginásios

---

## PASSO A PASSO

### 1. Copiar a planilha para esta pasta
Coloca o ficheiro `Studio_085___Prospec_o_Porto.xlsx` em:
```
Studio 085/prospeccao/
```

### 2. Buscar emails e enriquecer dados
```bash
cd scripts
pip install requests openpyxl
python buscar_emails_gmaps.py
```
Isso vai:
- Confirmar se cada empresa ainda não tem site
- Tentar extrair o email do site (se tiver)
- Guardar tudo em `prospeccao/Studio_085_Prospeccao_Enriquecida.xlsx`

### 3. Gerar os emails e mensagens WhatsApp
```bash
python gerar_emails_personalizados.py
```
Gera ficheiros em `emails/gerados/`:
- `todos_os_emails.txt` — emails formatados para copiar e enviar
- `mensagens_whatsapp.txt` — textos curtos para WhatsApp/SMS
- `empresas_prioritarias.txt` — empresas com +200 avaliações e +4.3⭐ (começa por estas)

### 4. Enviar e registar
Na planilha, após enviar, atualiza:
- **Estado** → "Contactado"
- **Email enviado** → "Sim"
- **Resposta** → (quando responderem)
- **Notas** → qualquer info relevante

---

## EMPRESAS PRIORITÁRIAS (começar aqui)
As que têm mais avaliações e melhores estrelas — maior probabilidade de interesse:

| Nome | Categoria | Avaliações | Estrelas |
|------|-----------|------------|---------|
| Oporto Confeitaria | Padaria | 2295 | 4.6 |
| Novo Rumo | Café | 2095 | 4.2 |
| Bella Roma - Porto | Café | 1676 | 4.4 |
| Neta 3 - Padaria | Padaria | 1206 | 4.5 |
| Maximus - Confectionery | Café | 1208 | 4.3 |
| Bali-Hai Polynesian Bar | Bar | 968 | 4.6 |
| Confeitaria São Domingos | Padaria | 961 | 4.6 |
| Restaurante Japonês BURI | Restaurante | 865 | 4.4 |
| Mariscaria Bom Sucesso | Restaurante | 861 | 4.4 |

---

## ESTRATÉGIA DE CONTACTO

**Ordem recomendada:**
1. Email (mais formal, fácil de responder quando têm tempo)
2. WhatsApp (mais direto, maior taxa de resposta em Portugal)
3. Ligação telefónica (só se não houve resposta após 7 dias)

**Timing ideal:**
- 2ª a 5ª feira
- 10h-12h ou 14h-16h (fora das horas de ponta do negócio)

**Follow-up:**
- Aguardar 7 dias → enviar follow-up template 3
- Aguardar mais 7 dias → tentar WhatsApp
- Sem resposta → marcar como "Sem resposta" na planilha

---

## PROPOSTA DE VALOR (o que comunicar)

✅ **Site a preço de custo** — só pagam hospedagem + plataforma (~5-10€/mês)
📸 **Fotografia e vídeo** profissional do negócio
📱 **Conteúdo para Instagram e site** — alimentado pelo Studio 085
🔮 **Escalável** — no futuro, podem precisar de área de cliente, reservas, loja online

**O nosso modelo:**
> "Damos o site quase de graça porque queremos ser o vosso parceiro de conteúdo a longo prazo."

---

## ESTRUTURA DE PREÇOS A APRESENTAR

| Serviço | Custo para o cliente |
|---------|---------------------|
| Criação do site | 0€ (nós absorvemos) |
| Hospedagem + domínio | ~10-15€/mês (custo real) |
| Pack Foto/Vídeo mensal | A negociar (proposta Studio 085) |
| Pack Gestão Instagram | A negociar (proposta Studio 085) |

---

## FICHEIROS NESTA PASTA

```
Studio 085/
├── prospeccao/
│   ├── Studio_085___Prospec_o_Porto.xlsx  ← Lista original (colocar aqui)
│   └── Studio_085_Prospeccao_Enriquecida.xlsx  ← Gerado pelo script
├── emails/
│   ├── template_email_prospeccao.md  ← Templates de email
│   └── gerados/
│       ├── todos_os_emails.txt
│       ├── mensagens_whatsapp.txt
│       └── empresas_prioritarias.txt
└── scripts/
    ├── buscar_emails_gmaps.py  ← Enriquece dados via Google Maps API
    └── gerar_emails_personalizados.py  ← Gera os emails prontos
```
