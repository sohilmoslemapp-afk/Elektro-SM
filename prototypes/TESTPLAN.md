# ElektroPlan SM – Prototyp-Testplan V1

Stand: 2026-11-19

## Status
- Der produktive `index.html` auf `main` bleibt unverändert.
- Die Entwicklungsseiten liegen ausschließlich auf `development/component-recognition-v1`.
- GitHub-Dateien wurden gespeichert; Browser- und Gerätetests sind **noch nicht durchgeführt**.
- Keine automatische KI-Erkennung, keine Herstellerdatenblatt-Validierung, keine Verdrahtungsfreigabe.

## Testumgebung
Testen auf iPhone Safari, Android Chrome und Desktop Chrome/Edge/Firefox. Bei Kameraauswahl kann das Verhalten je nach Browser/Gerät abweichen.

## Testfälle
| ID | Seite | Test | Erwartung |
|---|---|---|---|
| 01 | prototypes/index.html | Drei Navigationslinks öffnen | Alle drei Prototypen erreichbar, wenn aus derselben Verzeichnisstruktur bereitgestellt |
| 02 | component-capture-v1.html | Bild auswählen | Bildvorschau erscheint |
| 03 | component-capture-v1.html | Ohne Eingaben prüfen | Fehlende Pflichtfelder werden angezeigt |
| 04 | component-capture-v1.html | Hersteller, Modell, Typ eingeben | Meldung bleibt NICHT VERIFIZIERT |
| 05 | manufacturer-verification-v2.html | Ungültigen Link öffnen | Link wird nicht geöffnet, Fehler erscheint |
| 06 | manufacturer-verification-v2.html | Pflichtfelder fehlen | Status bleibt UNVOLLSTÄNDIG |
| 07 | manufacturer-verification-v2.html | Alle Felder und Checkboxen | Nur MANUELL dokumentiert; KEINE technische Freigabe |
| 08 | manufacturer-verification-v2.html | JSON exportieren | Datei enthält technicalApproval:false und automaticRecognition:false |
| 09 | plan-draft-v3.html | V2-JSON importieren | Bauteil erscheint in Liste und unverknüpfter Übersicht |
| 10 | plan-draft-v3.html | Falsche JSON-Datei | Fehler ohne Absturz |
| 11 | plan-draft-v3.html | Bauteil entfernen | Liste und Übersicht aktualisieren sich |
| 12 | plan-draft-v3.html | Entwurf exportieren | JSON enthält hasElectricalConnections:false |
| 13 | Alle | Kleine Displays / Touch | Texte und Schaltflächen bedienbar |
| 14 | Alle | Offline / ohne Server | Keine externe Übertragung der erfassten Bilder oder JSON-Dateien |
| 15 | main/index.html | Unverändert | Ursprünglicher Kamera-Test 4 weiterhin vorhanden |

## Bekannte Einschränkungen
- V1 und V2 tauschen derzeit keine Daten automatisch aus; Daten müssen in V2 erneut eingetragen werden.
- Der V2-Quellenlink wird nur auf HTTPS-Format geprüft, **nicht** auf offizielle Herkunft, Authentizität oder Dokumentinhalt.
- V3 importiert nur das erwartete JSON-Schema; Daten werden nicht kryptografisch signiert.
- SVG-Übersicht in V3 enthält **keine** Leitungen, Schalterverbindungen oder Anschlussanweisungen.
- Ohne öffentliches Hosting der Entwicklungsdateien gibt es keinen verifizierten Live-App-Link für den Entwicklungszweig.
- Kein belastbarer Nachweis für iOS-, Android- oder Desktop-Funktion ohne manuelle Geräte- und Browsertests.

## Release-Kriterien
1. Alle Testfälle auf drei Geräteklassen bestanden.
2. Getrennte Testumgebung eingerichtet, ohne `main/index.html` zu überschreiben.
3. Herstellerquellenprüfung und sicherheitskritische Freigaberegeln vor echter Verdrahtungsfunktion fachlich überprüft.
4. Erst danach kontrollierte Veröffentlichung.
