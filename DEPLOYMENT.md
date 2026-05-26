# Affordit Deployment

Affordit is a static Vite app. The production artifact is the `dist` folder created by:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run build
```

## Recommended Hosting

This project is configured to deploy with the same pattern used for the Auto Parts tracker: GitHub plus Render. Because Affordit is a static Vite app, Render can host it as a Static Site.

1. Push this folder to a GitHub repository.
2. In Render, create a new Blueprint from the GitHub repository.
3. Render will detect `render.yaml` and create a Static Site with:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Node version: `24`

Alternative static hosts also work:

- Vercel: framework preset `Vite`, build command `npm run build`, output directory `dist`.
- Netlify: build command `npm run build`, publish directory `dist`.
- Cloudflare Pages: framework preset `Vite`, build command `npm run build`, output directory `dist`.

## Local Production Preview

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run preview
```

For phone testing on the same Wi-Fi:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run preview:lan
```

## Before Launch

- Replace prototype data with real user data or API integration.
- Add authentication if accounts are required.
- Add persistence for budgets, expenses, plans, and verdict history.
- Add a privacy policy and terms page before collecting personal financial data.
- Treat Affordit as budgeting guidance, not regulated financial advice.
