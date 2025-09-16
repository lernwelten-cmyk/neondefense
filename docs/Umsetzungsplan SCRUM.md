# 📌 Roadmap – Neon Defense (SCRUM Plan)

## 🏁 Ziel
Ein HTML5-basiertes Tower-Defense-Roguelite im Tron/Neon-Stil, spielbar als PWA auf iPad, mit n8n-Backend und Supabase-Datenbank.  

---

## 📂 Kapitel 1: Grundlagen & Setup (Epic: Projektbasis schaffen)

### ✅ Checkliste
- [ ] **Projektstruktur anlegen**
  - Ordnerstruktur für Frontend (HTML, CSS, JS).
  - Ordner für Dokumentation (GDD, Balancing, Sprints).
- [ ] **Supabase Setup**
  - Neues Projekt anlegen.
  - Tabellen: `runs`, `players`, `towers`, `enemies`, `meta_progression`.
- [ ] **n8n Setup**
  - Instanz starten (Cloud oder lokal).
  - Basis-Webhooks erstellen für Spielkommunikation.
- [ ] **PWA Basis**
  - Minimal-App mit Manifest + Service Worker.
  - Startscreen anzeigen: "Neon Defense".

👉 **Offen:** Wo wird das Projekt gehostet (lokal, GitHub Pages, eigener Server)?  

---

## 📂 Kapitel 2: Game Core (Epic: Spiellogik implementieren)

### ✅ Checkliste
- [ ] **Spielfeld**
  - Canvas mit einfachem Pfad (Linie von Start → Basis).
  - Slots für Türme (z. B. 6–8 vordefinierte Stellen).
- [ ] **Gegnerbewegung**
  - Formen (Dreieck, Quadrat, Kreis) bewegen sich entlang des Pfades.
  - HP-Anzeige (kleine Zahl oder Balken).
- [ ] **Türme**
  - Platzierbar auf Slots.
  - Reichweitenprüfung (ist Gegner im Radius?).
  - Projektil → Gegner-HP reduzieren.
- [ ] **Schere–Stein–Papier Mechanik**
  - Laser > Quadrate.
  - Pulse > Dreiecke.
  - Missile > Kreise.
- [ ] **Wave Management**
  - Gegnerliste aus Supabase laden (n8n generiert).
  - Automatisches Starten/Enden der Welle.

👉 **Offen:** Gegnerbewegung kontinuierlich (smooth) oder rundenbasiert (pro Schritt)?  

---

## 📂 Kapitel 3: Progression & Upgrades (Epic: Roguelite-Elemente einbauen)

### ✅ Checkliste
- [ ] **Run-Upgrades**
  - Nach jeder Welle: 2–3 zufällige Boni anzeigen.
  - Beispiel: +20 % Schaden, +1 Reichweite, +5 Basis-HP.
- [ ] **Meta-Progression**
  - Nach Run-Ende: Punkte vergeben.
  - Menü: Freischaltbare Türme, Start-Boni.
- [ ] **Speicherung**
  - Supabase: Meta-Boni dauerhaft sichern.
  - Anwendung bei neuem Run.

👉 **Offen:** Meta-Freischaltungen linear (fester Baum) oder flexibel (Shop-System)?  

---

## 📂 Kapitel 4: UI/UX (Epic: Spielererlebnis optimieren)

### ✅ Checkliste
- [ ] **Startscreen**
  - Titel, "Neues Spiel starten", (optional) Leaderboard.
- [ ] **Planungsphase UI**
  - Anzeige: Basis-HP, Energie, nächste Gegnerwelle.
  - Buttons: Turm setzen, Energie sparen, Welle starten.
- [ ] **Ausführungsphase UI**
  - Nur Beobachten: Gegner + Turm-Aktionen.
  - Dauer: 20–40 Sekunden.
- [ ] **Zwischenphase UI**
  - Upgrade-Auswahl mit 2–3 Buttons.
- [ ] **Game Over Screen**
  - Score, erreichte Welle, erhaltene Meta-Punkte.

👉 **Offen:** Soll es Animationen (Neon-Pulse, Explosionen) geben oder rein minimalistisch bleiben?  

---

## 📂 Kapitel 5: Backend-Integration (Epic: n8n + Supabase verbinden)

### ✅ Checkliste
- [ ] **n8n Workflows**
  - Spawn-Wellen-Workflow (erstellt Gegnerliste).
  - Kampf-Workflow (berechnet Treffer/Schaden, aktualisiert HP).
  - Upgrade-Workflow (liefert zufällige Auswahl).
  - Meta-Workflow (vergibt Punkte).
- [ ] **Supabase Anbindung**
  - API-Abfragen von Frontend → n8n.
  - Speicherung: Runs, Gegnerstatus, Türme.
- [ ] **Webhook Kommunikation**
  - Frontend schickt Aktionen → n8n → Antwort als JSON.

👉 **Offen:** Soll Logik eher ins Frontend (JS) oder Backend (n8n) ausgelagert werden?  

---

## 📂 Kapitel 6: Balancing & Content (Epic: Spieltiefe schaffen)

### ✅ Checkliste
- [ ] **Turmwerte**
  - Kosten, Schaden, Reichweite, Schussrate.
- [ ] **Gegnertabelle**
  - HP, Geschwindigkeit, Wellenaufbau.
- [ ] **Upgrade-Pool**
  - Run-Upgrades (temporär).
  - Meta-Upgrades (dauerhaft).
- [ ] **Wellen-Kurve**
  - Skalierung von Schwierigkeit → Progression testen.
- [ ] **Bosse**
  - Eigenschaften, Schwächen, Belohnungen.

👉 **Offen:** Wie viele Wellen pro Run sind realistisch für 5–15 Minuten Spielzeit?  

---

## 📂 Kapitel 7: Testing & Iteration (Epic: Stabilität und Spaß testen)

### ✅ Checkliste
- [ ] **Unit Tests**
  - Gegnerbewegung.
  - Turm-Schaden.
  - Upgrade-Anwendung.
- [ ] **Balancing Tests**
  - Wellen zu schwer/leicht?
  - Goldfluss → zu viel/zu wenig?
- [ ] **Usability Tests**
  - iPad-Handling (Touch).
  - Übersichtlichkeit UI.
- [ ] **Feedback-Schleifen**
  - Interne Playtests.
  - Anpassung der Werte.

👉 **Offen:** Soll es ein externes Testpanel (Freunde, Community) geben?  

---

## 📂 Kapitel 8: Extras (Epic: Nice-to-Have Features)

### Ideen (nicht Pflicht für MVP)
- **Sound & Musik:** Synthwave/Tron-Soundtrack, Laser-SFX.  
- **Leaderboards:** Global/Local über Supabase.  
- **Skins:** Neon-Farbvarianten für Spielerbasis.  
- **Events:** Zufallsereignisse (z. B. „Serverüberlastung – Gegner doppelt so schnell“).  

👉 **Offen:** Welche Extras sind für Version 1 realistisch?  

---

# 🚀 Sprint-Planung (SCRUM)

- **Sprint 1 (2 Wochen):** Setup (Kapitel 1) + Basis-Canvas + Gegnerbewegung (Kapitel 2).  
- **Sprint 2 (2 Wochen):** Türme + Schere–Stein–Papier Mechanik + einfache Wellen.  
- **Sprint 3 (2 Wochen):** Upgrades + Meta-Progression + Supabase-Anbindung.  
- **Sprint 4 (2 Wochen):** UI/UX-Polish, Balancing, erste Playtests.  
- **Sprint 5 (2 Wochen):** Extras (Sounds, Leaderboard), Bugfixing.  

👉 Gesamt: **~10 Wochen bis MVP**, danach Iteration.  

---
