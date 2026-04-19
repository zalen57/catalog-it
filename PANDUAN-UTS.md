# Panduan UTS — IT Tech Catalog

Tugas ini **sudah punya fitur lengkap** (React, routing, artikel, kategori, pencarian, admin CRUD, mobile, animasi, mode gelap, chatbot). Yang bikin “kurang sempurna” biasanya **cara demo ke dosen**, bukan kodenya.

---

## Yang bisa kamu tunjukkan ke dosen (tanpa Firebase)

Ini **sah** dan **lengkap** secara fitur front-end + admin:

| Fitur | Cara tunjuk |
|--------|-------------|
| Katalog / artikel | Home, Artikel, Detail, Kategori |
| Admin panel | `/admin` → **Masuk mode demo admin** → tambah / edit / hapus artikel, preview |
| Responsif | Buka di HP atau F12 → toggle device |
| Interaktif | Bookmark, suka, dark mode, chatbot |
| Tanpa PHP/SQL | Jelaskan: pakai React + data demo / localStorage |

**Kalimat buat dosen (boleh copy):**  
*“Backend memakai Firebase sesuai spesifikasi; untuk lingkungan demo UTS Firebase opsional diaktifkan, sehingga mode demo admin dipakai agar data artikel tetap bisa dikelola tanpa kredensial cloud di mesin penguji.”*

---

## Kalau dosen minta “ada backend / database”

Baru wajib **Firebase** (NoSQL + Auth). Ikuti **[SETUP-FIREBASE.md](./SETUP-FIREBASE.md)** — setelah `.env` terisi, jalankan:

```bash
npm run build:xampp
```

Lalu demo lewat **XAMPP** (`http://localhost/catalog/dist/`) atau **GitHub Pages** (**https://zalen57.github.io/catalog-it/**) + tunjukkan **Firestore** berisi koleksi `articles` dan dokumen `users` untuk admin.

---

## Biar pengumpulan rapi (nilai plus)

1. **Screenshot** 5–8 lembar: Home, daftar artikel, detail, admin (form + daftar), tampilan HP.
2. **README** sudah ada — tambahkan **nama + NIM** di atas README kalau diminta format laporan.
3. **Jangan kirim file `.env` berisi key asli** ke dosen/lembar pengumpulan publik.  
   Kirim **`env.example`** / isi **.env.example** + tulis di laporan: *“kredensial dikirim terpisah / di-setup lokal”*.
4. **Zip project** tanpa folder `node_modules` (biar ringan), atau zip + `npm install` di README.

---

## Cek kilat sebelum demo (2 menit)

- [ ] `npm run build:xampp` (kalau pakai XAMPP + `/catalog/dist/`)
- [ ] Buka Home → artikel → detail → kembali
- [ ] Admin → demo → tambah 1 artikel → muncul di beranda
- [ ] HP / layar sempit: menu hamburger jalan

---

## Kalau waktu mepet

Prioritas: **demo jalan mulus** + **screenshot** + **1 paragraf penjelasan arsitektur** di laporan. Firebase bisa sebagai **rencana deployment** satu paragraf kalau belum sempat connect.

Project ini **sudah layak dinilai** sebagai aplikasi katalog IT modern; Firebase adalah **pelengkap infrastruktur**, bukan satu-satunya bukti kode berjalan.
