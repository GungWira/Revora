document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isAuthenticated = localStorage.getItem("revoraAuth") === "true";

  if (currentPage === "activity.html" && !isAuthenticated) {
    window.location.replace("login.html?redirect=activity.html");
    return;
  }

  const navigationItems = [
    { href: "material-scan.html", label: "Pindai Sampah" },
    { href: "drop-point.html", label: "Drop Point" },
    { href: "product-detail.html", label: "Pickup" },
    { href: "marketplace.html", label: "Marketplace" },
    { href: "learning.html", label: "Edukasi" },
  ];
  if (isAuthenticated) {
    navigationItems.push({ href: "activity.html", label: "Dashboard" });
  }
  const innerNavigation = document.querySelector(".inner-nav__links");
  if (innerNavigation) {
    innerNavigation.innerHTML = navigationItems
      .map(
        (item) => {
          const isActive =
            item.href === currentPage ||
            (["quiz.html", "learning-detail.html"].includes(currentPage) &&
              item.href === "learning.html");
          return `<a${isActive ? ' class="is-active"' : ""} href="${item.href}">${item.label}</a>`;
        },
      )
      .join("");
  }
  const innerActions = document.querySelector(".inner-nav__actions");
  if (innerActions) {
    innerActions.innerHTML = isAuthenticated
      ? `<a class="account-chip" href="activity.html"><span>Dashboard</span><i>AR</i></a>`
      : `<a class="button button--dark button--small" href="register.html">Bergabung</a>`;
  }
  const footerNavigation = document.querySelector(".footer__nav");
  if (footerNavigation) {
    footerNavigation.innerHTML = `
      <div><strong>Mulai</strong><a href="material-scan.html">Pindai Sampah</a><a href="drop-point.html">Drop Point</a><a href="product-detail.html">Pickup</a>${isAuthenticated ? '<a href="activity.html">Dashboard</a>' : ""}</div>
      <div><strong>Jelajahi</strong><a href="marketplace.html">Marketplace</a><a href="learning.html">Edukasi</a><a href="quiz.html">Kuis</a><a href="impact.html">Dampak</a></div>
      <div><strong>Revora</strong><a href="partners.html">Mitra Bisnis</a><a href="about.html">Tentang</a><a href="register.html">Bergabung</a></div>
    `;
  }

  const innerHeader = document.querySelector(".inner-header");
  const innerMenuToggle = document.querySelector(".inner-menu-toggle");
  innerMenuToggle?.addEventListener("click", () => {
    const open = innerHeader.classList.toggle("is-menu-open");
    innerMenuToggle.setAttribute("aria-expanded", String(open));
    innerMenuToggle.setAttribute(
      "aria-label",
      open ? "Tutup navigasi" : "Buka navigasi",
    );
  });

  document.querySelectorAll(".inner-nav__links a").forEach((link) => {
    link.addEventListener("click", () => {
      innerHeader?.classList.remove("is-menu-open");
    });
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("Rp", "IDR ");

  document.querySelectorAll(".save-button, .product-save").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-saved");
      button.setAttribute(
        "aria-label",
        button.classList.contains("is-saved") ? "Hapus dari simpanan" : "Simpan item",
      );
    });
  });

  const scanData = {
    plastic: {
      title: "Botol plastik PET terdeteksi bernilai.",
      label: "Botol PET",
      clean:
        "Material cocok untuk pickup terjadwal. Jaga tetap kering dan pisahkan dari plastik berwarna untuk meningkatkan nilai pemulihan.",
      mixed:
        "Material masih bernilai, tetapi perlu dipilah ulang agar tidak menurunkan kualitas batch pemulihan.",
      dirty:
        "Material perlu dibersihkan lebih dulu. Kondisi basah membuat nilai turun dan berisiko ditolak mitra.",
      base: 3000,
      action: "Jadwalkan pickup",
      next: "Gunakan Loop Pickup atau cari mitra terdekat di marketplace.",
    },
    paper: {
      title: "Kardus dan kertas bersih siap dipulihkan.",
      label: "Serat kertas",
      clean:
        "Kertas bersih memiliki peluang pemulihan tinggi. Lipat kardus agar volume lebih efisien saat pengangkutan.",
      mixed:
        "Pisahkan kertas dari plastik laminasi dan sisa makanan sebelum dikirim ke mitra.",
      dirty:
        "Kertas basah sulit dipulihkan. Prioritaskan pengeringan atau pisahkan sebagai residu rendah nilai.",
      base: 1800,
      action: "Kumpulkan batch",
      next: "Gabungkan hingga volume cukup, lalu jadwalkan pengangkutan komunitas.",
    },
    metal: {
      title: "Kaleng aluminium punya nilai pemulihan tinggi.",
      label: "Aluminium",
      clean:
        "Aluminium dapat kembali ke siklus berkali-kali. Pipihkan kaleng untuk efisiensi penyimpanan.",
      mixed:
        "Pisahkan aluminium dari logam lain agar estimasi nilai lebih akurat.",
      dirty:
        "Bilas sisa cairan sebelum disimpan agar tidak mencemari material lain.",
      base: 9500,
      action: "Jual ke mitra",
      next: "Lihat marketplace untuk akses material passport dan mitra pemulihan.",
    },
    textile: {
      title: "Tekstil layak pakai sebaiknya diarahkan ke reuse.",
      label: "Tekstil guna ulang",
      clean:
        "Jika masih layak pakai, reuse memberi nilai lebih tinggi dibanding pemrosesan serat.",
      mixed:
        "Pisahkan tekstil berdasarkan kondisi: layak pakai, perlu perbaikan, dan potongan kain.",
      dirty:
        "Cuci atau kemas terpisah sebelum masuk ke program reuse agar tidak merusak batch.",
      base: 4200,
      action: "Kurasi reuse",
      next: "Gunakan program komunitas atau layanan audit untuk memilah tekstil.",
    },
    ewaste: {
      title: "Elektronik kecil perlu jalur pemulihan khusus.",
      label: "Small E-Waste",
      clean:
        "E-waste bernilai, tetapi harus diproses mitra khusus agar komponen berbahaya tidak bocor ke lingkungan.",
      mixed:
        "Pisahkan baterai, kabel, dan perangkat utama sebelum serah-terima.",
      dirty:
        "Jangan dicampur dengan material basah. Simpan tertutup dan pilih pickup terverifikasi.",
      base: 12500,
      action: "Pickup khusus",
      next: "Pilih layanan audit atau pickup khusus dari marketplace.",
    },
  };

  const conditionModifier = {
    clean: { score: 92, multiplier: 1, risk: "Rendah" },
    mixed: { score: 76, multiplier: 0.72, risk: "Sedang" },
    dirty: { score: 58, multiplier: 0.42, risk: "Tinggi" },
  };

  const scanForm = document.querySelector(".js-scan-form");
  const scanMaterial = document.querySelector(".js-scan-material");
  const scanCondition = document.querySelector(".js-scan-condition");
  const scanWeight = document.querySelector(".js-scan-weight");
  const scanPreview = document.querySelector(".js-scan-preview");
  const scanPreviewImage = document.querySelector(".js-scan-preview-image");
  const scanUpload = document.querySelector(".js-scan-upload");
  const scanDropzone = document.querySelector(".js-scan-dropzone");
  const scanSection = document.querySelector(".js-scan-section");
  const scanStepItems = document.querySelectorAll(".scan-steps span");
  const scanImpactLink = document.querySelector(".js-scan-impact-link");
  const scanDropLink = document.querySelector(".js-scan-drop-link");
  const saveScanButton = document.querySelector(".js-save-scan");
  const sampleButtons = document.querySelectorAll(".sample-picker button");
  let uploadedImageUrl = "";
  let scanTimer;

  const setScanStep = (step) => {
    const order = ["upload", "scan", "action"];
    const activeIndex = order.indexOf(step);
    scanStepItems.forEach((item) => {
      const itemIndex = order.indexOf(item.dataset.step);
      item.classList.toggle("is-active", item.dataset.step === step);
      item.classList.toggle("is-complete", itemIndex > -1 && itemIndex < activeIndex);
    });
  };

  const sampleMarkup = (material) => {
    if (material === "plastic") {
      return '<div class="scan-sample scan-sample--plastic"><i></i><i></i><i></i></div>';
    }
    return `<div class="scan-sample scan-sample--${material}"></div>`;
  };

  const setScanPreview = (material, useSample = true) => {
    if (!scanPreview || !scanPreviewImage) return;
    scanPreview.dataset.material = material;
    if (useSample) {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
      uploadedImageUrl = "";
      scanPreviewImage.innerHTML = sampleMarkup(material);
    }
  };

  const revealScanResult = () => {
    window.clearTimeout(scanTimer);
    scanSection?.classList.remove("is-waiting-scan");
    scanSection?.classList.add("is-processing-scan");
    setScanStep("scan");
    scanPreview?.classList.remove("is-scanning");
    window.requestAnimationFrame(() => {
      scanPreview?.classList.add("is-scanning");
      scanTimer = window.setTimeout(() => {
        scanPreview?.classList.remove("is-scanning");
        scanSection?.classList.remove("is-processing-scan");
        scanSection?.classList.add("has-scan-result");
        setScanStep("action");
      }, 1200);
    });
  };

  const getScanResult = () => {
    const material = scanMaterial?.value || "plastic";
    const condition = scanCondition?.value || "clean";
    const weight = Number(scanWeight?.value || 15);
    const data = scanData[material];
    const modifier = conditionModifier[condition];
    const estimatedValue = Math.round((data.base * weight * modifier.multiplier) / 1000) * 1000;

    return {
      material,
      condition,
      weight,
      data,
      modifier,
      estimatedValue,
    };
  };

  const updateScan = () => {
    const { material, condition, weight, data, modifier, estimatedValue } = getScanResult();

    document.querySelector(".js-scan-score").textContent = `${modifier.score}%`;
    document.querySelector(".js-scan-hud-score").textContent = `${modifier.score}% cocok`;
    document.querySelector(".js-scan-hud-label").textContent = data.label;
    document.querySelector(".js-scan-title").textContent = data.title;
    document.querySelector(".js-scan-description").textContent = data[condition];
    document.querySelector(".js-scan-value").textContent = formatCurrency(estimatedValue);
    document.querySelector(".js-scan-risk").textContent = modifier.risk;
    document.querySelector(".js-scan-action").textContent = data.action;
    document.querySelector(".js-scan-next").textContent = data.next;
    if (scanImpactLink) {
      scanImpactLink.href = `impact.html?material=${encodeURIComponent(material)}&weight=${encodeURIComponent(weight)}`;
    }
    if (scanDropLink) {
      scanDropLink.href = `drop-point.html?material=${encodeURIComponent(material)}&weight=${encodeURIComponent(weight)}`;
    }
  };

  scanForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateScan();
    revealScanResult();
  });

  document
    .querySelectorAll(".js-scan-material, .js-scan-weight, .js-scan-condition")
    .forEach((field) =>
      field.addEventListener("change", () => {
        if (field === scanMaterial) {
          setScanPreview(scanMaterial.value);
          sampleButtons.forEach((button) =>
            button.classList.toggle("is-active", button.dataset.sample === scanMaterial.value),
          );
          revealScanResult();
        }
        updateScan();
      }),
    );

  sampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      scanMaterial.value = button.dataset.sample;
      sampleButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      setScanPreview(button.dataset.sample);
      updateScan();
      revealScanResult();
    });
  });

  const handleScanFile = (file) => {
    if (!file || !file.type.startsWith("image/") || !scanPreviewImage) return;
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    uploadedImageUrl = URL.createObjectURL(file);
    scanPreviewImage.innerHTML = `<img src="${uploadedImageUrl}" alt="Preview foto material yang diunggah" />`;
    updateScan();
    revealScanResult();
  };

  scanUpload?.addEventListener("change", () => handleScanFile(scanUpload.files?.[0]));

  ["dragenter", "dragover"].forEach((eventName) => {
    scanDropzone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      scanDropzone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    scanDropzone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      scanDropzone.classList.remove("is-dragging");
    });
  });

  scanDropzone?.addEventListener("drop", (event) => {
    handleScanFile(event.dataTransfer?.files?.[0]);
  });

  saveScanButton?.addEventListener("click", () => {
    updateScan();
    revealScanResult();

    const { material, condition, weight, data, modifier, estimatedValue } = getScanResult();
    const scan = {
      id: `SCAN-${Date.now().toString().slice(-6)}`,
      material,
      materialLabel: data.label,
      title: data.title,
      condition,
      weight,
      score: modifier.score,
      risk: modifier.risk,
      action: data.action,
      value: estimatedValue,
      date: new Date().toISOString(),
    };
    const scans = JSON.parse(localStorage.getItem("revoraScans") || "[]");
    scans.unshift(scan);
    localStorage.setItem("revoraScans", JSON.stringify(scans.slice(0, 12)));

    saveScanButton.textContent = "Tersimpan di Aktivitas";
    saveScanButton.classList.add("is-saved");
    window.setTimeout(() => {
      saveScanButton.textContent = "Simpan ke Aktivitas";
      saveScanButton.classList.remove("is-saved");
    }, 2200);
  });

  if (scanForm) {
    setScanStep("upload");
    setScanPreview(scanMaterial?.value || "plastic", false);
    updateScan();
  }

  const impactFactor = {
    plastic: { co2: 1.7, points: 10, label: "Plastik PET" },
    paper: { co2: 1.1, points: 7, label: "Kertas dan kardus" },
    metal: { co2: 5.4, points: 18, label: "Aluminium" },
    textile: { co2: 3.2, points: 14, label: "Tekstil" },
    ewaste: { co2: 4.8, points: 20, label: "E-Waste kecil" },
  };

  const impactForm = document.querySelector(".js-impact-form");
  const updateImpact = () => {
    const material = document.querySelector(".js-impact-material")?.value || "plastic";
    const weight = Math.max(1, Number(document.querySelector(".js-impact-weight")?.value || 1));
    const factor = impactFactor[material];
    const co2 = weight * factor.co2;
    const points = Math.round(weight * factor.points);

    document.querySelector(".js-impact-output").textContent = `${weight} kg`;
    document.querySelector(
      ".js-impact-copy",
    ).textContent = `${factor.label} berpotensi menghindari ${co2.toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} kg CO₂e dan menghasilkan ${points.toLocaleString("id-ID")} Loop Points.`;
  };

  impactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateImpact();
  });

  document
    .querySelectorAll(".js-impact-material, .js-impact-weight")
    .forEach((field) => field.addEventListener("input", updateImpact));

  if (impactForm) {
    const params = new URLSearchParams(window.location.search);
    const materialParam = params.get("material");
    const weightParam = params.get("weight");
    const materialInput = document.querySelector(".js-impact-material");
    const weightInput = document.querySelector(".js-impact-weight");
    if (materialParam && impactFactor[materialParam] && materialInput) {
      materialInput.value = materialParam;
    }
    if (weightParam && weightInput) {
      weightInput.value = String(Math.max(1, Math.min(500, Number(weightParam) || 1)));
    }
    updateImpact();
  }

  const dropCards = [...document.querySelectorAll(".drop-point-card")];
  const dropMarkers = [...document.querySelectorAll(".map-marker")];
  const dropMaterial = document.querySelector(".js-drop-material");
  const dropWeight = document.querySelector(".js-drop-weight");
  const dropSearch = document.querySelector(".js-drop-search");
  const useLocationButton = document.querySelector(".js-use-location");
  const saveDropButton = document.querySelector(".js-save-drop");
  let selectedDropPoint = dropCards[0] || null;

  const materialRateModifier = {
    plastic: 1,
    paper: 0.55,
    metal: 2.8,
    textile: 0.75,
    ewaste: 3.4,
  };

  const updateDropEstimate = () => {
    if (!selectedDropPoint) return;
    const weight = Math.max(1, Number(dropWeight?.value || 1));
    const material = dropMaterial?.value || "plastic";
    const baseRate = Number(selectedDropPoint.dataset.rate || 0);
    const rate = Math.round((baseRate * materialRateModifier[material]) / 100) * 100;
    const total = rate * weight;

    document.querySelector(".js-drop-name").textContent = selectedDropPoint.dataset.name;
    document.querySelector(".js-drop-distance").textContent = selectedDropPoint.dataset.distance;
    document.querySelector(".js-drop-hours").textContent = selectedDropPoint.dataset.hours;
    document.querySelector(".js-drop-status").textContent = selectedDropPoint.dataset.status;
    document.querySelector(".js-drop-weight-output").textContent = `${weight} kg`;
    document.querySelector(".js-drop-rate").textContent = formatCurrency(rate);
    document.querySelector(".js-drop-total").textContent = formatCurrency(total);
    document.querySelector(".js-nearest-distance").textContent = selectedDropPoint.dataset.distance;
  };

  const selectDropPoint = (pointId) => {
    selectedDropPoint = dropCards.find((card) => card.dataset.point === pointId) || dropCards[0];
    dropCards.forEach((card) => card.classList.toggle("is-active", card === selectedDropPoint));
    dropMarkers.forEach((marker) =>
      marker.classList.toggle("is-active", marker.dataset.point === selectedDropPoint?.dataset.point),
    );
    updateDropEstimate();
  };

  dropCards.forEach((card) =>
    card.addEventListener("click", () => selectDropPoint(card.dataset.point)),
  );
  dropMarkers.forEach((marker) =>
    marker.addEventListener("click", () => selectDropPoint(marker.dataset.point)),
  );
  [dropMaterial, dropWeight].forEach((field) => field?.addEventListener("input", updateDropEstimate));

  useLocationButton?.addEventListener("click", () => {
    if (dropSearch) dropSearch.value = "Lokasi saya · Denpasar";
    useLocationButton.textContent = "Lokasi ditemukan";
    selectDropPoint("renon");
  });

  saveDropButton?.addEventListener("click", () => {
    if (!selectedDropPoint) return;
    const weight = Math.max(1, Number(dropWeight?.value || 1));
    const material = dropMaterial?.value || "plastic";
    const baseRate = Number(selectedDropPoint.dataset.rate || 0);
    const rate = Math.round((baseRate * materialRateModifier[material]) / 100) * 100;
    const transaction = {
      id: `DROP-${Date.now().toString().slice(-6)}`,
      type: "drop",
      location: selectedDropPoint.dataset.name,
      material,
      weight,
      value: rate * weight,
      date: new Date().toISOString(),
      status: "Menunggu setoran",
    };
    const transactions = JSON.parse(localStorage.getItem("revoraTransactions") || "[]");
    transactions.unshift(transaction);
    localStorage.setItem("revoraTransactions", JSON.stringify(transactions.slice(0, 20)));
    saveDropButton.textContent = "Tersimpan di Dashboard";
    saveDropButton.classList.add("is-saved");
    window.setTimeout(() => {
      saveDropButton.textContent = "Simpan rencana setor";
      saveDropButton.classList.remove("is-saved");
    }, 2200);
  });

  if (dropCards.length) {
    const params = new URLSearchParams(window.location.search);
    const materialParam = params.get("material");
    const weightParam = params.get("weight");
    if (materialParam && materialRateModifier[materialParam] && dropMaterial) {
      dropMaterial.value = materialParam;
    }
    if (weightParam && dropWeight) dropWeight.value = String(Math.max(1, Number(weightParam) || 1));
    selectDropPoint("renon");
  }

  const search = document.querySelector(".js-catalog-search");
  const filterButtons = document.querySelectorAll(".catalog-filter button");
  const sort = document.querySelector(".catalog-sort");
  const grid = document.querySelector(".catalog-grid");
  const cards = [...document.querySelectorAll(".catalog-card")];
  const resultCount = document.querySelector(".js-result-count");
  const empty = document.querySelector(".catalog-empty");
  let activeFilter = "all";

  const updateCatalog = () => {
    if (!grid) return;
    const query = search?.value.trim().toLowerCase() || "";
    let visible = 0;

    cards.forEach((card) => {
      const matchesFilter =
        activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = card.dataset.title.includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    resultCount.textContent = `${visible} produk`;
    empty.classList.toggle("is-visible", visible === 0);
  };

  search?.addEventListener("input", updateCatalog);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) =>
        item.classList.toggle("is-active", item === button),
      );
      updateCatalog();
    });
  });

  sort?.addEventListener("change", () => {
    const sorted = [...cards].sort((a, b) => {
      if (sort.value === "low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort.value === "high") return Number(b.dataset.price) - Number(a.dataset.price);
      return cards.indexOf(a) - cards.indexOf(b);
    });
    sorted.forEach((card) => grid.insertBefore(card, empty));
  });

  const marketCheckout = document.querySelector(".js-market-checkout");
  const marketBuyButtons = document.querySelectorAll(".js-market-buy");
  const marketClose = document.querySelector(".js-market-close");
  const marketConfirm = document.querySelector(".js-market-confirm");
  let selectedMarketProduct = null;

  const closeMarketCheckout = () => {
    if (!marketCheckout) return;
    marketCheckout.hidden = true;
    document.body.classList.remove("modal-open");
  };

  marketBuyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMarketProduct = {
        title: button.dataset.product,
        price: Number(button.dataset.price),
      };
      document.querySelector(".js-market-product").textContent = selectedMarketProduct.title;
      document.querySelector(".js-market-price").textContent = formatCurrency(
        selectedMarketProduct.price + 14000,
      );
      marketConfirm.textContent = "Konfirmasi pesanan";
      marketConfirm.classList.remove("is-saved");
      marketCheckout.hidden = false;
      document.body.classList.add("modal-open");
    });
  });

  marketClose?.addEventListener("click", closeMarketCheckout);
  marketCheckout?.addEventListener("click", (event) => {
    if (event.target === marketCheckout) closeMarketCheckout();
  });

  marketConfirm?.addEventListener("click", () => {
    if (!selectedMarketProduct) return;
    const purchase = {
      id: `SHOP-${Date.now().toString().slice(-6)}`,
      type: "marketplace",
      title: selectedMarketProduct.title,
      price: selectedMarketProduct.price + 14000,
      date: new Date().toISOString(),
      status: "Diproses",
    };
    const transactions = JSON.parse(localStorage.getItem("revoraTransactions") || "[]");
    transactions.unshift(purchase);
    localStorage.setItem("revoraTransactions", JSON.stringify(transactions.slice(0, 20)));
    marketConfirm.textContent = "Pesanan masuk ke Dashboard";
    marketConfirm.classList.add("is-saved");
    window.setTimeout(closeMarketCheckout, 1300);
  });

  const modal = document.querySelector(".checkout-modal");
  const buyButton = document.querySelector(".js-buy-button");
  const closeButton = document.querySelector(".js-checkout-close");
  const checkoutForm = document.querySelector(".js-checkout-form");
  const pickupZone = document.querySelector(".js-pickup-zone");

  const selectedPlan = () =>
    document.querySelector('input[name="pickup-plan"]:checked');

  const updateCheckout = () => {
    if (!modal) return;
    const plan = selectedPlan();
    const planLabel = plan.closest(".plan-option").querySelector(
      ".plan-option__copy strong",
    ).textContent;
    const zoneFee = Number(pickupZone?.value || 0);
    const price = formatCurrency(Number(plan.dataset.price) + zoneFee);
    document.querySelector(".js-checkout-plan").textContent = planLabel;
    document.querySelector(".js-checkout-price").textContent = price;
    document.querySelector(".js-checkout-total").textContent = price;
  };

  const setModal = (open) => {
    if (!modal) return;
    modal.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      updateCheckout();
      closeButton.focus();
    }
  };

  buyButton?.addEventListener("click", () => setModal(true));
  pickupZone?.addEventListener("change", updateCheckout);
  document
    .querySelectorAll('input[name="pickup-plan"]')
    .forEach((option) => option.addEventListener("change", updateCheckout));
  closeButton?.addEventListener("click", () => setModal(false));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) setModal(false);
  });

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const plan = selectedPlan();
    const planLabel = plan.closest(".plan-option").querySelector(
      ".plan-option__copy strong",
    ).textContent;
    const order = {
      id: `RV-${Date.now().toString().slice(-6)}`,
      title: "Loop Pickup",
      plan: planLabel,
      price: Number(plan.dataset.price) + Number(pickupZone?.value || 0),
      zone: pickupZone?.selectedOptions[0]?.dataset.label || "Zona A · 0–5 km",
      date: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("revoraOrders") || "[]");
    orders.unshift(order);
    localStorage.setItem("revoraOrders", JSON.stringify(orders));

    document.querySelector(".checkout-card__body").style.display = "none";
    document.querySelector(".checkout-success").classList.add("is-visible");
  });

  const historyList = document.querySelector(".js-history-list");
  if (historyList) {
    const orders = JSON.parse(localStorage.getItem("revoraOrders") || "[]");
    const scans = JSON.parse(localStorage.getItem("revoraScans") || "[]");
    const transactions = JSON.parse(localStorage.getItem("revoraTransactions") || "[]");
    orders.forEach((order) => {
      const date = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(order.date));
      const item = document.createElement("article");
      item.className = "history-item";
      item.dataset.historyType = "purchase";
      item.innerHTML = `
        <span class="history-item__icon">↻</span>
        <div class="history-item__main"><strong>${order.title}</strong><span>${order.plan} · Pesanan ${order.id}</span></div>
        <div class="history-item__meta"><span>Tanggal</span><strong>${date}</strong></div>
        <div class="history-item__meta"><span>Jumlah</span><strong>${formatCurrency(order.price)}</strong></div>
        <span class="history-status">Aktif</span>
        <a href="product-detail.html">Detail →</a>
      `;
      historyList.prepend(item);
    });

    scans.forEach((scan) => {
      const date = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(scan.date));
      const item = document.createElement("article");
      item.className = "history-item";
      item.dataset.historyType = "scan";
      item.innerHTML = `
        <span class="history-item__icon">AI</span>
        <div class="history-item__main"><strong>${scan.materialLabel} terpindai</strong><span>${scan.score}% cocok · ${scan.weight} kg · ${scan.id}</span></div>
        <div class="history-item__meta"><span>Tanggal</span><strong>${date}</strong></div>
        <div class="history-item__meta"><span>Nilai</span><strong>${formatCurrency(scan.value)}</strong></div>
        <span class="history-status">Tercatat</span>
        <a href="impact.html?material=${encodeURIComponent(scan.material)}&weight=${encodeURIComponent(scan.weight)}">Dampak →</a>
      `;
      historyList.prepend(item);
    });

    transactions.forEach((transaction) => {
      const date = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(transaction.date));
      const item = document.createElement("article");
      const isDrop = transaction.type === "drop";
      item.className = "history-item";
      item.dataset.historyType = isDrop ? "drop" : "purchase";
      item.innerHTML = `
        <span class="history-item__icon">${isDrop ? "DP" : "MP"}</span>
        <div class="history-item__main"><strong>${isDrop ? transaction.location : transaction.title}</strong><span>${isDrop ? `${transaction.weight} kg · Rencana setor ${transaction.id}` : `Pesanan marketplace ${transaction.id}`}</span></div>
        <div class="history-item__meta"><span>Tanggal</span><strong>${date}</strong></div>
        <div class="history-item__meta"><span>${isDrop ? "Estimasi nilai" : "Jumlah"}</span><strong>${formatCurrency(transaction.value || transaction.price)}</strong></div>
        <span class="history-status">${transaction.status}</span>
        <a href="${isDrop ? "drop-point.html" : "marketplace.html"}">Detail →</a>
      `;
      historyList.prepend(item);
    });

    const walletBalance = document.querySelector(".js-wallet-balance");
    if (walletBalance) {
      const materialBalance = 48500 + transactions
        .filter(
          (transaction) =>
            transaction.type === "drop" && transaction.status === "Terverifikasi",
        )
        .reduce((total, transaction) => total + Number(transaction.value || 0), 0);
      walletBalance.textContent = formatCurrency(materialBalance);
    }

    const activeServices = document.querySelector(".js-active-services");
    if (activeServices) activeServices.textContent = String(2 + orders.length);
  }

  const quizForm = document.querySelector(".js-quiz-form");
  const quizQuestions = [...document.querySelectorAll(".quiz-question")];
  const quizNext = document.querySelector(".js-quiz-next");
  const quizPrev = document.querySelector(".js-quiz-prev");
  const quizResult = document.querySelector(".js-quiz-result");
  let quizIndex = 0;

  const updateQuiz = () => {
    quizQuestions.forEach((question, index) =>
      question.classList.toggle("is-active", index === quizIndex),
    );
    document.querySelector(".js-quiz-current").textContent = String(quizIndex + 1);
    document.querySelector(".js-quiz-progress").style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
    quizPrev.disabled = quizIndex === 0;
    quizNext.textContent = quizIndex === quizQuestions.length - 1 ? "Lihat hasil" : "Berikutnya";
  };

  const finishQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      const selected = quizForm.querySelector(`input[name="q${index}"]:checked`);
      if (selected?.value === question.dataset.answer) correct += 1;
    });
    const score = Math.round((correct / quizQuestions.length) * 100);
    const passed = score >= 80;
    document.querySelector(".js-quiz-score").textContent = String(score);
    document.querySelector(".js-quiz-title").textContent = passed
      ? "Ahli Pilah Muda"
      : score >= 60
        ? "Pemilah Berkembang"
        : "Pemilah Pemula";
    document.querySelector(".js-quiz-message").textContent = passed
      ? "Anda memahami jalur dasar material dan siap mempraktikkannya."
      : "Tinjau kembali modul edukasi dan coba ulang untuk mendapatkan badge tertinggi.";
    document.querySelector(".js-quiz-badge").textContent = passed
      ? "Ahli Pilah Muda"
      : "Pemilah Pemula";
    localStorage.setItem("revoraQuizScore", String(score));
    quizForm.hidden = true;
    quizResult.hidden = false;
  };

  quizNext?.addEventListener("click", () => {
    const currentAnswer = quizForm.querySelector(`input[name="q${quizIndex}"]:checked`);
    if (!currentAnswer) {
      quizQuestions[quizIndex].classList.add("has-error");
      window.setTimeout(() => quizQuestions[quizIndex]?.classList.remove("has-error"), 600);
      return;
    }
    if (quizIndex < quizQuestions.length - 1) {
      quizIndex += 1;
      updateQuiz();
    } else {
      finishQuiz();
    }
  });

  quizPrev?.addEventListener("click", () => {
    if (quizIndex > 0) {
      quizIndex -= 1;
      updateQuiz();
    }
  });

  document.querySelector(".js-quiz-retry")?.addEventListener("click", () => {
    quizForm.reset();
    quizIndex = 0;
    quizForm.hidden = false;
    quizResult.hidden = true;
    updateQuiz();
  });

  if (quizQuestions.length) updateQuiz();

  const historyTabs = document.querySelectorAll(".history-tabs button");
  historyTabs.forEach((button) => {
    button.addEventListener("click", () => {
      historyTabs.forEach((item) =>
        item.classList.toggle("is-active", item === button),
      );
      const target = button.dataset.history;
      const items = document.querySelectorAll(".history-item");
      let visible = 0;
      items.forEach((item) => {
        const show =
          target === "all" || item.dataset.historyType === target;
        item.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      document
        .querySelector(".history-empty")
        ?.classList.toggle("is-visible", visible === 0);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) setModal(false);
  });
});
