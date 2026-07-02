(function () {
  const STORAGE_KEY = "revoraChatHistory";
  const MAX_HISTORY = 24;

  const pageContext = () => {
    const page = window.location.pathname.split("/").pop() || "index.html";
    const contexts = {
      "material-scan.html": {
        greeting:
          "Halo! Saya Rivo. Di sini saya bisa membantu membaca hasil scan material dan menentukan langkah terbaik berikutnya.",
        quick: ["Cara scan material", "Material bernilai", "Setelah scan apa?"],
      },
      "solutions.html": {
        greeting:
          "Halo! Saya bisa membantu memilih solusi Revora berdasarkan kebutuhan individu, komunitas, sekolah, bisnis, atau acara.",
        quick: ["Solusi untuk bisnis", "Solusi untuk sekolah", "Mulai dari mana?"],
      },
      "marketplace.html": {
        greeting:
          "Halo! Saya Rivo. Saya bisa membantu memilih layanan atau produk sirkular yang paling sesuai.",
        quick: ["Rekomendasi layanan", "Harga paket", "Cara kerja marketplace"],
      },
      "impact.html": {
        greeting:
          "Halo! Saya bisa menjelaskan cara Revora menghitung dampak material, emisi yang dihindari, dan Loop Points.",
        quick: ["Cara hitung dampak", "Apa itu Loop Points?", "Simulasi dampak"],
      },
      "partners.html": {
        greeting:
          "Halo! Saya bisa menjelaskan peran mitra Revora: pemilik material, collector, recycler, maker, dan collection point.",
        quick: ["Peran mitra", "Daftar sebagai mitra", "Cara jaringan bekerja"],
      },
      "learning.html": {
        greeting:
          "Halo! Saya bisa membantu menjelaskan konsep ekonomi sirkular, AI, IoT, big data, dan material bernilai.",
        quick: ["Apa itu material bernilai?", "Peran AI", "Cara dampak dihitung"],
      },
      "about.html": {
        greeting:
          "Halo! Saya bisa menjelaskan apa itu Revora, masalah yang diangkat, dan cara platform ini bekerja.",
        quick: ["Apa itu Revora?", "Masalah utama", "Coba alur Revora"],
      },
      "product-detail.html": {
        greeting:
          "Halo! Sedang mempertimbangkan Loop Pickup? Tanyakan paket, jadwal, atau proses pengangkutannya.",
        quick: ["Bandingkan paket", "Bagaimana pickup bekerja?", "Apa yang saya dapat?"],
      },
      "activity.html": {
        greeting:
          "Halo! Saya bisa membantu menjelaskan riwayat pembelian, pengangkutan, dan dampak akun Anda.",
        quick: ["Riwayat pembelian", "Cara hitung dampak", "Cari layanan baru"],
      },
      "login.html": {
        greeting:
          "Halo! Butuh bantuan masuk ke Revora atau ingin mengetahui manfaat membuat akun?",
        quick: ["Manfaat akun", "Lupa kata sandi", "Buat akun baru"],
      },
      "register.html": {
        greeting:
          "Halo! Saya bisa membantu menentukan jenis akun dan menjelaskan cara memulai bersama Revora.",
        quick: ["Akun individu", "Akun organisasi", "Apa itu Revora?"],
      },
    };

    return (
      contexts[page] || {
        greeting:
          "Halo! Saya Rivo, asisten virtual Revora. Tanyakan tentang pindai sampah, drop point, pickup, saldo, marketplace, atau edukasi.",
        quick: ["Apa itu Revora?", "Cari drop point", "Cara pesan pickup"],
      }
    );
  };

  const responses = [
    {
      keywords: ["halo", "hai", "hi", "selamat", "pagi", "siang", "sore"],
      text: "Halo! Senang bertemu dengan Anda. Saya bisa membantu menjelaskan Revora, memilih layanan, atau memandu proses pickup.",
    },
    {
      keywords: ["apa itu revora", "tentang revora", "revora itu"],
      text: "Revora membantu pengguna mengenali nilai sampah, memilih setor gratis atau pickup berbayar, menerima nilai material, lalu memantau saldo dan dampaknya.",
      action: { label: "Coba Pindai Sampah", href: "material-scan.html" },
    },
    {
      keywords: ["drop point", "setor", "lokasi", "titik terdekat", "bank sampah"],
      text: "Gunakan halaman Drop Point untuk mencari lokasi terdekat, melihat material yang diterima, jam buka, kapasitas, harga per kilogram, dan estimasi uang sebelum berangkat.",
      action: { label: "Cari Drop Point", href: "drop-point.html" },
    },
    {
      keywords: ["pickup", "jemput", "angkut", "pengangkutan", "cara pesan"],
      text: "Pilih pickup sekali jalan atau langganan bulanan, tentukan zona lokasi dan tanggal, lalu biaya angkut ditampilkan sebelum dikonfirmasi. Nilai material tetap masuk ke saldo Anda.",
      action: { label: "Lihat Loop Pickup", href: "product-detail.html" },
    },
    {
      keywords: ["harga", "biaya", "paket", "bandingkan"],
      text: "Pickup sekali jalan mulai IDR 28K untuk zona 0–5 km. Tersedia juga Langganan Rumah IDR 79K/bulan dan Langganan Usaha IDR 249K/bulan. Zona yang lebih jauh memiliki biaya tambahan.",
      action: { label: "Bandingkan paket", href: "product-detail.html" },
    },
    {
      keywords: ["scan", "pindai", "material", "sampah", "jenis barang"],
      text: "Pengenalan material berbasis AI membantu mengenali jenis dan kondisi material, kemudian menyarankan penggunaan ulang, perbaikan, penjualan, atau daur ulang sebagai langkah berikutnya.",
      action: { label: "Coba Pindai Sampah", href: "material-scan.html" },
    },
    {
      keywords: ["marketplace", "produk", "beli", "material pulih"],
      text: "Marketplace Revora berisi produk hasil olahan seperti perlengkapan rumah, aksesori, dan alat sekolah dari plastik, kertas, kaca, banner, atau tekstil pulih.",
      action: { label: "Buka Marketplace", href: "marketplace.html" },
    },
    {
      keywords: ["dampak", "emisi", "karbon", "hitung"],
      text: "Revora mencatat berat material, tujuan pemulihan, dan perjalanan pengangkutan. Data tersebut digunakan untuk membuat estimasi material pulih dan emisi yang dapat dihindari.",
      action: { label: "Buka halaman Dampak", href: "impact.html" },
    },
    {
      keywords: ["ai", "iot", "big data", "teknologi", "automasi"],
      text: "AI mengenali material dan estimasi nilainya. IoT membaca berat serta kapasitas drop point. Big Data membaca pola harga, volume wilayah, dan kebutuhan rute pickup. Manusia tetap memilah dan memverifikasi.",
      action: { label: "Lihat Edukasi", href: "learning.html" },
    },
    {
      keywords: ["akun individu", "individual"],
      text: "Akun individu cocok untuk memindai barang, mencari titik pengumpulan, memesan pickup, dan mengumpulkan Loop Points dari aksi sirkular.",
      action: { label: "Buat akun individu", href: "register.html" },
    },
    {
      keywords: ["akun organisasi", "bisnis", "perusahaan"],
      text: "Akun Mitra Bisnis digunakan untuk menetapkan harga material, mengelola kapasitas drop point, menerima setoran, dan mengambil permintaan pickup.",
      action: { label: "Lihat Mitra Bisnis", href: "partners.html" },
    },
    {
      keywords: ["lupa kata sandi", "password", "tidak bisa masuk"],
      text: "Pada prototipe ini, pemulihan kata sandi masih berupa simulasi. Untuk mencoba alurnya, Anda dapat kembali ke halaman masuk atau membuat akun baru.",
      action: { label: "Buka halaman masuk", href: "login.html" },
    },
    {
      keywords: ["riwayat", "pembelian", "transaksi"],
      text: "Dashboard menyatukan saldo material, transaksi setor, pickup, pembelian marketplace, hasil pemindaian, emisi yang dihindari, badge, dan streak.",
      action: { label: "Lihat Dashboard", href: "activity.html" },
    },
    {
      keywords: ["rekomendasi layanan", "layanan apa", "pilih layanan"],
      text: "Jika ingin gratis, setor sendiri ke Drop Point. Jika ingin praktis, gunakan Pickup sekali jalan atau langganan bulanan.",
      action: { label: "Bandingkan Jalur", href: "drop-point.html" },
    },
    {
      keywords: ["cara kerja marketplace"],
      text: "Marketplace menjual produk hasil olahan. Setiap kartu menampilkan material asal, dampak produk, harga, checkout, dan pengiriman simulasi.",
      action: { label: "Jelajahi marketplace", href: "marketplace.html" },
    },
    {
      keywords: ["solusi untuk bisnis", "bisnis", "kantor", "operasional"],
      text: "Mitra bisnis dapat menerima material, menetapkan harga per kilogram, mengelola kapasitas lokasi, mengambil permintaan pickup, dan menjual produk hasil olahan.",
      action: { label: "Buka Mitra Bisnis", href: "partners.html" },
    },
    {
      keywords: ["sekolah", "kampus", "edukasi"],
      text: "Siswa dapat mempelajari jenis sampah, cara memilah, perjalanan material, peran teknologi, lalu mengikuti kuis untuk mendapatkan skor dan badge.",
      action: { label: "Buka Edukasi", href: "learning.html" },
    },
    {
      keywords: ["loop points", "poin"],
      text: "Dashboard mencatat saldo material, total uang diterima, berat sampah terselamatkan, estimasi CO₂e, streak pemilahan, badge, dan Loop Points.",
      action: { label: "Buka Dashboard", href: "activity.html" },
    },
    {
      keywords: ["mitra", "partner", "recycler", "collector", "collection point"],
      text: "Mitra Revora berperan menjaga material tetap bergerak: collection point mengumpulkan, pickup partner mengangkut, recycler memulihkan, dan maker menggunakan ulang material.",
      action: { label: "Lihat Mitra", href: "partners.html" },
    },
    {
      keywords: ["belajar", "learning", "edukasi", "ekonomi sirkular"],
      text: "Pusat Edukasi berisi modul tentang plastik, kertas, logam, kaca, tekstil, e-waste, perjalanan daur ulang, serta kuis lima pertanyaan untuk siswa.",
      action: { label: "Buka Belajar", href: "learning.html" },
    },
  ];

  const fallbackResponses = [
    "Saya belum memahami pertanyaan itu sepenuhnya. Coba tanyakan tentang pickup, harga paket, material, teknologi, marketplace, atau dampak Revora.",
    "Untuk simulasi ini, saya paling siap membantu seputar layanan Revora. Anda bisa mencoba pertanyaan seperti “berapa harga pickup?” atau “bagaimana AI mengenali material?”",
    "Boleh dijelaskan dengan kata lain? Saya dapat membantu mengenai akun, pengangkutan, marketplace, material passport, dan laporan dampak.",
  ];

  const icons = {
    chat:
      '<svg class="icon-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-5a5 5 0 0 1-1-3V8a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    close:
      '<svg class="icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    bot:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="7" width="14" height="11" rx="4"/><path d="M12 3v4M9 12h.01M15 12h.01M9 15h6"/></svg>',
    reset:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6M4 4v5h5"/></svg>',
    panelClose:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    send:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8zM7 12h14"/></svg>',
  };

  const createWidget = () => {
    const context = pageContext();
    const wrapper = document.createElement("aside");
    wrapper.className = "revora-chat";
    wrapper.setAttribute("aria-label", "Rivo, asisten virtual Revora");
    wrapper.innerHTML = `
      <span class="revora-chat__tooltip"><strong>Butuh bantuan?</strong>Tanyakan material, pickup, atau layanan Revora.</span>
      <section class="revora-chat__panel" aria-label="Percakapan dengan Rivo" aria-hidden="true">
        <header class="revora-chat__head">
          <span class="revora-chat__avatar">${icons.bot}</span>
          <span class="revora-chat__identity"><strong>Rivo</strong><span>Asisten virtual · selalu aktif</span></span>
          <span class="revora-chat__head-actions">
            <button class="revora-chat__reset" type="button" aria-label="Mulai ulang percakapan">${icons.reset}</button>
            <button class="revora-chat__panel-close" type="button" aria-label="Tutup chatbot">${icons.panelClose}</button>
          </span>
        </header>
        <div class="revora-chat__messages" role="log" aria-live="polite" aria-relevant="additions">
          <span class="revora-chat__day">Percakapan hari ini</span>
        </div>
        <div class="revora-chat__quick" aria-label="Pertanyaan cepat"></div>
        <form class="revora-chat__composer">
          <textarea class="revora-chat__input" rows="1" maxlength="240" placeholder="Tulis pertanyaan Anda..." aria-label="Pesan untuk Rivo"></textarea>
          <button class="revora-chat__send" type="submit" aria-label="Kirim pesan" disabled>${icons.send}</button>
        </form>
        <p class="revora-chat__disclaimer">Rivo adalah simulasi chatbot dan tidak menggunakan data pribadi Anda.</p>
      </section>
      <button class="revora-chat__launcher" type="button" aria-label="Buka chatbot Rivo" aria-expanded="false">
        ${icons.chat}${icons.close}<span class="revora-chat__notification"></span>
      </button>
    `;
    document.body.appendChild(wrapper);

    return { wrapper, context };
  };

  const init = () => {
    if (document.querySelector(".revora-chat")) return;

    const { wrapper, context } = createWidget();
    const launcher = wrapper.querySelector(".revora-chat__launcher");
    const panel = wrapper.querySelector(".revora-chat__panel");
    const panelClose = wrapper.querySelector(".revora-chat__panel-close");
    const reset = wrapper.querySelector(".revora-chat__reset");
    const messages = wrapper.querySelector(".revora-chat__messages");
    const quick = wrapper.querySelector(".revora-chat__quick");
    const form = wrapper.querySelector(".revora-chat__composer");
    const input = wrapper.querySelector(".revora-chat__input");
    const send = wrapper.querySelector(".revora-chat__send");
    let history = [];
    let botIsTyping = false;

    const now = () =>
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());

    const saveHistory = () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(history.slice(-MAX_HISTORY)),
        );
      } catch (_) {
        // The widget still works when storage is unavailable.
      }
    };

    const loadHistory = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(stored) ? stored.slice(-MAX_HISTORY) : [];
      } catch (_) {
        return [];
      }
    };

    const scrollToLatest = () => {
      requestAnimationFrame(() => {
        messages.scrollTop = messages.scrollHeight;
      });
    };

    const renderMessage = (message, animate = true) => {
      const item = document.createElement("div");
      item.className = `revora-chat__message revora-chat__message--${message.role}`;
      if (!animate) item.style.animation = "none";

      if (message.role === "bot") {
        const avatar = document.createElement("span");
        avatar.className = "revora-chat__message-avatar";
        avatar.textContent = "R";
        item.appendChild(avatar);
      }

      const bubble = document.createElement("div");
      bubble.className = "revora-chat__bubble";
      const text = document.createElement("p");
      text.textContent = message.text;
      bubble.appendChild(text);

      if (message.action) {
        const link = document.createElement("a");
        link.href = message.action.href;
        link.textContent = `${message.action.label} →`;
        bubble.appendChild(link);
      }

      const time = document.createElement("span");
      time.className = "revora-chat__time";
      time.textContent = message.time || now();
      bubble.appendChild(time);
      item.appendChild(bubble);
      messages.appendChild(item);
      scrollToLatest();
    };

    const addMessage = (role, text, action) => {
      const message = { role, text, action, time: now() };
      history.push(message);
      history = history.slice(-MAX_HISTORY);
      renderMessage(message);
      saveHistory();
    };

    const showTyping = () => {
      const item = document.createElement("div");
      item.className =
        "revora-chat__message revora-chat__message--bot revora-chat__typing-row";
      item.innerHTML =
        '<span class="revora-chat__message-avatar">R</span><span class="revora-chat__bubble revora-chat__typing"><i></i><i></i><i></i></span>';
      messages.appendChild(item);
      scrollToLatest();
      return item;
    };

    const findResponse = (value) => {
      const normalized = value.toLowerCase().trim();
      const match = responses.find((response) =>
        response.keywords.some((keyword) => normalized.includes(keyword)),
      );
      if (match) return match;
      const index = Math.abs(
        [...normalized].reduce((total, character) => total + character.charCodeAt(0), 0),
      ) % fallbackResponses.length;
      return { text: fallbackResponses[index] };
    };

    const answer = (value) => {
      if (botIsTyping) return;
      botIsTyping = true;
      const typing = showTyping();
      const response = findResponse(value);
      const delay = Math.min(1150, 520 + response.text.length * 3);

      window.setTimeout(() => {
        typing.remove();
        addMessage("bot", response.text, response.action);
        botIsTyping = false;
        send.disabled = !input.value.trim();
      }, delay);
    };

    const sendMessage = (value) => {
      const text = value.trim();
      if (!text || botIsTyping) return;
      addMessage("user", text);
      input.value = "";
      input.style.height = "";
      send.disabled = true;
      answer(text);
    };

    const setQuickReplies = () => {
      quick.innerHTML = "";
      context.quick.forEach((label) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", () => sendMessage(label));
        quick.appendChild(button);
      });
    };

    const resetConversation = () => {
      history = [];
      messages
        .querySelectorAll(".revora-chat__message")
        .forEach((message) => message.remove());
      localStorage.removeItem(STORAGE_KEY);
      addMessage("bot", context.greeting);
      setQuickReplies();
    };

    const setOpen = (open) => {
      wrapper.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      launcher.setAttribute("aria-expanded", String(open));
      launcher.setAttribute(
        "aria-label",
        open ? "Tutup chatbot Rivo" : "Buka chatbot Rivo",
      );
      if (open) {
        wrapper.classList.remove("show-tooltip");
        window.setTimeout(() => input.focus(), 220);
        scrollToLatest();
      }
    };

    launcher.addEventListener("click", () =>
      setOpen(!wrapper.classList.contains("is-open")),
    );
    panelClose.addEventListener("click", () => setOpen(false));
    reset.addEventListener("click", resetConversation);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });
    input.addEventListener("input", () => {
      send.disabled = !input.value.trim() || botIsTyping;
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(input.value);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && wrapper.classList.contains("is-open")) {
        setOpen(false);
        launcher.focus();
      }
    });

    history = loadHistory();
    if (history.length) {
      history.forEach((message) => renderMessage(message, false));
    } else {
      addMessage("bot", context.greeting);
    }
    setQuickReplies();

    window.setTimeout(() => wrapper.classList.add("show-tooltip"), 1700);
    window.setTimeout(() => wrapper.classList.remove("show-tooltip"), 7200);

    if (new URLSearchParams(window.location.search).get("chat") === "open") {
      setOpen(true);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
