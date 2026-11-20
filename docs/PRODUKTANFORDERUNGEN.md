# ElektroPlan SM 1 — verbindliche Produktanforderungen

Diese Anforderungen gelten **für jede neue Funktion und jedes Release**.

## Sprachen
- Deutsch (de), Englisch (en), Arabisch (ar) sind gleichberechtigte Oberflächensprachen.
- Arabisch unterstützt RTL; technische Kennungen (L1, X1, PE, Artikelnummern) bleiben unverändert.
- Keine neue Schaltfläche oder Funktion darf ausschließlich auf Deutsch ausgeliefert werden.
- Warnungen, Sicherheitshinweise, Formulartexte, Fehlerzustände, Exportdialoge und neue Module müssen ebenfalls lokalisiert werden.
- Sprachwechsel darf Projektdaten und Anschlussbezeichnungen nicht verändern.

## Geräte
- iPhone (Safari), Android-Smartphones (Chrome), Tablets (iPadOS/Android), Desktop (Windows/macOS/Linux mit modernen Browsern).
- Alle Kernfunktionen: Projekt anlegen/speichern/importieren/exportieren, Bauteile, manuelle Klemmen, Leitungen, Prüfung, CSV, SVG und Druck/PDF.
- Touch, Maus und Tastatur müssen berücksichtigt werden; Kamera/Dateiauswahl mit geeigneten Fallbacks.
- Responsive Layout ohne verdeckte Bedienelemente oder unzugängliche Aktionen.

## Qualitäts-Gates
1. Automatisierte Regressionstests für alle drei Sprachen auf vier Viewport-Klassen.
2. Browser-Smoketests für Import/Export, Terminalbearbeitung, Diagramm und Warnhinweise.
3. **Zusätzlich manuelle reale Gerätetests:** Safari auf iPhone, Chrome auf Android, iPad/Android-Tablet und Desktop-Browser.
4. Keine Behauptung von vollwertiger Plattformunterstützung, bevor diese realen Tests dokumentiert sind.
5. Kein Merge in `main` ohne Freigabe. Ursprüngliche Kamera-Testversion und Backup bleiben erhalten.

## Sicherheit
Nur grafische und strukturelle Prüfungen, keine elektrische Freigabe oder Normkonformitätszusage. Herstelleranschlüsse werden niemals aus ungeprüften Angaben abgeleitet.
