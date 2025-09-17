# 📜 Prompt Manifest – *Neon Defense* (HTML/JS)

## 🎯 Ziel  
Sicherstellen, dass alle Prompts für Claude.ai **kleinschrittig**, **fokussiert** und **modular** bleiben, sodass keine funktionierenden Bausteine überschrieben werden.  

---

## 1. Aktionen klar benennen  
Jeder Prompt muss eindeutig sagen, **welche Datei** bearbeitet wird und **welche Art von Änderung** erfolgt.  
Beispiele:  
- „Ändere nur `game.js`, füge eine neue Funktion hinzu.“  
- „Passe in `index.html` nur das UI-Element für den Startbutton an.“  

---

## 2. Baukasten-Kontext setzen  
Unser Projekt besteht aus diesen „Bausteinen“:  

- **`index.html`** → Struktur, UI-Container, Canvas-Element  
- **`game.js`** → Spiellogik, Canvas-Rendering, Gegner/Türme, Waves  
- **`config.js`** → API-Konfiguration (n8n, Supabase)  
- **`style.css`** → Styling und Layout  
- **Assets** → Bilder, Sounds, Logos (nicht verändern, außer explizit angefordert)  

👉 Wichtig: Claude soll **nur den relevanten Baustein** bearbeiten, niemals mehrere gleichzeitig.  

---

## 3. Inkrementelle Änderungen  
- Nur den betroffenen Code ändern oder ergänzen.  
- **Keine Refactorings**, außer ausdrücklich verlangt.  
- Bestehende Funktionen bleiben unverändert.  

---

## 4. Schnittstellen respektieren  
- **Frontend (`game.js`) ↔ Backend (`config.js`, n8n, Supabase)**: Kommunikation läuft über vorhandene Webhooks/Endpoints.  
- **UI (`index.html`) ↔ Spiellogik (`game.js`)**: DOM-Events (Buttons, HUD) sind Schnittstellen, dürfen nicht umgebaut werden.  
- **Styling (`style.css`) ↔ HTML**: Nur optische Änderungen, keine Logik.  

---

## 5. Dokumentation & TODOs  
- Neue Funktionen oder Code-Blöcke mit **`// TODO:` Kommentaren** markieren, wenn etwas noch nicht fertig ist.  
- Am Ende der Datei optional eine **Liste offener Fragen** einfügen.  

---

## 6. Format der Ausgabe  
- Immer die **vollständige Datei** ausgeben (nicht nur Diff).  
- Änderungen klar im Code erkennbar machen (Kommentare oder neue Abschnitte).  
- Markdown-Format mit ```js oder ```html Blöcken, damit der Code direkt kopiert werden kann.  

---

### Beispiel-Prompt im Manifest-Stil
```markdown
Ändere bitte nur die Datei **game.js**.  
Ziel: Ersetze die alten Gegnertypen (`triangle`, `square`, `circle`) durch neue Cyber-Gegner (`virus`, `spam`, `trojan`).  

- Passe die Funktion `enemyColor(type)` entsprechend an (Cyan, Magenta, Gelb).  
- Aktualisiere die Dummy-Gegner in `startWave()`.  
- Restlichen Code unverändert lassen.  

Gib den kompletten neuen Code für **game.js** aus.  
```
