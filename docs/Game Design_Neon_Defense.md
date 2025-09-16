# 🎮 Game Design Dokument – *Neon Defense*

---

## 1. High Concept
- **Genre:** Tower Defense mit Roguelite-Elementen.  
- **Plattform:** HTML5 PWA (optimiert für iPad, Touchsteuerung).  
- **Setting:** Digitale Neon-Welt im Stil von *Tron*.  
  - Schwarzer Hintergrund, geometrische Formen (Dreiecke, Quadrate, Kreise).  
  - Neonfarben mit Glow-Effekten (Cyan, Magenta, Gelb, Grün).  
- **USP:** Enges Gameplay: Planung vor jeder Welle, dann automatische Ausführung.  
- **Ziel:** So viele Gegnerwellen wie möglich überleben, Meta-Fortschritte freischalten.  

👉 **Offen:** Wie stark „retro/futuristisch“ soll das Setting wirken? Eher minimalistisch oder verspielt mit Effekten?

---

## 2. Core Gameplay Loop

### 1. Planungsphase
- Vorschau auf die kommende Welle (Typ & Anzahl der Gegner).  
- Spieler kann:  
  - Türme setzen (Laser, Pulse, Missile).  
  - Bestehende Türme upgraden.  
  - Energie sparen.  
- Türme und Gegner folgen einer **Schere–Stein–Papier-Mechanik**:  
  - **Laser (Magenta)** → stark gegen gepanzerte Quadrate.  
  - **Pulse (Cyan)** → stark gegen Schwärme (Dreiecke).  
  - **Missile (Gelb)** → stark gegen Flieger (Kreise).  

### 2. Ausführungsphase
- Gegner bewegen sich automatisch entlang eines festen Pfades.  
- Türme schießen automatisch; Stärken/Schwächen werden angewendet.  
- Spieler kann nicht eingreifen → reine Beobachtung.  
- Dauer: 20–40 Sekunden pro Welle.  

### 3. Zwischenphase
- Belohnung: Energiepunkte.  
- Upgrade-Auswahl: 2–3 zufällige Optionen (z. B. mehr Schaden, Reichweite).  

### 4. Ende des Runs
- Basis-Kern fällt auf 0 HP → Run endet.  
- Spieler erhält Punkte & Meta-Belohnungen.  

👉 **Offen:** Sollen Spieler auch *verkaufen* können, oder nur bauen/upgraden?

---

## 3. Spieleraktionen
- **Turm bauen:** An Slots entlang des Pfads.  
- **Upgrade wählen:** Zwischen den Wellen, temporär für den Run.  
- **Welle starten:** Pflichtaktion nach der Planung.  

👉 **Offen:** Anzahl Slots pro Karte → wenige, feste Plätze oder freie Platzierung?

---

## 4. Progression

### A. Innerhalb eines Runs
- Energie sammeln und ausgeben.  
- Temporäre Upgrades nach jeder Welle.  

### B. Meta-Progression (dauerhaft)
- Basis-Upgrades: +5 HP, +10 Startenergie.  
- Turm-Upgrades: +10 % Basisschaden, +Reichweite.  
- Neue Türme: Frost-Welle, Gift-Strahl, EMP, Splitter-Laser.  
- Ökonomie-Upgrades: mehr Energie, zusätzliche Turm-Slots.  

### C. Progressions-System
- Meta-Punkte = „Kernmodule“, abhängig von Welle & Score.  
- Werden in Supabase gespeichert, von n8n verteilt.  

👉 **Offen:** Welche Progression ist linear (immer gleich freischaltbar), welche zufällig?

---

## 5. Gegner & Wellen

### Gegnerklassen
- **Rotes Dreieck (Virus/Schwarm):** schnell, schwach, viele → schwach gegen Pulse.  
- **Blaues Quadrat (Firewall/Panzer):** langsam, stark, hohe HP → schwach gegen Laser.  
- **Grüner Kreis (Datenfragment/Flieger):** mittel-schnell, fliegend → schwach gegen Missile.  

### Bosse
- Große Polygone (Hexagon, Dodekaeder).  
- Mischtypen, schwer zu kontern.  
- Alle 5 Wellen.  

### Skalierung
- Mehr Gegner, mehr HP, mehr Geschwindigkeit pro Welle.  

👉 **Offen:** Soll es auch *Hybrid-Gegner* geben (z. B. gepanzerte Flieger)?

---

## 6. Türme

### Basis-Türme
1. **Laser-Turm (Magenta)** → stark gegen Panzer.  
2. **Pulse-Turm (Cyan)** → stark gegen Schwärme.  
3. **Missile-Turm (Gelb)** → stark gegen Flieger.  

### Meta-Unlocks
- **Frost-Welle (Weiß):** Verlangsamt Gegner.  
- **Gift-Strahl (Grün):** Schaden über Zeit.  
- **EMP (Violett):** AoE-Stun.  
- **Splitter-Laser:** Projektile teilen sich.  

👉 **Offen:** Turm-Upgrade-Stufen (z. B. Level 1–3 pro Run) definieren?

---

## 7. Upgrades
- Run-basierte Boni, zufällig gewählt.  
- Beispiele:  
  - +20 % Schaden  
  - +1 Reichweite  
  - +10 % Energie pro Welle  
  - +5 HP für Basis  
  - schnellere Schussrate  

👉 **Offen:** Sollen Upgrades stapelbar sein oder limitiert?

---

## 8. Harte Fakten (Datenbank)
- **Runs:** Spieler, Session-ID, Welle, Score.  
- **Türme:** Typ, Position, Reichweite, Schaden.  
- **Gegner:** Typ, HP, Position, Geschwindigkeit.  
- **Basis:** HP, Energie.  
- **Meta:** freigeschaltete Türme, permanente Boni.  

👉 **Offen:** Wie detailliert muss Gegner-Position in DB gespeichert werden (für Replay/Analyse), oder reicht nur der Status?

---

## 9. Weiche Fakten (optional, LLM)
- Flavor-Texte für Atmosphäre:  
  - „Ein rotes Datenfragment pulsiert über die Grid-Linie…“  
- Upgrade-Beschreibungen:  
  - „Dein Laser wurde kalibriert – 20 % mehr Durchschlag.“  

👉 **Offen:** Soll LLM nur für Textflair genutzt werden oder auch kleine Event-Ideen einbringen?

---

## 10. Technik
- **Frontend:** HTML5, Canvas für Spielfeld, Buttons für Steuerung.  
- **Backend:** n8n orchestriert Wellen, Kämpfe, Upgrades.  
- **DB:** Supabase für Runs, Türme, Meta.  
- **PWA:** Installierbar, offline-fähig.  
- **Style:** Tron/Neon – dunkler Hintergrund, leuchtende Formen.  

👉 **Offen:** Soll Sound integriert werden (Laser, Explosionen, Musik)?

---

## 11. Vision
- Kurze Runs (5–15 Min.), schnell erlernbar.  
- Schere–Stein–Papier-System sorgt für taktische Planung.  
- Wiederspielwert durch Meta-Fortschritt.  
- Minimalistischer, aber stylischer Neon-Look.  

---

## 12. Spielerstellung & Run-Start
- **Startscreen:** Titel + [Neues Spiel starten].  
- **Spielername:** Optional für Leaderboard.  
- **Session-Anlage:** Supabase erstellt neuen Run mit Startwerten.  
- **Meta-Boni:** Werden automatisch geladen.  
- **Erste Vorschau:** Nächste Welle wird angezeigt → Spieler geht direkt in Planungsphase.  

👉 **Offen:** Soll der Spieler vorab schon Türme setzen dürfen oder erst nach Welle-1-Vorschau?

---

# ✅ Nächste Schritte für Feindesign
- Balancing-Tabellen für HP, Schaden, Energie-Kosten.  
- Upgrade-Pool vollständig definieren (Run vs. Meta).  
- Turm-Level (innerhalb Runs) festlegen.  
- Gegner-Skalierungskurve konkretisieren.  
- UI-Layout für iPad (Buttons, Spielfeld, Anzeige).  

