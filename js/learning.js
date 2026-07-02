document.addEventListener("DOMContentLoaded", () => {
  const lessons = {
    plastic: {
      number: "Class 01",
      kicker: "Material Basics",
      title: "Plastik dan Kode Resin",
      summary: "Kenali PET, HDPE, dan PP serta kondisi yang menentukan apakah plastik masih bernilai.",
      lead: "Tidak semua plastik memiliki komposisi dan jalur pemulihan yang sama. Kode resin membantu kita membuat keputusan awal sebelum material disetor.",
      sections: [
        ["Mulai dari simbol, lalu periksa kondisinya", "Cari angka pada kemasan: 1 untuk PET, 2 untuk HDPE, dan 5 untuk PP. Setelah itu, pastikan kemasan kosong, kering, dan tidak tercampur sisa makanan."],
        ["Nilai ditentukan oleh kualitas batch", "Plastik yang bersih dan dipisahkan berdasarkan jenis lebih mudah diproses. Tutup, label, dan warna tertentu dapat dipisahkan sesuai aturan drop point tujuan."],
        ["Pilih jalur berdasarkan volume", "Untuk jumlah kecil, gunakan drop point gratis. Untuk volume besar atau rutin, pickup dapat menghemat waktu meskipun memiliki biaya pengangkutan."]
      ],
      note: "Kode resin mengenali bahan; kebersihan dan pemilahan mempertahankan nilainya."
    },
    paper: {
      number: "Class 02",
      kicker: "Everyday Materials",
      title: "Kertas, Logam, dan Kaca",
      summary: "Pelajari standar kebersihan dan penyimpanan material rumah tangga yang paling umum.",
      lead: "Tiga material ini punya nilai pemulihan tinggi, tetapi air, minyak, dan pecahan yang tidak dikemas aman dapat menurunkan kualitas atau membahayakan petugas.",
      sections: [
        ["Jaga kertas tetap kering", "Lipat kardus dan pisahkan bagian yang terkena minyak. Serat basah melemah dan dapat mencemari satu batch kertas."],
        ["Kosongkan logam sebelum disimpan", "Bilas kaleng minuman, keringkan, lalu pipihkan jika aman. Pisahkan aluminium dari logam campuran bila memungkinkan."],
        ["Kemas kaca dengan aman", "Pisahkan berdasarkan warna jika diminta mitra. Pecahan harus ditempatkan dalam wadah kuat dan diberi tanda agar aman saat ditangani."]
      ],
      note: "Kering, kosong, dan aman ditangani adalah tiga standar dasar sebelum setor."
    },
    special: {
      number: "Class 03",
      kicker: "Special Handling",
      title: "Tekstil dan E-Waste",
      summary: "Tentukan kapan barang digunakan ulang, diperbaiki, atau masuk ke jalur pengolahan khusus.",
      lead: "Tekstil dan perangkat elektronik tidak boleh diperlakukan seperti kemasan biasa. Keduanya menyimpan nilai guna, sekaligus risiko jika dibongkar tanpa prosedur.",
      sections: [
        ["Utamakan guna ulang", "Pakaian layak pakai sebaiknya dibersihkan dan disalurkan untuk reuse. Potongan kain bersih dapat dipisahkan berdasarkan bahan untuk kebutuhan maker."],
        ["Pisahkan baterai dengan hati-hati", "Matikan perangkat, keluarkan baterai jika dirancang untuk dilepas, dan jangan menusuk atau membongkar komponen sendiri."],
        ["Gunakan mitra khusus", "E-waste mengandung komponen bernilai sekaligus bahan berbahaya. Pilih drop point yang secara eksplisit menerima elektronik."]
      ],
      note: "Untuk barang kompleks, reuse dan perbaikan selalu diperiksa sebelum daur ulang."
    },
    journey: {
      number: "Class 04",
      kicker: "Circular Journey",
      title: "Dari Sampah ke Produk",
      summary: "Ikuti bagaimana material tercatat, diolah, dan kembali sebagai produk yang dapat digunakan.",
      lead: "Ekonomi sirkular bukan berhenti pada pengumpulan. Nilai baru terbentuk ketika material dapat dilacak sampai pengolah dan kembali ke pasar sebagai produk.",
      sections: [
        ["Pengumpulan membentuk batch", "Setoran dari banyak pengguna ditimbang, diperiksa, lalu dikelompokkan agar volumenya layak diproses."],
        ["Pengolah mengubah bentuk material", "Plastik dapat dicacah dan dipres, kertas dipulp, logam dilebur, sementara kaca dibersihkan untuk reuse atau menjadi cullet."],
        ["Produk membawa cerita material", "Marketplace Revora menunjukkan asal material dan dampak pemulihan agar pembeli memahami apa yang mereka dukung."]
      ],
      note: "Material baru benar-benar kembali ke siklus ketika memiliki penggunaan berikutnya."
    }
  };

  const key = new URLSearchParams(window.location.search).get("lesson") || "plastic";
  const lesson = lessons[key] || lessons.plastic;
  document.title = `${lesson.title} — Revora`;
  document.querySelector(".js-lesson-number").textContent = lesson.number;
  document.querySelector(".js-lesson-kicker").textContent = lesson.kicker;
  document.querySelector(".js-lesson-title").textContent = lesson.title;
  document.querySelector(".js-lesson-summary").textContent = lesson.summary;
  document.querySelector(".js-lesson-lead").textContent = lesson.lead;
  document.querySelector(".js-lesson-note").textContent = lesson.note;
  document.querySelector(".js-lesson-article").innerHTML = lesson.sections
    .map(([title, text]) => `<section><h2>${title}</h2><p>${text}</p></section>`)
    .join("");

  const video = document.querySelector(".js-lesson-video");
  const toggleVideo = () => video.classList.toggle("is-playing");
  video.addEventListener("click", toggleVideo);
  video.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleVideo();
    }
  });
});
