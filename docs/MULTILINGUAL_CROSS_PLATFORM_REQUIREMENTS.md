# ElektroPlan SM 1 — Mehrsprachigkeit, Eingabe und Plattformen (verbindlich)
Stand: 2026-11-21. Ergänzt docs/AI_CAMERA_REQUIREMENTS.md, ohne dessen Anforderungen aufzuheben.

## Sprachen
- Deutsch, Englisch und Arabisch sind gleichberechtigte Hauptsprachen der gesamten Anwendung.
- UI, Hilfe, Status, Warnungen, Bauteilbeschreibungen und Text-/Sprachbefehle in allen drei Sprachen unterstützen.
- Arabisch mit korrekter RTL-Darstellung; technische Artikelnummern, Klemmenbezeichnungen und Normsymbole unverändert lesbar.
- Sprache jederzeit umschaltbar; Benutzereingaben dürfen Sprache mischen.

## Interaktion
- Drei gleichwertige Bedienwege: Sprache, Text und Touch; keine Funktion ausschließlich per Sprachsteuerung.
- Sprachbefehle für Kameraauswahl, Komponentenidentifikation und Schaltplanbearbeitung, soweit Mikrofonberechtigung und Plattform-API verfügbar.
- Bei nicht unterstützter Spracherkennung immer Texteingabe/Touch als vollwertigen Fallback.
- Touch-Ziele auch auf kleinen Displays nutzbar; Maus und Tastatur auf Desktop.

## Plattformübergreifend
- Responsive Web-App für iPhone/iOS Safari, Android/Chrome, Tablets sowie Desktop unter Windows, macOS und Linux mit modernen Browsern.
- Kamera, Galerie/Dateiauswahl und Speichern mit plattformspezifischen Berechtigungen und Fallbacks.
- Keine Bindung an einen einzigen Browser, App-Store oder ein proprietäres Betriebssystem.
- Installierbarkeit als PWA prüfen; Offlinefähigkeit soweit möglich, KI-Erkennung mit Onlinedienst als ausdrücklich gekennzeichnete Netzwerkfunktion.
- Browserübergreifende Tests für Kamera, Crop, Touch, Sprache, Text, RTL, Schaltplan und Export.
- „Alle Programme“ bedeutet offene, dokumentierte Austauschformate und perspektivisch Integrationen; keine unbelegte Zusage einer direkten Kompatibilität mit jeder Drittsoftware.

## Zusätzliche ausdrückliche Freigabe (2026-11-21)
Plattformübergreifende Nutzung ist eine **Hauptanforderung**, kein optionales Extra: Android-Smartphones, iPhones, Android- und iPad-Tablets sowie Desktop-/Laptop-Computer unter Windows, macOS und Linux. Sämtliche Kernabläufe (Kamera/Bildauswahl, Bauteilerkennung, Stromlaufplan, Bearbeitung, Speichern/Export) müssen auf der unterstützten Browser-/Gerätematrix geprüft werden. Plattformbedingte Grenzen werden klar angezeigt und mit Fallbacks behandelt. Unterstützung für „alle Programme“ wird durch dokumentierte, getestete Austauschformate und gezielte Integrationen angestrebt; keine unbelegte universelle Kompatibilitätsbehauptung.

## Nicht verhandelbar
Keine dieser Anforderungen bei der KI-Kamera-Neuentwicklung streichen; ursprüngliches main und Sicherungen schützen.
