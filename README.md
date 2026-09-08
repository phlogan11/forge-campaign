# Forge Campaign PWA v0.3

## Main fix
v0.3 fixes the stale-update problem that required Ctrl+F5.

### What changed
- Network-first service worker instead of cache-first.
- Cached files are now fallback/offline copies, not the first choice when online.
- New service worker activates immediately.
- Forge checks for updates when launched and when returning to the foreground.
- If a newer worker takes control, Forge reloads itself once.
- Small `v0.3` badge added to the top bar so the running build is obvious.
- Existing local workout / XP / inventory data remains under the same storage key.

## Upgrade the current GitHub Pages app
Upload all 8 files in this package over the existing repository files and commit directly to `main`.

After GitHub Pages finishes deploying:
1. Do one final Ctrl+F5 on the desktop site to break free of the old v0.2 cache.
2. Confirm the top bar says `v0.3`.
3. On iPhone, fully close Forge and reopen it. If needed, open the URL in Safari once and refresh.
4. From then on, future builds should update without repeated hard refreshes.

## Data warning
Training history is still device-local. Cloud backup/login remains the next infrastructure priority.
