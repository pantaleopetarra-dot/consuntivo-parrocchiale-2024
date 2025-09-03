# bilanci/excel_import.py
import pandas as pd
from io import BytesIO
from .models import BilancioConsuntivo, Entrata, Uscita
from django.core.exceptions import ValidationError

def importa_da_excel(bilancio, file):
    """
    Importa entrate e uscite da un file Excel conforme al modello diocesano.
    """
    messages = []

    # Carica il file in memoria
    try:
        buffer = BytesIO(file.read())
    except Exception as e:
        raise Exception(f"Errore nella lettura del file: {str(e)}")

    # Leggi i fogli ENTRATE e USCITE
    try:
        df_entrate = pd.read_excel(buffer, sheet_name='ENTRATE', skiprows=1)
        df_uscite = pd.read_excel(buffer, sheet_name='USCITE', skiprows=1)
    except Exception as e:
        raise Exception(f"Errore lettura fogli Excel: {str(e)}. Assicurati che il file abbia i fogli 'ENTRATE' e 'USCITE'.")

    # Importa entrate
    if 'Codice*' in df_entrate.columns:
        df_entrate = df_entrate.dropna(subset=['Codice*'])
        for idx, row in df_entrate.iterrows():
            try:
                # Pulizia dati
                giorno = row.get('Giorno', None)
                if pd.isna(giorno) or giorno == '':
                    giorno = None
                else:
                    giorno = int(giorno)

                mese = int(row['Mese'])
                codice = str(row['Codice*']).strip()
                causale1 = str(row['Causale 1']) if pd.notna(row['Causale 1']) else ''
                causale2 = str(row['Causale 2']) if pd.notna(row['Causale 2']) else ''
                causale3 = str(row['Causale 3']) if pd.notna(row['Causale 3']) else ''
                importo = float(row['Importo Euro'])

                # Crea l'oggetto Entrata
                entrata = Entrata(
                    bilancio=bilancio,
                    giorno=giorno,
                    mese=mese,
                    codice=codice,
                    causale1=causale1,
                    causale2=causale2,
                    causale3=causale3,
                    importo=importo
                )
                entrata.full_clean()  # Validazione
                entrata.save()
            except ValidationError as ve:
                messages.append(f" riga {idx+2} (ENTRATE): {ve}")
            except Exception as e:
                messages.append(f"Errore riga {idx+2} (ENTRATE): {str(e)}")
        messages.append(f"✅ Importate {len(df_entrate)} entrate.")
    else:
        messages.append("❌ Foglio 'ENTRATE': colonna 'Codice*' non trovata.")

    # Importa uscite
    if 'Codice*' in df_uscite.columns:
        df_uscite = df_uscite.dropna(subset=['Codice*'])
        for idx, row in df_uscite.iterrows():
            try:
                giorno = row.get('Giorno', None)
                if pd.isna(giorno) or giorno == '':
                    giorno = None
                else:
                    giorno = int(giorno)

                mese = int(row['Mese'])
                codice = str(row['Codice*']).strip()
                causale1 = str(row['Causale 1']) if pd.notna(row['Causale 1']) else ''
                causale2 = str(row['Causale 2']) if pd.notna(row['Causale 2']) else ''
                causale3 = str(row['Causale 3']) if pd.notna(row['Causale 3']) else ''
                importo = float(row['Importo Euro'])

                uscita = Uscita(
                    bilancio=bilancio,
                    giorno=giorno,
                    mese=mese,
                    codice=codice,
                    causale1=causale1,
                    causale2=causale2,
                    causale3=causale3,
                    importo=importo
                )
                uscita.full_clean()
                uscita.save()
            except ValidationError as ve:
                messages.append(f" riga {idx+2} (USCITE): {ve}")
            except Exception as e:
                messages.append(f"Errore riga {idx+2} (USCITE): {str(e)}")
        messages.append(f"✅ Importate {len(df_uscite)} uscite.")
    else:
        messages.append("❌ Foglio 'USCITE': colonna 'Codice*' non trovata.")

    return messages