# ElektroPlan SM – V132 Prüfplan

Stand: 2026-11-20. Prüfgegenstand: `prototypes/V132-Suchergebnisse-Vergleich.html` auf `ElektroPlan-Entwicklung-1`.

## Erwartete Reihenfolge
1. Hersteller **und** Modell stimmen exakt überein.
2. Modell stimmt exakt überein, Hersteller weicht ab (**keine** Freigabe).
3. Hersteller stimmt überein, Modell stimmt nur teilweise überein.
4. Hersteller stimmt überein, Modell weicht ab.
5. Sonstige teilweise Textübereinstimmung.
6. Keine Übereinstimmung: nicht anzeigen.

## Manuelle Testfälle
| Gesucht | Gespeichert | Erwartung |
| --- | --- | --- |
| ABB / F202 A | ABB / F202 A | Rang 1 |
| abb / f202 a | ABB / F202 A | Rang 1 (Groß-/Kleinschreibung) |
| ABB / F202 A | Hager / F202 A | Rang 2, Herstellerabweichung |
| ABB / F202 | ABB / F202 A | Rang 3, Modellabweichung |
| ABB / F202 A | ABB / S201 | Rang 4 |
| ABB / F202 A | ABB GmbH / X999 | Rang 5 |
| ABB / F202 A | Siemens / 5SY | Kein Treffer |
| (leer) / F202 A | ABB / F202 A | Eingabefehler |
| ABB / (leer) | ABB / F202 A | Eingabefehler |

## Sicherheitskriterien
- Keine Suchübereinstimmung darf als elektrische Zulassung, geprüfte Klemmenbelegung oder Anschlussanweisung erscheinen.
- Die Anzeige muss explizit auf Herstellerdatenblatt und exakte Modellprüfung hinweisen.
- Lokale Browserdaten sind **keine** herstellerverifizierte Bauteildatenbank.
- Kein automatisches Erkennen anhand eines Fotos behaupten.

## Grenzen
Dies ist ein Prüfplan, kein Nachweis bestandener Browser- oder GitHub-Actions-Tests. Der Prototyp nutzt `localStorage` mit dem Schlüssel `elektroplan-components`. V131 ist noch nicht als konkrete Datei verifiziert; deshalb keine Integration oder Änderung an `main`.
