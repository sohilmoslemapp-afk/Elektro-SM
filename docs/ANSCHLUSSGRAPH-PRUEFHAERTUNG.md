# Schaltplan-Anschlussgraph — Abschlusskriterien der aktuellen Prüfhärtung

Stand: 21.11.2026. **Technischer Prototyp, keine elektrische Freigabe.**

## Geprüfter Funktionsumfang
- Der Adapter übernimmt ausschließlich explizit eingetragene Bauteil- und Klemmenreferenzen. Keine Klemmen werden aus Fotos, Ähnlichkeiten oder Herstellerbezeichnungen abgeleitet.
- Unvollständige, unbekannte, mehrdeutige, mit Steuerzeichen versehene oder ungültige Referenzen bleiben mit ursprünglichem Leitungsindex und deutschem Diagnosegrund offen (pending).
- Identische und Unicode-kanonisch äquivalente Bauteilkennungen und Klemmenbezeichnungen werden auf Mehrdeutigkeit geprüft.
- Der Anschlussgraph meldet offene Leitungen, doppelte und widersprüchliche Quellleitungsnummern, ungültige Diagnosedaten und fehlerhafte Eingabestrukturen.
- Strukturell gültige Teilverbindungen können erhalten bleiben; offene Leitungen erzwingen weiterhin manuelle Prüfung. `electricallyApproved` bleibt ausdrücklich `false`.
- Die integrierte Schaltplanprüfung zeigt nicht auswertbare Klemmenverbindungen an und verlangt eine Prüfung.

## Abnahmetests
- `tests/schematic-graph-adapter.test.js`: gültige und offene Leitungen, Unicode, ungültige Kennungen, Mehrdeutigkeiten, große Pläne, Quellindizes, malformed inputs, gemischte Fälle.
- `tests/integrated-terminal-review-status.test.js` und `tests/integrated-ui-contract.test.js`: sichtbarer Prüfstatus und Hinweis auf fehlende elektrische Freigabe.
- CI-Gates: Unit tests, Quality gate, Trial package. Der Abschluss der Prüfhärtung setzt grüne Ergebnisse **für den letzten Commit** voraus.

## Grenzen / weiterhin offen
- Keine Herstellerdaten- oder Anschlussbelegungsprüfung, keine fachliche ERC-/Normenprüfung, keine Sicherheitsfreigabe.
- Keine reale Endgeräte-Abnahme; die Tests beweisen keine normgerechte Verdrahtung.
- Weitere Produktanforderungen bleiben bestehen: Deutsch/Arabisch/Englisch; Spracheingabe, Texteingabe, Kamera, Touch und Maus; professioneller Schaltplaneditor. Sie sind **nicht** Bestandteil dieser Prüfhärtung und werden nicht als fertig deklariert.
- Vor einem kommerziellen Release gelten weiterhin die offenen Gates in `docs/RELEASE-ROADMAP-UND-GATES.md`.
