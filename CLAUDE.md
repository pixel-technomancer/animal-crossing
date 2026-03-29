# Project Setup Instructions

When building local apps for this user, follow this deployment and architecture pattern.

## Platform Target

Every app should run on both:
1. **Mac desktop** via Electron
2. **iPhone** via PWA (Progressive Web App) hosted on GitHub Pages

Code updates should propagate to both platforms with a single `git push`.

## Tech Stack Defaults

- **Framework:** React + TypeScript
- **Build tool:** Vite with `base: './'` in `vite.config.ts`
- **Styling:** Tailwind CSS
- **Desktop shell:** Electron
- **Hosting:** GitHub Pages (free, static)
- **Data storage:** localStorage (no backend)
- **Package manager:** npm

## Step-by-Step Setup

### 1. Vite config

Set relative base path so assets work on both GitHub Pages and local Electron file loading:

```ts
// vite.config.ts
export default defineConfig({
  base: './',
})
```

### 2. PWA manifest and meta tags

Create `public/manifest.json`:
```json
{
  "name": "App Name",
  "short_name": "App",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "./icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "./icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Add to `index.html` `<head>`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="theme-color" content="#000000" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

Provide 192px and 512px PNG icons in `public/`.

### 3. GitHub Pages auto-deploy

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

After first push, enable Pages: repo Settings > Pages > Source: "GitHub Actions".

Then run `gh api repos/OWNER/REPO/pages -X POST -f build_type=workflow` to activate.

### 4. Electron setup

Install dev dependencies:
```
npm i -D electron electron-builder concurrently wait-on
```

Create `electron/main.cjs`:
```js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 480,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    // Load the hosted web app so both platforms stay in sync
    win.loadURL('https://USERNAME.github.io/REPO_NAME/');

    // Fall back to bundled files if offline
    win.webContents.on('did-fail-load', () => {
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      }
    });
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

Replace `USERNAME` and `REPO_NAME` with the actual GitHub username and repo.

Add to `package.json`:
```json
{
  "main": "electron/main.cjs",
  "scripts": {
    "electron:dev": "concurrently -k \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "tsc -b && vite build && electron-builder --mac --config electron-builder.json",
    "install-app": "npm run electron:build && cp -R \"release/mac-arm64/APP_NAME.app\" /Applications/"
  }
}
```

Create `electron-builder.json`:
```json
{
  "appId": "com.appname.app",
  "productName": "App Name",
  "directories": { "output": "release" },
  "files": ["dist/**/*", "electron/**/*"],
  "mac": {
    "category": "public.app-category.reference",
    "target": "dir",
    "icon": "build/icon.icns"
  }
}
```

Add `release` to `.gitignore` to keep build artifacts out of the repo.

### 5. Electron security requirements

Always set these in `webPreferences`:
- `nodeIntegration: false`
- `contextIsolation: true`

Never add a `preload` script unless specifically needed.

### 6. Cross-device data sync (manual, no backend)

If the app stores user data in localStorage, add a manual sync feature:

**Export:** Collect all localStorage keys into one object, encode with `btoa(JSON.stringify(data))`, show as a copyable text code.

**Import:** Decode with `JSON.parse(atob(code))`, write each key back to localStorage, then reload app state.

Provide a Sync button in the app header/nav that opens a modal with Export and Import options.

**Important:** Render the sync modal using `createPortal(jsx, document.body)` so it isn't clipped by parent elements with `sticky`, `overflow`, or `z-index` constraints.

After import, the app must reload its state from localStorage (not just re-render). Use a callback pattern: `onDataImported` triggers `setState(loadFromStorage())` for each piece of state.

### 7. GitHub repo setup

When creating the repo:
- Use `gh repo create REPO_NAME --public --source=. --push`
- Make sure `node_modules`, `dist`, and `release` are in `.gitignore` before the first commit
- Never commit build artifacts (`.app`, `.dmg`, etc.) — they bloat the repo and slow pushes

### 8. Deployment flow

After initial setup, the workflow is:
1. Make code changes locally
2. `git push` — GitHub Actions builds and deploys to Pages
3. Both the iPhone PWA and desktop Electron app load the updated code automatically
4. Only rebuild the desktop `.app` (`npm run install-app`) if `electron/main.cjs` or `electron-builder.json` changed

### 9. iPhone installation

1. Open the GitHub Pages URL in Safari
2. Tap Share > "Add to Home Screen"
3. The app appears as a standalone app with the PWA icon

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Vite dev server |
| `npm run electron:dev` | Electron + Vite dev |
| `npm run build` | Production build to `dist/` |
| `npm run install-app` | Build and install desktop .app |
| `git push` | Deploy to GitHub Pages (updates both platforms) |
