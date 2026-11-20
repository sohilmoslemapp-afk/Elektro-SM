# ElektroPlan SM 1 — Testpaket

**Status: experimenteller Teststand, keine elektrische Freigabe.**

## Start

ZIP entpacken und die Datei `prototypes/ElektroPlan-SM-integriert.html` öffnen. Die Ordner `prototypes/` und `src/` müssen ihre relative Struktur behalten. Für iPhone-Tests empfiehlt sich eine Bereitstellung über HTTPS; das direkte Öffnen lokaler HTML-Dateien kann auf iOS eingeschränkt sein.

## Enthalten

- Grafischer Editor für RCD, LS, Schalter, Leuchten und Klemmen
- Manuell bezeichnete Anschlüsse und Leitungen
- Klemmleistenkennzeichnung X1 usw., Klemmenplan und Verbindungsgruppen als CSV
- Grafische L1/L2/L3/N/PE-Referenzlinien **ohne elektrische Verbindung**
- Projektimport/-export, Stückliste, SVG/PNG und Druck/PDF über Browser
- Experimentelle Foto-/OCR-Erkennung mit manueller Kontrolle
- Warnhinweise und strukturelle Anschlussprüfung

## Wichtige Grenzen

Dieses Programm berechnet **keine** Kurzschlussströme, Leitungsdimensionierung, Selektivität, RCD-Auslösewerte, Schutzleiterdurchgängigkeit oder Normkonformität. Anschlussbezeichnungen sind manuell und nicht durch Herstellerdaten bestätigt. Die sichtbaren Versorgungslinien sind keine elektrisch verbundenen Stromschienen. Eine erfolgreiche Softwareprüfung ersetzt niemals die fachliche Prüfung eines Stromlaufplans und Messungen vor Ort.

## Testprotokoll

1. Editor öffnen; Browserkonsole auf Fehler prüfen.
2. Zwei Bauteile und eine Klemmleiste X1 hinzufügen.
3. Klemmenbezeichnungen prüfen; zwei markierte Anschlüsse verbinden.
4. Strukturprüfung ausführen; offene/fehlende Anschlüsse beachten.
5. Projekt speichern, exportieren und wieder importieren; Daten vergleichen.
6. CSV für Klemmenplan und Verbindungsgruppen exportieren.
7. SVG, PNG und Druckansicht kontrollieren; Hinweis `Keine Freigabe` beachten.
8. Auf iPhone Safari Kamera-/Dateiauswahl, Touch-Bedienung und Downloads separat testen.

## Version und Integrität

Das GitHub-Actions-Artefakt enthält `ElektroPlan-SM-1-Testpaket.zip` sowie `SHA256SUMS.txt`. Nach erfolgreichem Quality Gate wird die ZIP-Datei automatisch erstellt. Ein erfolgreicher Build ist keine Bestätigung aller Funktionen auf einem echten iPhone.
