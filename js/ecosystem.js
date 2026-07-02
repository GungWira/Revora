document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".eco-footer")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<footer class="eco-footer"><div class="eco-container"><div class="eco-footer__grid"><div><a class="eco-brand" href="index.html"><span class="eco-brand__mark"></span><span>Revora</span></a><p>Dari rumah tangga ke rantai pasok industri—satu jaringan kecerdasan sirkular.</p></div><div><div><strong>EKOSISTEM</strong><a href="material-scan.html">Individu</a><a href="listing-new.html">Agregator</a><a href="matching.html">Industri</a></div><div><strong>PLATFORM</strong><a href="matching.html">AI Matching</a><a href="material-market.html">Material Market</a><a href="marketplace.html">Produk Upcycle</a><a href="impact.html">Dampak Publik</a></div><div><strong>REVORA</strong><a href="partner-directory.html">Mitra</a><a href="learning.html">Edukasi</a><a href="about.html">Tentang</a></div></div></div><div class="eco-footer__bottom">© 2026 Revora · Prototipe Circular Intelligence Ecosystem untuk ITCC 2026.</div></div></footer>`,
    );
  }
  const header = document.querySelector(".eco-header");
  document.querySelector(".eco-menu")?.addEventListener("click", () => header?.classList.toggle("is-open"));

  const animateCounters = () => {
    document.querySelectorAll("[data-count]").forEach((node) => {
      if (node.dataset.done) return;
      node.dataset.done = "true";
      const target = Number(node.dataset.count);
      const suffix = node.dataset.suffix || "";
      const decimals = Number(node.dataset.decimals || 0);
      const started = performance.now();
      const run = (time) => {
        const progress = Math.min((time - started) / 1200, 1);
        node.textContent = `${(target * (1 - Math.pow(1 - progress, 3))).toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  };
  const counterTarget = document.querySelector("[data-counter-section]");
  if (counterTarget && "IntersectionObserver" in window) {
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
    }, { threshold: .25 }).observe(counterTarget);
  } else animateCounters();

  document.querySelector(".js-demo-match")?.addEventListener("click", () => {
    const material = document.querySelector(".js-demo-material")?.value || "PET";
    const city = document.querySelector(".js-demo-city")?.value || "Denpasar";
    document.querySelector(".js-demo-name").textContent = `${material} · ${city}`;
    document.querySelector(".demo-match")?.classList.add("is-visible");
  });

  const panels = [...document.querySelectorAll(".wizard-panel")];
  const steps = [...document.querySelectorAll(".wizard-nav button")];
  let currentStep = 0;
  const showStep = (index) => {
    currentStep = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((panel, i) => panel.classList.toggle("is-active", i === currentStep));
    steps.forEach((step, i) => step.classList.toggle("is-active", i === currentStep));
  };
  steps.forEach((step, i) => step.addEventListener("click", () => showStep(i)));
  document.querySelectorAll("[data-wizard-next]").forEach((button) => button.addEventListener("click", () => showStep(currentStep + 1)));
  document.querySelectorAll("[data-wizard-prev]").forEach((button) => button.addEventListener("click", () => showStep(currentStep - 1)));
  document.querySelectorAll(".choice-card").forEach((card) => card.addEventListener("click", () => {
    card.parentElement.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    const input = card.querySelector("input");
    if (input) {
      input.checked = true;
      if (input.name === "role") localStorage.setItem("revoraRole", input.value);
    }
  }));
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  const roleValue = requestedRole === "business" ? "umkm" : requestedRole;
  document.querySelector(`.choice-card input[value="${roleValue}"]`)?.closest(".choice-card")?.click();
  document.querySelectorAll("[data-range-output]").forEach((range) => {
    const output = document.querySelector(range.dataset.rangeOutput);
    const update = () => output.textContent = `${range.value}${range.dataset.unit || ""}`;
    range.addEventListener("input", update); update();
  });

  const roleButtons = document.querySelectorAll("[data-role-view]");
  const rolePanels = document.querySelectorAll("[data-role-panel]");
  roleButtons.forEach((button) => button.addEventListener("click", () => {
    roleButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    rolePanels.forEach((panel) => panel.hidden = panel.dataset.rolePanel !== button.dataset.roleView);
  }));
  const savedRole = localStorage.getItem("revoraRole");
  const dashboardRole = savedRole === "industry" ? "industry" : savedRole === "umkm" ? "umkm" : "individual";
  document.querySelector(`[data-role-view="${dashboardRole}"]`)?.click();

  const listingSelects = window.location.pathname.endsWith("listing-new.html")
    ? document.querySelectorAll(".wizard-panel:nth-of-type(2) select")
    : [];
  const category = document.querySelector(".js-material-category") || listingSelects[0];
  const subcategory = document.querySelector(".js-material-subcategory") || listingSelects[1];
  const subcategories = {
    Plastik: ["PET Bening", "HDPE", "PP", "rPET Flakes"],
    Logam: ["Aluminium UBC", "Besi", "Tembaga"],
    "Kertas/Pulp": ["Kardus OCC", "Kertas Putih", "Pulp Pulih"],
    Tekstil: ["Katun", "Poliester", "Serat Campuran"],
    Organik: ["Ampas Produksi", "Biomassa", "Minyak Jelantah"],
    Kaca: ["Kaca Bening", "Kaca Berwarna", "Cullet"],
    Elektronik: ["PCB", "Kabel", "Perangkat Kecil"],
  };
  const updateSubcategories = () => {
    if (!category || !subcategory) return;
    subcategory.innerHTML = (subcategories[category.value] || ["Lainnya"])
      .map((item) => `<option>${item}</option>`).join("");
  };
  category?.addEventListener("change", updateSubcategories);
  updateSubcategories();

  const carbonPage = window.location.pathname.endsWith("carbon-market.html");
  const carbonRange = document.querySelector(".js-carbon-range") ||
    (carbonPage ? document.querySelector('[data-range-output=".carbon-output"]') : null);
  const carbonCost = document.querySelector(".js-carbon-cost") ||
    (carbonPage ? carbonRange?.closest(".dash-card")?.querySelector("strong[style]") : null);
  const updateCarbonCost = () => {
    if (!carbonRange || !carbonCost) return;
    carbonCost.textContent = new Intl.NumberFormat("id-ID", {
      style:"currency", currency:"IDR", maximumFractionDigits:0,
    }).format(Number(carbonRange.value) * 148000);
  };
  carbonRange?.addEventListener("input", updateCarbonCost);
  updateCarbonCost();

  const weights = { distance: 35, price: 25, carbon: 40 };
  const matchData = [
    { id:"MAT-1842", name:"Bali PET Recycling", type:"Direct Match", material:"PET Bening Grade A", materialFit:98, city:"Denpasar", distance:8, volume:88, rating:96, carbon:91, price:82 },
    { id:"MAT-2081", name:"Nusa Circular Hub", type:"Direct Match", material:"PET & HDPE Campuran", materialFit:94, city:"Badung", distance:14, volume:95, rating:89, carbon:84, price:91 },
    { id:"MAT-1174", name:"Surya Polimer Indonesia", type:"Indirect Match", material:"rPET Flakes", materialFit:91, city:"Gianyar", distance:31, volume:82, rating:94, carbon:97, price:76 },
    { id:"MAT-0938", name:"Koperasi Plastik Pulih", type:"Indirect Match", material:"PET Bening", materialFit:89, city:"Tabanan", distance:45, volume:76, rating:87, carbon:88, price:96 },
  ];
  const scoreFor = (item) => {
    const distanceScore = Math.max(15, 100 - item.distance * 1.5);
    const flexibleScore =
      (distanceScore * weights.distance + item.price * weights.price + item.carbon * weights.carbon) /
      (weights.distance + weights.price + weights.carbon);
    return Math.round(
      item.materialFit * 0.3 +
      item.volume * 0.15 +
      item.rating * 0.1 +
      flexibleScore * 0.45
    );
  };
  const renderMatches = () => {
    const grid = document.querySelector(".js-match-grid");
    if (!grid) return;
    const ranked = matchData.map((item) => ({...item, score:scoreFor(item)})).sort((a,b) => b.score-a.score);
    grid.innerHTML = ranked.map((item) => `
      <article class="match-card" data-match-id="${item.id}">
        <div class="match-card__head"><span class="match-card__badge">${item.type}</span><small>${item.id}</small></div>
        <span class="match-score" style="--score:${item.score}"><strong>${item.score}%</strong></span>
        <h2>${item.name}</h2><p>${item.material} · ${item.city}</p>
        <div class="match-card__meta"><span>Jarak<strong>${item.distance} km</strong></span><span>Volume cocok<strong>${item.volume}%</strong></span><span>CO₂e<strong>${(item.carbon/10).toFixed(1)} ton</strong></span></div>
      </article>`).join("");
    grid.querySelectorAll(".match-card").forEach((card) => card.addEventListener("click", () => openDrawer(card.dataset.matchId)));
  };
  document.querySelectorAll("[data-priority]").forEach((range) => range.addEventListener("input", () => {
    weights[range.dataset.priority] = Number(range.value);
    const output = document.querySelector(`[data-priority-value="${range.dataset.priority}"]`);
    if (output) output.textContent = range.value;
    renderMatches();
  }));
  const drawer = document.querySelector(".match-drawer");
  const openDrawer = (id) => {
    const item = matchData.find((entry) => entry.id === id) || matchData[0];
    const score = scoreFor(item);
    if (!drawer) return;
    drawer.querySelector(".js-drawer-name").textContent = item.name;
    drawer.querySelector(".js-drawer-score").textContent = `${score}%`;
    drawer.querySelector(".js-detail-link").href = `match-detail.html?id=${item.id}`;
    drawer.classList.add("is-open");
  };
  document.querySelector(".drawer-close")?.addEventListener("click", () => drawer.classList.remove("is-open"));
  renderMatches();

  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelector(".js-match-grid")?.toggleAttribute("hidden", button.dataset.view === "map");
    document.querySelector(".matching-map")?.classList.toggle("is-active", button.dataset.view === "map");
  }));
  document.querySelectorAll(".map-pin").forEach((pin) => pin.addEventListener("click", () => openDrawer(pin.dataset.matchId)));

  const transactionButton = document.querySelector(".js-advance-status");
  if (transactionButton) {
    let status = 1;
    transactionButton.addEventListener("click", () => {
      status = Math.min(status + 1, 4);
      document.querySelectorAll(".status-stepper div").forEach((step, i) => step.classList.toggle("is-done", i < status));
      transactionButton.textContent = status === 4 ? "Transaksi selesai & terverifikasi" : "Lanjutkan status simulasi";
      if (status === 4) {
        transactionButton.disabled = true;
        document.querySelector(".certificate-wrap").hidden = false;
        document.querySelector(".certificate-wrap").scrollIntoView({ behavior:"smooth" });
      }
    });
  }
  document.querySelector(".js-download-certificate")?.addEventListener("click", () => window.print());

  document.querySelector(".js-listing-submit")?.addEventListener("click", () => {
    localStorage.setItem("revoraListingCreated", "true");
    window.location.href = "matching.html";
  });
});
