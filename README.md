# IT Tech Catalog

Katalog artikel teknologi (React + Vite + Firebase) tanpa PHP/SQL.

## Menjalankan lokal

1. Install Node.js 20+
2. `npm install`
3. Salin `.env.example` → `.env`
4. `npm run dev` → buka **http://localhost:5173**

Tanpa Firebase di `.env`, artikel disimpan di localStorage browser.

### Lewat XAMPP

1. `npm run build:xampp`
2. Buka **http://localhost/catalog/dist/**

> Buka `http://localhost/catalog/` saja tidak akan jalan — harus lewat folder `dist/` hasil build.

## Admin

- URL: `/admin`
- Login: username & password dari `.env` (default `admin` / `admin`)

## Firebase (opsional)

Panduan: **[SETUP-FIREBASE.md](./SETUP-FIREBASE.md)**

File terkait: `firebase.json`, `firestore.rules`, `storage.rules`

## Chatbot

- Tanpa API key: jawaban lokal
- Dengan Gemini: isi `VITE_GEMINI_API_KEY` di `.env`, lalu build/dev ulang

## GitHub Pages

1. Edit URL di `src/config/siteLinks.js`
2. Samakan `GITHUB_PAGES_BASE_PATH` dengan `VITE_BASE_PATH` di `.github/workflows/github-pages.yml`
3. Source Pages: **GitHub Actions**

Build lokal untuk Pages:

```bash
# CMD
set VITE_BASE_PATH=/catalog-it/
npm run build

# PowerShell
$env:VITE_BASE_PATH='/catalog-it/'; npm run build
```

## Struktur

`src/components`, `src/pages`, `src/services`, `src/context`, `src/styles`, `src/utils`, `src/data`, `src/config`
