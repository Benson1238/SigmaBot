# SigmaBot

Ein modular aufgebauter Discord-Bot auf Basis von `discord.py` (v2), der Slash-Commands, Willkommensnachrichten und ein zentrales Logging-System bereitstellt.

## Features
- Slash-Command `/ping` antwortet mit "Pong!".
- Willkommensnachrichten bei Join-Events in einem definierten Kanal.
- Umfassendes Logging für Start, Fehler und Join/Leave in `logs/bot.log` und die Konsole.
- Automatisches Laden aller Cogs in `cogs/` beim Start.
- Konfiguration per `.env` ohne hardcodierte Secrets.

## Projektstruktur
```
project/
├─ bot.py
├─ cogs/
│  ├─ ping.py
│  ├─ welcome.py
│  └─ logger.py
├─ utils/
│  └─ config_loader.py
├─ logs/
│  └─ bot.log (wird automatisch erstellt)
├─ requirements.txt
├─ .env.example
└─ README.md
```

## Voraussetzungen
- Python 3.10 oder neuer
- Ein Discord-Bot-Token und eine Channel-ID für den Willkommens-Channel

## Installation
1. Repository klonen und in das Projektverzeichnis wechseln.
2. Abhängigkeiten installieren:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. `.env` anlegen (siehe `.env.example`):
   ```bash
   cp .env.example .env
   # Trage BOT_TOKEN, WELCOME_CHANNEL_ID und ggf. LOG_LEVEL ein
   ```

## Start
```bash
python bot.py
```
Beim Start gibt der Bot eine klare Konsolenmeldung aus (`✅ Bot ready as ...`).

## Slash-Command testen
- Auf dem Discord-Server `/ping` ausführen. Der Bot antwortet mit "Pong!" als ephemere Nachricht.

## Logging
- Alle wichtigen Ereignisse werden in `logs/bot.log` sowie in der Konsole ausgegeben.
- Die Log-Datei wird bei Bedarf automatisch angelegt.

## Fehlerbehandlung & Stabilität
- Ungültige oder fehlende Umgebungsvariablen stoppen den Start mit einer klaren Fehlermeldung.
- Unerwartete Fehler in Commands oder Events werden geloggt und der Nutzer erhält eine freundliche Rückmeldung.

## Hinweise
- Hinterlege den Bot-Token ausschließlich in der `.env` oder per Umgebung, niemals im Code.
- Passe die Intents und Berechtigungen in Discord an, damit Join-Events und Slash-Commands funktionieren.
