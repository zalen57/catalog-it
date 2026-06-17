# Setup Firebase (opsional)

Firebase **tidak wajib**. Aplikasi sudah bisa dipakai penuh tanpa Firebase — artikel disimpan di browser (localStorage), login admin lewat kredensial di `.env`.

Firebase baru dibutuhkan jika kamu ingin data artikel tersimpan di cloud (bisa diakses dari perangkat lain) dan siap untuk deployment publik.

---

## Menjalankan tanpa Firebase

1. Salin `.env.example` → `.env` (isi `VITE_ADMIN_USERNAME` dan `VITE_ADMIN_PASSWORD` sesuai keinginan).
2. Jalankan `npm install`, lalu `npm run dev` → buka **http://localhost:5173**
3. Atau untuk XAMPP: `npm run build:xampp` → buka **http://localhost/catalog/dist/**
4. Buka **/admin** → masuk dengan username dan password dari `.env` (default: `admin` / `admin`).

Artikel yang ditambah atau diubah tersimpan di **localStorage** browser.

---

## Setup Firebase (jika sudah siap)

Konfigurasi Firebase dibuat di **Firebase Console** (browser). Di folder project ini kamu hanya menempelkan hasil konfigurasi ke file `.env`.

### Langkah 1 — Buat project

1. Buka **https://console.firebase.google.com/**
2. **Add project** → isi nama → selesaikan wizard (Google Analytics boleh dimatikan).

### Langkah 2 — Aktifkan layanan

| Menu | Tindakan |
|------|----------|
| **Build → Firestore Database** | **Create database** → pilih lokasi → mulai |
| **Build → Storage** | **Get started** → selesaikan wizard |

Authentication tidak wajib — login admin diatur di aplikasi lewat `.env`.

### Langkah 3 — Ambil config ke `.env`

1. **Project settings** (ikon roda gigi) → **Your apps** → **Add app** → **Web** (`</>`).
2. Salin nilai dari objek `firebaseConfig`.
3. Isi di file **`.env`** (sejajar `package.json`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Simpan file.

### Langkah 4 — Deploy aturan keamanan

Buat file **`.firebaserc`** di root project:

```json
{
  "projects": {
    "default": "PROJECT_ID_KAMU"
  }
}
```

Ganti `PROJECT_ID_KAMU` dengan nilai `VITE_FIREBASE_PROJECT_ID` di `.env`.

Lalu jalankan dari folder project:

```bash
npx firebase-tools@13 login
npm run firebase:deploy-rules
```

Atau tempel manual di Console: **Firestore → Rules** (isi `firestore.rules`) dan **Storage → Rules** (isi `storage.rules`), lalu **Publish**.

### Langkah 5 — Build ulang

- XAMPP: `npm run build:xampp` → refresh **http://localhost/catalog/dist/**
- Dev: stop server → `npm run dev`

Login admin tetap memakai **username/password dari `.env`**, bukan akun Firebase.

---

## Chatbot Gemini (opsional)

1. Buat API key di **https://aistudio.google.com/apikey**
2. Tambahkan di `.env`:

```env
VITE_GEMINI_API_KEY=...
VITE_GEMINI_MODEL=gemini-2.5-flash
```

3. Build ulang (`npm run build:xampp` atau restart `npm run dev`).

Tanpa key, chatbot memakai jawaban lokal (tanpa panggilan API).

**Keamanan:** key ikut ke bundle JavaScript di browser. Batasi key di Google AI Studio (HTTP referrer) dan jangan commit file `.env`.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Layar putih di XAMPP | Buka `/catalog/dist/`, bukan `/catalog/` saja. Pastikan sudah `npm run build:xampp`. |
| Login admin gagal | Cek `VITE_ADMIN_USERNAME` dan `VITE_ADMIN_PASSWORD` di `.env`, lalu build ulang. |
| Variabel Firebase tidak terbaca | File harus bernama `.env` (bukan `.env.txt`), variabel pakai awalan `VITE_`. |
| Perubahan `.env` tidak muncul | Restart `npm run dev` atau jalankan ulang `npm run build:xampp`. |
