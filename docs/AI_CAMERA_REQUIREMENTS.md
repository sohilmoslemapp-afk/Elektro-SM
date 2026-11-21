# ElektroPlan SM 1 — Verbindliche Anforderungen: KI-Kamera und Schaltplan
Stand: 2026-11-21. Vom Auftraggeber freigegeben. Entwicklung nur auf ElektroPlan-Entwicklung-1; main, Kamera-Test und Sicherungen unverändert lassen.

## Grundprinzip
Foto zuerst. Keine verpflichtende manuelle Eingabe von Hersteller, Modell oder Artikelnummer. Das optionale Feld **Bauteiltyp** wird bei erfolgreicher Erkennung automatisch befüllt und kann vom Nutzer korrigiert werden. Unbekannte Werte bleiben ausdrücklich unbekannt, nicht erfunden.

## Aufnahme und Auswahl
- iPhone Safari: Kamera öffnen, Bild auswählen, Bildvorschau, Zuschneiden (Crop) und erneute Analyse.
- Einzelnes Bauteil oder mehrere nebeneinander liegende Bauteile im Schaltschrank fotografieren.
- Zielbauteil durch Tippen, Markieren/Crop oder natürliche Anweisung (z.B. „rechter Schalter“, „mittleres Bauteil“) auswählen; Mehrdeutigkeiten nachfragen.
- Bild-/Texterkennung darf nicht voraussetzen, dass Seitenetiketten sichtbar oder Bauteile demontierbar sind.

## Automatische Identifikation
- KI-Bildanalyse statt alleiniger Browser-TextDetector-OCR. Typ, Hersteller, Modell und Artikelnummer automatisch vorschlagen, soweit aus Bild und verfügbaren Nachweisen bestimmbar.
- Unsicherheit, Alternativmodelle, Quellen und Nachweisstatus sichtbar machen; keine 100%-Trefferquote versprechen.
- Benötigt einen sicher angebundenen multimodalen Erkennungsdienst und Quellenrecherche. Keine geheimen API-Schlüssel in clientseitigem HTML/JS.
- Netzwerk-/Dienstfehler sauber behandeln, keine erfundene lokale Erkennung vorspiegeln.

## Herstellerdaten, Sicherheit und Schaltplan
- Anschlussbelegung, Klemmenbezeichnungen und Schaltplansymbol nur aus eindeutig passender, überprüfter Herstellerdokumentation übernehmen.
- Fotoähnlichkeit oder OCR allein autorisieren keine Anschlusszuordnung; ungeprüfte Symbole nur als klar markierte Entwürfe ohne elektrische Freigabe.
- Erkanntes Bauteil mit Typ, Provenienz, Prüfstatus und dokumentierten Klemmen in den Schaltplan übernehmen; keine verpflichtende Klemmenabfrage bei nicht-elektrischen Entwürfen.
- Änderungen an echten Klemmenbelegungen gegenüber reinen Beschriftungsänderungen unterscheiden.

## Steuerung und Bearbeitung
- Natürliche Textbefehle und Spracheingabe für Auswahl, Platzierung, Verschieben, Umbenennen, Verdrahtung und Bearbeitung.
- Beispiel: „Nimm den rechten FI“, „Ändere Anschluss 3 auf 5“; bei sicherheitsrelevanter Änderung Rückfrage/Prüfung.
- Undo/Redo, Speichern und Export, nachvollziehbare Änderungen.

## Akzeptanztests
1. Kamera-Foto eines einzelnen Bauteils; Typ ohne Pflichtfelder.
2. Bild mit drei Geräten: Auswahl rechts per Text und per Tap; Crop funktioniert.
3. Galerie-Foto und Korrektur des automatisch ausgefüllten Bauteiltyps.
4. Unbekanntes oder mehrdeutiges Gerät: keine erfundenen Modell-/Klemmenangaben.
5. Dokumentierte Identität: Symbol und geprüfte Klemmen in Schaltplan.
6. Text- und Sprachbefehl ändern Zeichnung; Undo stellt vorherigen Zustand wieder her.
7. iPhone Safari, Offline-/Netzwerkfehler, Speicherung, keine Geheimnisse im Frontend.
8. Bestehende Kamera- und Schaltplan-Tests bleiben intakt.

## Implementierungsstatus
Diese Datei fixiert die Anforderungen, nicht deren Fertigstellung. Der bisherige Browser-Prototyp unterstützt Fotoanzeige und manuelle Erfassung; KI-Backend, Bildauswahl mehrerer Geräte, Crop und Sprachbefehle müssen implementiert und getestet werden.
