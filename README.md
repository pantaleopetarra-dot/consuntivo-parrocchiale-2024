# 🏛️ Sistema Consuntivo Parrocchiale 2024

Sistema web per la gestione del **consuntivo parrocchiale** dell'Arcidiocesi di Torino, conforme ai decreti **Prot. 34/D/13** e **Prot. 35/D/13**.

Basato sul file originale `CONSUNTIVO-PARROCCHIALE-PRIMA-NOTA-2024_ok.xlsx`.

---

## 🚀 Funzionalità

- 🔐 Login con credenziali (parrocchia / ufficio diocesano)
- 📥 Inserimento manuale della prima nota (entrate/uscite)
- 📤 **Importazione da Excel** (formato identico al modello)
- 💾 Esportazione in Excel
- 📊 Dashboard centralizzata per l’Ufficio Economato
- 📧 Notifiche email automatiche all’invio del bilancio
- 📅 Supporto multi-anno (2023, 2024, 2025)
- ✅ Validazione codici contabili (es. 11, A, B)
- 🧮 Calcolo automatico contributi diocesani (2% e 10%)

---

## 🛠️ Tecnologie

- **Backend**: Python + Django + Django REST Framework
- **Frontend**: React.js
- **Database**: SQLite (o PostgreSQL in produzione)
- **Esportazione**: openpyxl
- **Email**: SMTP (Gmail, SendGrid, ecc.)

---

## 📥 Installazione

### 1. Clona il repository
```bash
git clone https://github.com/consuntivo-parrocchiale/consuntivo-parrocchiale-2024.git
cd consuntivo-parrocchiale-2024