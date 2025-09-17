# Kapitel 2 – Game Core

Ziel von Kapitel 2 ist es, die Kernspiellogik (Spielfeld, Gegner, Türme, Waves) zu implementieren. Dies umfasst die grundlegenden Gameplay-Mechaniken von Neon Defense: kontinuierliche Gegnerbewegung, Tower-Platzierung mit Cyber-Security-System und Wave-Management über Supabase.

## Checkliste

### Spielfeld
- [x] Canvas aufsetzen mit einem einfachen Pfad (Start → Basis)
- [x] 6–8 vordefinierte Slots für Türme markieren

### Gegnerbewegung (Continuous Movement)
- [x] Cyber-Gegnertypen (Virus, Spam, Trojan) implementieren
- [x] Kontinuierliche Bewegung entlang des Pfads mit smooth Animation
- [ ] HP-Anzeige pro Gegner (Zahl oder Balken)

### Türme
- [ ] Platzierung auf Slots ermöglichen
- [ ] Reichweitenprüfung: Ist ein Gegner im Radius?
- [ ] Projektil abfeuern → Gegner-HP reduzieren

### Cyber-Security Mechanik
- [ ] Antivirus → stark gegen Virus (Cyan)
- [ ] Firewall → stark gegen Spam (Magenta)
- [ ] Patch/Router → stark gegen Trojan (Gelb)

### Wave Management
- [ ] Gegnerlisten aus Supabase via n8n laden
- [ ] Welle automatisch starten & beenden, sobald alle Gegner durch sind

## Fortschritt
### Bereits implementiert ✅
- S-förmiger Pfad mit Neon-Glow
- 7 strategische Turm-Slots mit Magenta-Glow
- Cyber-Gegnertypen: Virus (Dreieck/Cyan), Spam (Quadrat/Magenta), Trojan (Kreis/Gelb)
- Smooth Animation entlang des Pfads
- Basic Wave-System mit n8n-Integration

## Offene Fragen
- [ ] Wie detailliert müssen Gegnerstatus und Positionen für Supabase gespeichert werden?
- [ ] Müssen Projektile selbst animiert werden oder reicht ein Instant-Treffer?
- [ ] Sollen Türme visuelle Upgrades haben oder nur Stats ändern?

---

*Letztes Update: 17. September 2025*