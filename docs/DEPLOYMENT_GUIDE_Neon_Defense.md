# DEPLOYMENT GUIDE – *Neon Defense* PWA

Dieser Guide beschreibt den vollständigen Deployment-Prozess für **Neon Defense** – ein HTML5 Tower-Defense-Roguelite im Neon/Tron-Stil – über GitHub und Netlify.

---

## 1. Projektübersicht

### Relevante Dateien für Deployment:
- ✅ `index.html` – Haupt-App-Datei (Canvas-Spielfeld + UI)  
- ✅ `manifest.json` – PWA Manifest  
- ✅ `sw.js` – Service Worker für Offline-Funktionalität  
- ✅ `icon-192.png` – App Icon (192x192, Neon-Style)  
- ✅ `icon-512.png` – App Icon (512x512, Neon-Style)  
- ✅ `neon_logo.png` – Hauptlogo (optional, Startscreen)  

---

## 2. GitHub Repository Setup

### Initial Setup
```bash
# 1. Repository auf GitHub erstellen (neon-defense)
# 2. Lokales Git initialisieren
git init
git branch -M main

# 3. .gitignore erstellen
echo "*.log" > .gitignore
echo ".DS_Store" >> .gitignore

# 4. Erste Commits
git add .
git commit -m "feat: initial commit - Neon Defense PWA v1.0.0"

# 5. Remote Repository verbinden
git remote add origin https://github.com/lernwelten-cmyk/neondefense.git
git push -u origin main
```

### Empfohlene README.md
```markdown
# Neon Defense

Ein Tower-Defense-Roguelite im Neon/Tron-Stil.  

- 🌀 Strategische Planung & automatisierte Kämpfe  
- 🧱 Schere–Stein–Papier Türme & Gegner  
- 🚀 Meta-Progression über Supabase gespeichert  
- 📱 Offline-fähig & als PWA installierbar  

## Live Demo
https://neondefense.netlify.app/
```

---

## 3. Netlify GitHub Deployment

### Schritt-für-Schritt Setup
1. **Netlify Account verbinden**  
   - Auf [netlify.com](https://netlify.com) anmelden  
   - "Add new site" → "Import an existing project"  
   - GitHub als Quelle auswählen  

2. **Repository auswählen**  
   - `neondefense` Repository wählen  
   - Berechtigungen erteilen  

3. **Build Settings konfigurieren**
   ```
   Branch to deploy: main
   Base directory: (leer lassen)
   Build command: (leer lassen)
   Publish directory: /
   Functions directory: (leer lassen)
   ```

4. **Deploy starten**  
   - "Deploy site" klicken  
   - Netlify generiert URL: `https://[random-name].netlify.app`  

5. **Custom Domain (optional)**  
   - Site settings → Domain management  
   - "Add custom domain" → `neondefense.netlify.app`  

---

## 4. Versionierung & Cache Management

### App Version aktualisieren
**In `sw.js` ändern:**
```js
const APP_VERSION = "1.0.1"; // bei jedem Update hochzählen
const CACHE_NAME = `neon-defense-${APP_VERSION}`;
```

### Update Workflow
```bash
# 1. Änderungen vornehmen
# 2. APP_VERSION in sw.js erhöhen
# 3. Commit erstellen
git add .
git commit -m "update: v1.0.1 - balancing adjustments"

# 4. Push zu GitHub
git push origin main

# 5. Netlify deployt automatisch die neue Version
```

---

## 5. Post-Deployment Checks ✅

### Deployment-Verifikation
- [ ] App-URL öffnen: https://neondefense.netlify.app/  
- [ ] Service Worker lädt (F12 → Application → Service Workers)  
- [ ] Manifest + Icons geprüft  
- [ ] Installation auf Homescreen getestet  
- [ ] Offline-Funktion getestet  
- [ ] Neue Version korrekt geladen  

### Mobile Tests
- [ ] Safari/Chrome auf iPad öffnen  
- [ ] PWA Installation testen  
- [ ] Spiel läuft flüssig (Canvas, Touch-Eingaben)  
- [ ] Sound & Animationen werden abgespielt (falls integriert)  

---

## 6. Netlify Management

### Deploy History einsehen
- Netlify Dashboard → [Neon Defense Site](https://app.netlify.com/projects/neondefense/overview)  

### Rollback
1. Deploy auswählen  
2. "Preview deploy"  
3. "Publish deploy" bei Erfolg  

### Fehlerbehebung
- **Icons fehlen:** Pfade in `manifest.json` prüfen  
- **App lädt nicht neu:** `APP_VERSION` erhöhen + Cache löschen  
- **404 Error:** `Publish directory` auf `/` setzen  

---

## 7. Best Practices

### Commit Messages
```bash
git commit -m "feat: add EMP tower"
git commit -m "fix: enemy pathfinding issue"
git commit -m "update: v1.0.2 - improved balancing"
git commit -m "style: neon color adjustments"
```

### APP_VERSION erhöhen bei:
- ✅ Gameplay-Änderungen (Türme, Gegner, Upgrades)  
- ✅ Balancing Updates  
- ✅ Asset- oder Design-Änderungen  

Nicht erforderlich bei:
- ❌ README-Updates  
- ❌ Kommentaränderungen  

---

## Quick Reference

**Update Workflow**
```bash
# Änderungen machen
# APP_VERSION hochzählen
git add .
git commit -m "update: v1.0.X - [description]"
git push origin main
# Netlify deployt automatisch
```

**Wichtige URLs**
- 🌐 Live App: https://neondefense.netlify.app/  
- ⚙️ Netlify Dashboard: https://app.netlify.com/projects/neondefense/overview  
- 📂 GitHub Repo: https://github.com/lernwelten-cmyk/neondefense  

---

*Letztes Update: 16. September 2025*  
