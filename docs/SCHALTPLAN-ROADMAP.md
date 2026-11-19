# ElektroPlan SM – Schaltplan-Entwicklungsplan

Stand: 2026-11-19
Branch: development/component-recognition-v1

## Ziel
Ein plattformübergreifendes Werkzeug für Elektrofachkräfte mit:
1. Schaltpläne neu zeichnen und bearbeiten.
2. Fotografierte/gescannte Schaltpläne importieren.
3. Symbole, Klemmen und Leitungsverläufe erkennen, mit Unsicherheitsmarkierung und manueller Korrektur.
4. Bauteile anhand exakter Hersteller-/Modellangaben und offizieller Unterlagen prüfen.
5. Planänderungen vor der Freigabe als PDF zur Sichtkontrolle bereitstellen.
6. Nach fachlicher Prüfung DXF für CAD-Bearbeitung exportieren.

## Derzeitiger Ist-Zustand
- Kamera-Test 4 auf main unverändert, identisches Backup unter backups/Kamera-Test-4-WORKING-2026-11-19.html.
- V1 manuelle Bauteilerfassung.
- V2 manuelle Herstellerdokumentation mit JSON-Export.
- V3 grafische Bauteilübersicht ohne Leitungen.
- V4 Navigationsseite.
- V5 grafischer Editor mit drei schematischen Symboltypen, Linien, Verschieben, Undo, JSON-Projektdatei, Browser-Druckdialog und einfachem ASCII-DXF.
- **Keiner dieser Prototypen ist bereits als fachlich geprüfter Elektro-Schaltplaneditor freigegeben.**
- **Keine nachgewiesenen Endgerätetests oder CAD-Importtests.**

## Priorisierte technische Arbeit
### P0 – Sicheres internes Datenmodell
- Stabile UUID pro Bauteil und Anschluss.
- Trennung zwischen geometrischen Linien und elektrisch verbundenen Netzen.
- Versioniertes Schema für Projekte, Seiten, Symbole, Pins, Netze und Herstellerquellen.
- Eingabevalidierung, Undo/Redo und keine implizite Verbindung allein durch grafische Berührung.
- Jede ungeprüfte Verbindung erhält Status UNVERIFIED.

### P1 – Editor
- Symbole mit Pins, Rasterfang, Verbindungspunkte, Beschriftungen und Seitenformaten.
- Pan/Zoom, Auswahl, Verschieben, Undo/Redo und Touch-Bedienung.
- Referenzbezeichnungen und Querverweise.

### P2 – PDF und DXF
- PDF mit Seitenformat, Titelblock, Revisionsstand und klarer Kennzeichnung ENTWURF/NICHT GEPRÜFT.
- DXF mit Layern (SYMBOLS, WIRES, LABELS, ANNOTATIONS), Einheiten, überprüften Koordinaten und CAD-Importtest.
- Rundtrip-Prüfung: Export öffnen, Elemente und Maßstab vergleichen.

### P3 – Fotoimport und Analyse
- Bildentzerrung, Rotation, Ausschnitt und Maßstab.
- Symbol-/Text-/Leitungserkennung mit Confidence und Korrektur-UI.
- Keine automatische elektrische Freigabe aufgrund von Bilderkennung.

### P4 – Herstellerprüfung und Fachprüfung
- Dokumentierte Hersteller-/Modellreferenzen mit Dokumentrevision.
- Klemmenzuordnung nur bei belegbarer Quelle; sonst UNBEKANNT.
- Regeln für Netzlistenprüfung, Warnungen, Revisionshistorie und menschliche Fachfreigabe.

## Sicherheitsanforderungen
- Kein automatisches Erfinden von Klemmenbezeichnungen oder Anschlussbelegungen.
- Kein Status 'geprüft' ohne nachvollziehbare Quelle und menschliche Bestätigung.
- PDF/DXF enthalten den Prüfstatus und dürfen ungeprüfte Entwürfe nicht als Installationsfreigabe darstellen.
- Veröffentlichungen zunächst in separatem Entwicklungszweig, nicht direkt auf main.

## Nächste Abnahmetests
- V5: Bauteile hinzufügen/verschieben/löschen; Undo; Projekt speichern/laden.
- PDF auf iOS/Android/Desktop über Druckdialog erstellen und Seitenlayout prüfen.
- DXF in mindestens zwei CAD-Programmen importieren und Linien/Kreise/Positionen vergleichen.
- Projektdateien mit manipulierten Daten ablehnen.
- Erst nach bestandenen Tests ein kontrollierter Release.
