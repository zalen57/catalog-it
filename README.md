# IT Tech Catalog

Katalog artikel teknologi (React + Vite + Firebase) tanpa PHP/SQL. UI biru / abu gelap, background full-image, ikon SVG (react-icons), animasi Framer Motion, mode gelap, bookmark & suka, chatbot (Gemini opsional + fallback lokal).

**Live (GitHub Pages):** [https://zalen57.github.io/catalog-it/](https://zalen57.github.io/catalog-it/) · **Repo:** [github.com/zalen57/catalog-it](https://github.com/zalen57/catalog-it)

**Pusing setup Firebase?** Ikuti saja file **[SETUP-FIREBASE.md](./SETUP-FIREBASE.md)** (langkah 1 → 6, berurutan).

**Untuk UTS / tugas:** baca **[PANDUAN-UTS.md](./PANDUAN-UTS.md)** — apa yang dianggap lengkap, demo ke dosen tanpa Firebase, dan kapan Firebase wajib.

## Menjalankan lokal

1. Install Node.js 20+.
2. `npm install`
3. Salin `.env.example` → `.env` dan isi variabel Firebase bila ingin data + admin nyata.
4. **`npm run dev`** lalu buka **http://localhost:5173** (ini server Vite, bukan Apache).

Tanpa `.env`, aplikasi memakai artikel demo di memori (aman untuk GitHub).

### Lewat XAMPP (nama folder / Apache)

Ini **bukan** PHP: membuka **http://localhost/catalog/** saja **tidak akan jalan** kalau belum di-build, karena Apache tidak memproses `src/*.jsx`.

1. Pastikan modul **rewrite** aktif di XAMPP (`httpd.conf`: `LoadModule rewrite_module`, dan untuk folder `htdocs` pakai `AllowOverride All`).
2. Di folder project jalankan: **`npm run build:xampp`**
3. Buka browser: **http://localhost/catalog/dist/**

File statis ada di folder **`dist/`** (path penuh: `htdocs/catalog/dist/`). Setelah tiap perubahan kode, jalankan lagi `npm run build:xampp` lalu refresh halaman.

Opsional: **`npm run dev:xampp`** untuk mode develop dengan alamat seperti **http://localhost:5173/catalog/dist/** (tetap pakai port Vite).

Layout **responsif** (desktop & HP): menu hamburger di layar sempit, grid artikel satu kolom, tombol lebar nyaman disentuh, chat & area aman untuk notch (`safe-area`).

**Admin tanpa Firebase:** di `/admin` pilih **Masuk mode demo admin** — panel jalan, artikel tersimpan di **localStorage** browser (untuk coba XAMPP/HP). Untuk produksi, isi `.env` + Firebase seperti di atas.

## Firebase

Ringkasnya ada di **[SETUP-FIREBASE.md](./SETUP-FIREBASE.md)**. Di repo ini juga sudah ada **`firebase.json`** + **`firestore.rules`** + **`storage.rules`** + template **`.firebaserc`** (ganti `default` dengan **project ID** kamu) untuk `firebase deploy --only firestore:rules,storage`.

1. Buat project Firebase, aktifkan **Authentication** (Email/Password), **Firestore**, **Storage**, **Hosting** (opsional).
2. Tambahkan Web App dan salin config ke `.env` dengan prefix `VITE_`.
3. Deploy rules: `firestore.rules` dan `storage.rules` (sesuaikan `(default)` database jika perlu).
4. **Login admin pakai kolom User** (bukan Gmail): di aplikasi hanya isi **User** (mis. `admin`) + password. Di
   Firebase Authentication → Add user, isi **Email** = `user@DOMAIN` dengan DOMAIN default **`catalog.invalid`**
   (bisa diubah di `.env` dengan `VITE_AUTH_EMAIL_DOMAIN`). Contoh: User `admin` → Email `admin@catalog.invalid`.
   Firebase tetap menyimpan identitas sebagai alamat email di sisi mereka (wajib ada `@` di Firebase); Anda tidak
   perlu memakai Gmail. **Password** di-hash oleh Firebase di server, bukan disimpan teks di Firestore project ini.

5. Buat dokumen admin di Firestore:

- Collection `users`, document ID = **UID** pengguna tersebut.
- Field: `role` (string) = `admin` (opsional: `displayName` untuk nama penulis artikel).

## Chatbot AI

- Tanpa key: jawaban heuristik IT (tanpa panggilan eksternal).
- Dengan key: set `VITE_GEMINI_API_KEY` di `.env`. Di Google AI Studio / Cloud Console, **batasi key** (HTTP referrer / bundle ID) karena key klien tetap bisa diekstrak dari build statis.

## GitHub Pages

1. Repo **Settings → Pages → Build and deployment → Source** harus **GitHub Actions** (bukan *Deploy from a branch*). Kalau pakai branch/root, yang dilayani adalah `index.html` sumber (`/src/main.jsx`) → **layar putih**.
2. Setelah Source = Actions, tab **Actions** → jalankan workflow *Deploy to GitHub Pages* (atau push ke `main`). Tunggu hijau, lalu buka **https://zalen57.github.io/catalog-it/**.
3. Di `.github/workflows/github-pages.yml`, `VITE_BASE_PATH` harus `/nama-repo/`. Repo ini: **`/catalog-it/`** untuk `https://zalen57.github.io/catalog-it/`.
4. Untuk Firebase di Pages: **Settings → Secrets and variables → Actions** → Repository secrets `VITE_FIREBASE_*` (sama seperti `.env` lokal).

**Cek cepat kalau putih:** View Page Source — harus ada skrip ke `/catalog-it/assets/index-….js`, **bukan** `/src/main.jsx`.

Perintah lokal build (ganti path sesuai nama repo):

```bash
set VITE_BASE_PATH=/catalog-it/
npm run build
```

(PowerShell: `$env:VITE_BASE_PATH='/catalog-it/'; npm run build`)

## Struktur

`src/components`, `src/pages`, `src/services`, `src/styles`, `src/context` sesuai spesifikasi proyek.
