/** Sample content when Firebase belum dikonfigurasi — gambar pakai picsum.photos (lebih andal di localhost/XAMPP). */
export const SAMPLE_ARTICLES = [
  {
    id: 'sample-1',
    title: 'Edge AI & On-Device Inference',
    content:
      '<p><strong>Edge AI</strong> memindahkan inferensi model ke perangkat lokal untuk latensi rendah dan privasi lebih baik.</p><p>Gunakan format <em>INT8</em> quantization dan pipeline CI untuk validasi model sebelum rilis.</p>',
    image: 'https://picsum.photos/id/96/1200/800',
    category: 'AI',
    author: 'IT Catalog',
    tags: ['AI', 'Hardware'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    views: 1840,
    likes: 42,
  },
  {
    id: 'sample-2',
    title: 'TypeScript Patterns untuk Skala Besar',
    content:
      '<p>Polanya sederhana: boundary types, discriminated unions, dan modul feature-based.</p><p>Hindari <code>any</code> di boundary API — gunakan schema validation.</p>',
    image: 'https://picsum.photos/id/180/1200/800',
    category: 'Programming',
    author: 'IT Catalog',
    tags: ['TypeScript', 'Architecture'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    views: 960,
    likes: 28,
  },
  {
    id: 'sample-3',
    title: 'Zero Trust di Jaringan Modern',
    content:
      '<p>Zero Trust bukan produk tunggal, melainkan prinsip verifikasi berkelanjutan.</p><ul><li>Identity-aware proxy</li><li>Device posture</li><li>Least privilege</li></ul>',
    image: 'https://picsum.photos/id/48/1200/800',
    category: 'Cyber Security',
    author: 'IT Catalog',
    tags: ['Security', 'Network'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 1, nanoseconds: 0 },
    views: 1420,
    likes: 55,
  },
  {
    id: 'sample-4',
    title: 'Gadget Flagship 2026: Efisiensi vs Performa',
    content:
      '<p>SoC generasi baru fokus ke NPU dan ISP untuk kamera computational.</p><p>Baterai dan thermal design tetap jadi bottleneck nyata.</p>',
    image: 'https://picsum.photos/id/3/1200/800',
    category: 'Gadget',
    author: 'IT Catalog',
    tags: ['Mobile', 'Review'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 * 6, nanoseconds: 0 },
    views: 720,
    likes: 19,
  },
  {
    id: 'sample-5',
    title: 'Pitch Deck untuk Startup Deep Tech',
    content:
      '<p>Investor ingin melihat defensibility: IP, data flywheel, atau distribusi unik.</p><p>Tetap ringkas: masalah → solusi → traction → ask.</p>',
    image: 'https://picsum.photos/id/119/1200/800',
    category: 'Startup',
    author: 'IT Catalog',
    tags: ['Startup', 'VC'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 },
    views: 540,
    likes: 12,
  },
]

export const CATEGORIES = [
  { id: 'AI', label: 'AI', icon: 'cpu' },
  { id: 'Programming', label: 'Programming', icon: 'code' },
  { id: 'Gadget', label: 'Gadget', icon: 'device' },
  { id: 'Cyber Security', label: 'Cyber Security', icon: 'shield' },
  { id: 'Startup', label: 'Startup', icon: 'rocket' },
]
