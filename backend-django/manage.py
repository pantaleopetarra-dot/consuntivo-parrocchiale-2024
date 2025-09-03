#!/usr/bin/env python
"""
Django's command-line utility for administrative tasks.
Questo file è il punto di ingresso per tutti i comandi di gestione del progetto.
"""
import os
import sys


def main():
    """Run administrative tasks."""
    # Imposta il modulo delle impostazioni predefinite
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consuntivo.settings')

    try:
        # Prova a importare execute_from_command_line di Django
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Impossibile importare Django. Assicurati che sia installato "
            "e disponibile nella tua variabile PYTHONPATH. Se hai attivato "
            "un ambiente virtuale, assicurati di averlo attivato."
        ) from exc

    # Esegue il comando passato da riga di comando (es: runserver, migrate)
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()