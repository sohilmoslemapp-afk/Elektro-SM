# ElektroPlan SM 1 — Release-Roadmap und verbindliche Freigabegates

Stand: 20.11.2026. Grundlage: `docs/PRODUKTSTANDARD-UND-ABNAHME.md` und aktueller Repository-Bestand. **Kein Produktionsfreigabestatus.**

## Statusdefinition
- **Prototyp vorhanden**: Funktion demonstrierbar, aber nicht ausreichend für Produktionsfreigabe.
- **Offen**: Nicht nachgewiesen oder nicht implementiert.
- **Freigabe**: Erst nach reproduzierbaren Tests, dokumentierter Prüfung und ausdrücklicher Abnahme.

## P0 — sicherheitskritisch, vor jeder professionellen Verdrahtungsfreigabe
- [ ] Hersteller- und Artikelnummer exakt identifizieren; bei Mehrdeutigkeit keine automatische Auswahl.
- [ ] Original-Herstellerunterlagen mit URL, Dokumentversion, Abrufdatum, Prüfer und Prüfergebnis erfassen.
- [ ] Klemmenbelegung ausschließlich aus überprüfter Quelle übernehmen; Modellähnlichkeit und Fotos niemals als Beweis behandeln.
- [ ] Anschlussinformationen mit Herkunft und Verifikationsstatus bis zu Symbol, Leitung und Export durchreichen.
- [ ] Elektrische Plausibilitätsprüfung (ERC), Anschlussregeln und Warnungen mit dokumentierten Grenzen.
- [ ] Normen-, Haftungs-, Lizenz- und Sicherheitsprüfung durch geeignete Fachleute; keine automatische Freigabe durch KI.

## P1 — professioneller Schaltplaneditor
- [ ] Anschlusspunkte, Knoten und Leiter statt bloßer Symbol-zu-Symbol-Linien.
- [ ] Raster/Snapping, Zoom/Pan, Touch-Gesten, Mehrfachauswahl.
- [ ] IEC-60617-Symbole mit geprüften Nutzungsrechten.
- [ ] Referenzkennzeichen, Stromkreise, Seiten, Querverweise, Leiterdaten.
- [ ] Projektschema mit Versionierung, Migration, robustem Import und großen Projekten.
- [ ] Druckfähige PDF-Ausgabe und vollständige Export-/Import-Rundläufe.

## P2 — intelligente Bauteilerkennung
- [x] Fotoaufnahme/Dateiauswahl und Vorschau als Prototyp.
- [x] Manuelle Hersteller-/Modellangaben und vorsichtige lokale Textsuche.
- [ ] Automatische Bilderkennung/OCR mit expliziter Unsicherheit, menschlicher Bestätigung und Testdatensatz.
- [ ] Herstellerkatalog-Anbindung mit Aktualisierungs-, Quellen- und Lizenzkonzept.
- [ ] Verifizierte Anschlussinformationen kontrolliert in den Schaltplan übernehmen.
- [ ] Datenschutzkonzept, Einwilligung, Aufbewahrung und Upload-Transparenz.

## P3 — Unternehmen und kommerzieller Betrieb
- [ ] Firmenkonten, Rollen/Rechte, sichere Anmeldung und Mandantentrennung.
- [ ] Serverseitig durchgesetzte Testlizenzen (7/14/30 Tage), Ablauf, Sperre und Auditlog.
- [ ] Abrechnung, Datenschutzinformationen, Impressum, Vertrags- und Supportprozesse.
- [ ] Backup/Wiederherstellung, Monitoring, Updates und Incident-Management.

## P4 — Plattform- und Qualitätsabnahme
- [x] Automatisierte Node-/Browser-Tests für ausgewählte Prototypfunktionen.
- [ ] Realgerätetests auf iPhone Safari und Android; Tablet/Desktop unter Windows, macOS, Linux.
- [ ] Accessibility, Tastatur, Touch, responsive Layouts und Übersetzungen prüfen.
- [ ] Performance-, Security-, Import-Fuzzing- und Datenverlusttests.
- [ ] Versionsnummern, Changelog, signierte/verifizierbare Releases, dokumentierte Rollback-Prozedur.

## Freigabegates
1. **G0 Prototyp:** CI grün; ausdrücklich als unverifiziert gekennzeichnet.
2. **G1 Beta:** Kerneditor stabil; Import/Export, Datenschutz, Recovery und Geräteabdeckung dokumentiert.
3. **G2 Fachliche Abnahme:** Herstellerquellen, Klemmenregeln, Normen und ERC fachlich geprüft.
4. **G3 Kommerzielle Freigabe:** Lizenz-/Mandantensicherheit, Rechtliches, Betrieb, Support und End-to-End-Tests bestanden.

**Regel:** Ein grüner CI-Lauf allein erfüllt keines der Gates G1–G3. Fehlende Nachweise werden nie als „fertig“ markiert. `main` und die funktionierende Kamera-Sicherung bleiben bis zur ausdrücklichen Freigabe unangetastet.
