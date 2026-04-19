# Setup Firebase

## Kalau kamu lagi pusing — baca ini dulu (10 detik)

**Kamu boleh skip Firebase.** Situsnya tetap jalan.

1. Buka situs kamu (misalnya `http://localhost/catalog/dist/`).
2. Buka menu **Admin**.
3. Klik **Masuk mode demo admin**.

Selesai. Itu sudah cukup buat **ngetes**, nulis artikel, lihat tampilan — semua disimpan di **browser kamu** (bukan di cloud). **Nggak ada** `.env`, **nggak ada** Console Google, **nggak ada** yang harus diurus malam ini.

---

**Firebase cuma dibutuhkan kalau** kamu mau data tersimpan di internet (ganti HP / ganti laptop tetap sama), hosting serius, atau banyak pengunjung. Kalau belum butuh itu — **stop di mode demo**, nanti sambil tenang baru buka bagian bawah dokumen ini.

---

## Bagian bawah: Firebase (kalau sudah siap, ikuti urutan ini)

Kamu **tidak bisa** membuat project Firebase dari dalam folder kode ini. Yang dibuat di **browser** (Google) adalah project-nya; di folder ini kamu hanya **menempel konfigurasi** hasilnya.

---

## Langkah 1 — Buat project di Google

1. Buka **https://console.firebase.google.com/**
2. **Add project** → isi nama → lanjutkan sampai selesai (Google Analytics boleh dimatikan).

---

## Langkah 2 — Aktifkan layanan

Di sidebar project kamu:

| Menu | Yang dilakukan |
|------|----------------|
| **Build → Authentication** | Tab **Sign-in method** → aktifkan **Email/Password** |
| **Build → Firestore Database** | **Create database** → pilih lokasi → mulai (mode production atau test dulu, nanti ganti rules) |
| **Build → Storage** | **Get started** → selesaikan wizard |

---

## Langkah 3 — Ambil config untuk file `.env`

1. Klik ikon **roda gigi** → **Project settings**.
2. Scroll ke **Your apps** → **Add app** → pilih **Web** (`</>`).
3. Beri nama app → **Register app**.
4. Akan muncul objek `firebaseConfig` seperti ini:

```js
const firebaseConfig = {
  apiKey: "....",
  authDomain: "....",
  projectId: "....",
  storageBucket: "....",
  messagingSenderId: "....",
  appId: "...."
};
```

5. Buka file **`.env`** di folder project ini (`catalog` sejajar `package.json`).
6. Isi **tanpa tanda kutip** (atau pakai kutip, Vite tetap baca), contoh:

```env
VITE_FIREBASE_API_KEY=isi_dari_apiKey
VITE_FIREBASE_AUTH_DOMAIN=isi_dari_authDomain
VITE_FIREBASE_PROJECT_ID=isi_dari_projectId
VITE_FIREBASE_STORAGE_BUCKET=isi_dari_storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=isi_dari_messagingSenderId
VITE_FIREBASE_APP_ID=isi_dari_appId
```

7. Simpan file.

---

## Langkah 4 — Aturan keamanan (Firestore + Storage)

Di komputer (satu kali, dari folder project ini):

1. Edit **`.firebaserc`** → ganti `GANTI-DENGAN-PROJECT-ID-FIREBASE-KAMU` dengan **project ID** yang sama dengan `VITE_FIREBASE_PROJECT_ID` di `.env`.
2. Jalankan:

```bash
npx firebase-tools@13 login
npm run firebase:deploy-rules
```

(`npm run firebase:deploy-rules` memakai `npx firebase-tools` — tidak wajib install global.)

Atau dari **Firebase Console** → Firestore → **Rules** → tempel isi file **`firestore.rules`** di repo ini → **Publish**.  
Storage → **Rules** → tempel **`storage.rules`** → **Publish**.

---

## Langkah 5 — Buat akun admin

1. **Authentication → Users → Add user**  
   - Email: bentuk `namapengguna@catalog.invalid` (contoh: `admin@catalog.invalid`)  
   - Password: yang kamu mau  
2. Buka **Authentication → Users** → klik user itu → salin **User UID**.
3. **Firestore Database** → **Start collection** → id: **`users`**  
4. **Add document** → **Document ID** = **UID** yang tadi (tempel persis).  
5. Field tambahan:
   - `role` (string) = `admin`

---

## Langkah 6 — Jalankan ulang build / dev

- **XAMPP** (folder `dist/`):  
  `npm run build:xampp`  
  lalu buka lagi `http://localhost/catalog/dist/`

- **npm run dev**:  
  stop server (Ctrl+C) → `npm run dev` lagi.

---

## Kalau masih error

- Buka `/admin` → lihat daftar ✓/✗ variabel `VITE_FIREBASE_*`.
- Pastikan file bernama **`.env`**, bukan `.env.txt`.
- Pastikan nama variabel ada awalan **`VITE_`**.

Mode **demo admin** (tanpa Firebase) tetap ada di `/admin` untuk coba-coba dulu.

---

## Chatbot pakai Gemini (opsional, tidak wajib Firebase)

1. Buka **https://aistudio.google.com/apikey** (login pakai Google).
2. **Create API key** → salin key-nya (panjang, mulai huruf `AIza...`).
3. Di file **`.env`** di folder project, isi baris ini (tanpa spasi sebelum/sesudah `=`):

   ```env
   VITE_GEMINI_API_KEY=tempel_key_di_sini
   ```

4. Simpan `.env`, lalu:
   - **XAMPP / `dist/`:** jalankan lagi `npm run build:xampp` → refresh halaman.
   - **`npm run dev`:** stop server (Ctrl+C) → `npm run dev` lagi.

5. Buka situs → ikon chat pojok kanan bawah → tanya apa saja; jawaban sekarang dari **Gemini** (bukan FAQ lokal).

**Keamanan:** key ikut ke file JS di browser (siapa saja bisa lihat di DevTools). Di Google AI Studio / Cloud Console, **batasi key** (misalnya referrer / bundle) kalau dipakai publik. Jangan upload `.env` berisi key ke repo publik.
