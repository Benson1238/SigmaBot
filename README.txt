# Codex Discord Bot Projekt – Aufgabenbeschreibung

## Ziel
Erstelle einen vollständig funktionsfähigen Discord-Bot in Python, basierend auf `discord.py`.  
Der Bot soll modular aufgebaut sein, gut strukturiert, leicht erweiterbar und stabil laufen.

Bitte beachte die folgenden Anforderungen, die Projektstruktur und Arbeitsweise.

---

## Anforderungen an den Bot

### Grundfunktionen
1. Der Bot soll beim Start eine Konsolenmeldung ausgeben: "Bot ist online".
2. Der Bot soll folgende Funktionen enthalten:
   - Slash-Command `/ping` → Antwort: "Pong!"
   - Event: Wenn ein User den Server betritt, soll eine Willkommensnachricht in einem definierten Kanal gesendet werden.
   - Event: Logge Join/Leave-Aktionen in eine lokale Datei (`logs/bot.log`).
3. Der Bot soll Fehler automatisch erkennen und in der Konsole anzeigen.

---

## Code-Struktur (Bitte genau so anlegen)

