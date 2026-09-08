# Forge Campaign PWA v0.2

## New in v0.2
- Real workout logging
- Day-specific Phase I workout selection
- Set-by-set weight and reps/time logging
- Knee pain before/after workout
- Workout notes
- Workout history
- "Open Workout Log" from Today
- Quest completion saves the workout and awards XP once
- Character stats automatically advance by workout type
- Existing v0.1 local data is preserved because the same localStorage key is used
- Service worker cache bumped to v0.2

## Update your live GitHub Pages app
Replace these files in your existing repository:
- index.html
- styles.css
- app.js
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png

README.md can also be replaced, but it does not affect the app.

After GitHub Pages redeploys, open Forge and refresh once. If the Home Screen app still shows the old version, fully close Forge and reopen it; the updated service worker should take over.

## Important
Data is still stored only on the device/browser. Cloud backup/login is the next infrastructure priority before months of history accumulate.
