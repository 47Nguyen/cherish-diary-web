
## Fix: SPA Routing on Render

### The Problem

This app is a React SPA (Single Page Application). All routing (`/girl`, `/boy`, etc.) is handled by React Router **in the browser**. When you:

1. Start from `/` and click a link → React Router navigates client-side. Works fine.
2. Paste `/girl` directly into a new tab → The browser asks Render's server for a file at `/girl`. No such file exists, so Render returns a 404 or blank page.

### The Fix

Render supports a `_redirects` file (placed in the `public/` folder, which Vite copies to the build output). This file tells Render: "For any URL that doesn't match a real file, serve `index.html` instead." React Router then reads the URL and shows the correct page.

### Files to Create

**`public/_redirects`** (one line):
```
/* /index.html 200
```

This single line means:
- `/*` → match any URL path
- `/index.html` → serve the app's entry HTML file
- `200` → return a 200 OK status (not a redirect), so the URL stays as `/girl` in the browser

### Why This Works

```text
User pastes: https://your-site.onrender.com/girl
       ↓
Render server checks: does /girl exist as a file? No.
       ↓
Render reads _redirects: /* → /index.html (200)
       ↓
Serves index.html to the browser
       ↓
React Router reads the URL path (/girl)
       ↓
Renders the correct CouplesPage with role="girl" ✓
```

### No Other Changes Needed

- No changes to `vite.config.ts`, `App.tsx`, or any React code.
- This is purely a hosting configuration file that Render reads automatically.
- The `public/` folder is the correct location — Vite copies everything in `public/` directly to the build output (`dist/`) during deployment.

### After This Fix

Both of these will work correctly when pasted directly into a browser:
- `https://this-is-for-you-rcsb.onrender.com/girl` → Her side 🌸
- `https://this-is-for-you-rcsb.onrender.com/boy` → His side 💙
