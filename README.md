# Forge Campaign PWA v0.1

Player One Edition — built for the Mt. Taylor 2027 campaign.

## What works now
- Installable PWA shell
- Today dashboard
- Mt. Taylor countdown
- XP / level progression
- Daily habits with XP
- Quest completion
- Phase I weekly plan
- Character stats
- Baseline bodyweight / waist / knee-pain notes
- Character Inventory with item statuses
- Campaign roadmap
- Local browser storage
- Offline asset caching after first load

## Easiest Windows deployment: GitHub Pages

1. Create a free GitHub account if you do not already have one.
2. Create a new repository, for example `forge-campaign`.
3. Upload every file and folder from this package to the repository root.
4. In the repository, open Settings -> Pages.
5. Under Build and deployment, choose "Deploy from a branch".
6. Select the `main` branch and `/ (root)` folder, then Save.
7. GitHub will give you an HTTPS address for the site.

HTTPS matters because service workers / PWA behavior require a secure context when hosted.

## Install on iPhone

1. Open the deployed Forge URL in Safari on the iPhone.
2. Tap Share.
3. Choose Add to Home Screen.
4. Confirm Add / Open as Web App if prompted.
5. Launch Forge from its icon.

## Important v0.1 limitation
Your data is stored locally in that browser/web-app installation. Clearing Safari website data, deleting the web app, or moving to another phone can lose the current data.

The next major upgrade should be cloud backup/login so the campaign survives device changes.

## Files
- index.html — application structure
- styles.css — mobile-first interface
- app.js — XP, habits, local data, tabs, inventory
- manifest.webmanifest — installable-app metadata
- service-worker.js — basic offline cache
- icons/ — app icons
