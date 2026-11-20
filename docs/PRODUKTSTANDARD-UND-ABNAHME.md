# ElektroPlan SM 1 — Produktstandard und Abnahmekriterien

Ziel: professionelles, mobil bedienbares Elektroplanungswerkzeug mit überprüfbaren Funktionen. Der aktuelle Prototyp ist **kein** Ersatz für geprüfte Elektro-CAD-Systeme oder Fachplanung.

## Priorität A — belastbarer Schaltplan
- Normgerechte Symbolbibliothek (IEC 60617, Nutzungsrechte und Symboltreue separat prüfen).
- Anschlusspunkte statt bloßer Rechteck-zu-Rechteck-Linien; Leiter und Knoten explizit modellieren.
- Raster, Fangpunkte, Zoom/Pan, Touch-Gesten, Undo/Redo, Mehrfachauswahl.
- Referenzkennzeichen, Bauteilwerte, Leitungsnummern, Stromkreise, Seiten und Querverweise.
- ERC: offene Verbindungen, doppelte Kennzeichen, unzulässige Verbindungen, fehlende Pflichtdaten.
- Versionsfähiges Projektformat mit Migration, Importvalidierung, Export SVG/PDF und Druck.

## Priorität B — Bauteilkatalog und Dokumente
- Hersteller und exakte Artikelnummer; sichere Suche ohne Markenverwechslung.
- Herkunft, Dokumentversion, Abruf-/Prüfdatum, Prüfer und Verifikationsstatus.
- Keine Anschlussbelegung aus Foto oder Modellähnlichkeit ableiten.
- Datenblatt-Verknüpfung, lokale Kataloge und Stückliste.

## Priorität C — mobile Aufnahme
- iPhone/iPad/Android-Kamera, Dateiauswahl, Bildvorschau.
- Optische Erkennung nur mit expliziter Fehleranzeige, menschlicher Bestätigung und Testdaten; im Prototyp derzeit **nicht vorhanden**.
- Offline-/Datenschutzkonzept, keine unbemerkten Uploads.

## Priorität D — Qualität und Release
- Automatisierte Unit-, Integrations- und End-to-End-Tests.
- Tests für Drag & Drop, Touch, Speichern/Neuladen, Import, Export, beschädigte Dateien, große Projekte.
- Realtests auf iPhone Safari und Android Tablet; reproduzierbare Testprotokolle.
- Backup von main und funktionierender Kameraversion unverändert halten.
- Keine Produktionsfreigabe ohne dokumentierte Abnahme der Sicherheits-/Normfragen.

## Aktueller Status am 20.11.2026
Integrierter HTML-Prototyp unter `prototypes/ElektroPlan-SM-integriert.html`: Grundsymbole, schematische Linien, lokale Speicherung, JSON-/SVG-/PNG-Export, Bauteilliste, Fotoauswahl. **Nicht fertig:** normgerechter Editor, elektrische Prüfungen, automatische Erkennung, umfassende Tests und Produktfreigabe.

Diese Datei ist die Qualitätsmesslatte; Funktionen gelten erst als abgeschlossen, wenn implementiert und getestet.
