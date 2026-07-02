document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const formatNumber = (value, decimals = 0) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: decimals }).format(value);
  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

  if (!document.querySelector(".eco-footer")) {
    document.body.insertAdjacentHTML("beforeend", `<footer class="eco-footer"><div class="eco-container"><div class="eco-footer__grid"><div><a class="eco-brand" href="index.html"><span class="eco-brand__mark"></span><span>Revora</span></a><p>Dari rumah tangga ke rantai pasok industri—satu jaringan kecerdasan sirkular.</p></div><div><div><strong>EKOSISTEM</strong><a href="material-scan.html">Individu</a><a href="listing-new.html">Agregator</a><a href="matching.html">Industri</a></div><div><strong>PLATFORM</strong><a href="matching.html">AI Matching</a><a href="material-market.html">Pasar Material</a><a href="marketplace.html">Produk Upcycle</a><a href="impact.html">Dampak Publik</a></div><div><strong>REVORA</strong><a href="partner-directory.html">Mitra</a><a href="learning.html">Edukasi</a><a href="about.html">Tentang</a></div></div></div><div class="eco-footer__bottom">© 2026 Revora · Prototipe Circular Intelligence Ecosystem untuk ITCC 2026.</div></div></footer>`);
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
        const progress = Math.min((time - started) / 1100, 1);
        node.textContent = `${formatNumber(target * (1 - Math.pow(1 - progress, 3)), decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  };
  const counterTarget = document.querySelector("[data-counter-section]");
  if (counterTarget && "IntersectionObserver" in window) {
    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      animateCounters();
      observer.disconnect();
    }, { threshold: 0.2 }).observe(counterTarget);
  } else animateCounters();

  document.querySelectorAll(".layer-card").forEach((card) => {
    card.tabIndex = 0;
    const toggle = () => card.classList.toggle("is-open");
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); }
    });
  });

  const demoData = {
    "PET Bening": [
      ["Bali PET Recycling", "Denpasar", 93, "4,8"],
      ["Nusa Circular Hub", "Badung", 87, "3,9"],
      ["Surya Polimer Indonesia", "Gianyar", 81, "5,2"],
    ],
    "Kardus OCC": [
      ["Pulp Kembali Nusantara", "Denpasar", 91, "2,7"],
      ["Bank Sampah Melati", "Badung", 85, "1,9"],
      ["Kertas Lestari Bali", "Tabanan", 78, "3,1"],
    ],
    "Aluminium UBC": [
      ["Surya Metal Loop", "Surabaya", 94, "6,4"],
      ["Logam Pulih Indonesia", "Gresik", 86, "5,8"],
      ["Koperasi UBC Mandiri", "Sidoarjo", 79, "4,2"],
    ],
    "Limbah Tekstil": [
      ["Koperasi Serat Kembali", "Bandung", 92, "7,1"],
      ["Aruna Textile Recovery", "Cimahi", 88, "6,3"],
      ["Insulasi Sirkular", "Sumedang", 80, "8,0"],
    ],
  };
  document.querySelector(".js-demo-match")?.addEventListener("click", () => {
    const material = document.querySelector(".js-demo-material")?.value || "PET Bening";
    const city = document.querySelector(".js-demo-city")?.value || "Denpasar";
    const result = document.querySelector(".demo-match");
    if (!result) return;
    result.innerHTML = `<div class="demo-match__top"><div><small>3 KECOCOKAN TERBAIK · ${city.toUpperCase()}</small><h3>${material}</h3></div><div class="score-ring" style="--score:${demoData[material][0][2]}"><strong>${demoData[material][0][2]}%</strong></div></div><div class="demo-result-list">${demoData[material].map(([name, location, score, carbon], index) => `<article><span>0${index + 1}</span><div><strong>${name}</strong><small>${location} · ${carbon} tCO₂e</small></div><b>${score}%</b></article>`).join("")}</div><a class="eco-button eco-button--lime" href="matching.html" style="margin-top:20px">Buka Matching Engine</a>`;
    result.classList.add("is-visible");
  });

  const panels = [...document.querySelectorAll(".wizard-panel")];
  const steps = [...document.querySelectorAll(".wizard-nav button")];
  let currentStep = 0;
  const showStep = (index) => {
    currentStep = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((panel, i) => panel.classList.toggle("is-active", i === currentStep));
    steps.forEach((step, i) => step.classList.toggle("is-active", i === currentStep));
  };
  steps.forEach((step, i) => step.addEventListener("click", () => i <= currentStep && showStep(i)));
  document.querySelectorAll("[data-wizard-next]").forEach((button) => button.addEventListener("click", () => showStep(currentStep + 1)));
  document.querySelectorAll("[data-wizard-prev]").forEach((button) => button.addEventListener("click", () => showStep(currentStep - 1)));
  document.querySelectorAll(".choice-card").forEach((card) => card.addEventListener("click", () => {
    if (card.querySelector('input[type="radio"]')) {
      card.parentElement.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("is-selected"));
    }
    card.classList.toggle("is-selected", !card.classList.contains("is-selected") || Boolean(card.querySelector('input[type="radio"]')));
    const input = card.querySelector("input");
    if (input) {
      input.checked = card.classList.contains("is-selected");
      if (input.name === "role") {
        localStorage.setItem("revoraRole", input.value);
        document.querySelectorAll("[data-role-fields]").forEach((group) => {
          group.hidden = group.dataset.roleFields !== input.value;
        });
      }
    }
  }));
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  const roleValue = requestedRole === "business" ? "umkm" : requestedRole;
  document.querySelector(`.choice-card input[value="${roleValue}"]`)?.closest(".choice-card")?.click();

  document.querySelectorAll("[data-range-output]").forEach((range) => {
    const output = document.querySelector(range.dataset.rangeOutput);
    const update = () => { if (output) output.textContent = `${range.value}${range.dataset.unit || ""}`; };
    range.addEventListener("input", update);
    update();
  });

  const roleButtons = document.querySelectorAll("[data-role-view]");
  const rolePanels = document.querySelectorAll("[data-role-panel]");
  roleButtons.forEach((button) => button.addEventListener("click", () => {
    roleButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    rolePanels.forEach((panel) => { panel.hidden = panel.dataset.rolePanel !== button.dataset.roleView; });
  }));
  const savedRole = localStorage.getItem("revoraRole");
  document.querySelector(`[data-role-view="${savedRole === "industry" ? "industry" : savedRole === "umkm" ? "umkm" : "individual"}"]`)?.click();

  const listingSelects = page === "listing-new.html" ? document.querySelectorAll(".wizard-panel:nth-of-type(2) select") : [];
  const category = document.querySelector(".js-material-category") || listingSelects[0];
  const subcategory = document.querySelector(".js-material-subcategory") || listingSelects[1];
  const subcategories = {
    Plastik: ["PET", "HDPE", "PP", "Lainnya"], Logam: ["Aluminium UBC", "Besi", "Tembaga"],
    "Kertas/Pulp": ["Kardus OCC", "Kertas Putih", "Pulp Pulih"], Tekstil: ["Katun", "Poliester", "Serat Campuran"],
    Organik: ["Ampas Produksi", "Biomassa", "Minyak Jelantah"], Kaca: ["Kaca Bening", "Kaca Berwarna", "Cullet"],
    Elektronik: ["PCB", "Kabel", "Perangkat Kecil"], Lainnya: ["Material lainnya"],
  };
  const updateSubcategories = () => {
    if (!category || !subcategory) return;
    subcategory.innerHTML = (subcategories[category.value] || ["Lainnya"]).map((item) => `<option>${item}</option>`).join("");
  };
  category?.addEventListener("change", updateSubcategories);
  updateSubcategories();

  const balanceRanges = (changed, selector) => {
    const ranges = [...document.querySelectorAll(selector)];
    if (ranges.length !== 3) return;
    const others = ranges.filter((item) => item !== changed);
    const remaining = 100 - Number(changed.value);
    const otherTotal = others.reduce((sum, item) => sum + Number(item.value), 0) || 2;
    const first = Math.round(remaining * Number(others[0].value) / otherTotal);
    others[0].value = first;
    others[1].value = remaining - first;
    ranges.forEach((range) => {
      const output = document.querySelector(`[data-priority-value="${range.dataset.priority}"]`);
      if (output) output.textContent = range.value;
    });
    const total = document.querySelector(".js-priority-total");
    if (total) total.textContent = ranges.reduce((sum, item) => sum + Number(item.value), 0);
  };

  const matchData = [
    { id:"MAT-1842", name:"Bali PET Recycling", type:"Kecocokan Langsung", category:"Plastik", material:"PET Bening Grade A", city:"Denpasar", distance:8, volume:88, rating:96, carbon:72, price:62, materialFit:99, impact:9.1, x:18, y:67 },
    { id:"MAT-2081", name:"Nusa Circular Hub", type:"Kecocokan Langsung", category:"Plastik", material:"PET & HDPE Campuran", city:"Badung", distance:14, volume:95, rating:89, carbon:84, price:78, materialFit:91, impact:8.4, x:29, y:52 },
    { id:"MAT-1174", name:"Surya Polimer Indonesia", type:"Kecocokan Tidak Langsung", category:"Plastik", material:"rPET Flakes", city:"Gianyar", distance:31, volume:82, rating:94, carbon:99, price:88, materialFit:86, impact:9.7, x:42, y:41 },
    { id:"MAT-0938", name:"Koperasi Plastik Pulih", type:"Kecocokan Tidak Langsung", category:"Plastik", material:"PET Bening", city:"Tabanan", distance:45, volume:76, rating:87, carbon:90, price:97, materialFit:89, impact:8.8, x:56, y:29 },
    { id:"MAT-2210", name:"Koperasi Serat Kembali", type:"Kecocokan Langsung", category:"Tekstil", material:"Serat Katun Pulih", city:"Bandung", distance:12, volume:91, rating:98, carbon:95, price:67, materialFit:98, impact:11.2, x:67, y:19 },
    { id:"MAT-1762", name:"Aruna Textile Recovery", type:"Kecocokan Tidak Langsung", category:"Tekstil", material:"Potongan Poliester", city:"Cimahi", distance:27, volume:79, rating:91, carbon:92, price:86, materialFit:92, impact:8.9, x:74, y:36 },
    { id:"MAT-2384", name:"Pulp Kembali Nusantara", type:"Kecocokan Langsung", category:"Kertas/Pulp", material:"Kardus OCC Bale", city:"Surabaya", distance:19, volume:97, rating:93, carbon:81, price:92, materialFit:97, impact:6.7, x:84, y:52 },
    { id:"MAT-1498", name:"Surya Metal Loop", type:"Kecocokan Langsung", category:"Logam", material:"Aluminium UBC", city:"Gresik", distance:53, volume:99, rating:97, carbon:98, price:94, materialFit:96, impact:13.6, x:71, y:67 },
    { id:"MAT-2531", name:"BioLoop Organik", type:"Kecocokan Langsung", category:"Organik", material:"Ampas Produksi", city:"Malang", distance:68, volume:86, rating:84, carbon:96, price:83, materialFit:90, impact:10.5, x:57, y:76 },
    { id:"MAT-1640", name:"Kaca Lestari Indonesia", type:"Kecocokan Tidak Langsung", category:"Kaca", material:"Cullet Bening", city:"Semarang", distance:82, volume:89, rating:92, carbon:87, price:90, materialFit:94, impact:7.8, x:40, y:82 },
    { id:"MAT-2695", name:"E-Cycle Teknologi", type:"Kecocokan Tidak Langsung", category:"Elektronik", material:"PCB & Kabel", city:"Jakarta", distance:104, volume:72, rating:95, carbon:100, price:99, materialFit:88, impact:14.1, x:25, y:84 },
    { id:"MAT-1327", name:"Bank Sampah Melati", type:"Kecocokan Langsung", category:"Kertas/Pulp", material:"Kertas Putih", city:"Sidoarjo", distance:39, volume:84, rating:88, carbon:75, price:96, materialFit:93, impact:5.9, x:13, y:43 },
  ];
  const weights = { distance: 35, price: 25, carbon: 40 };
  const factorScores = (item) => ({
    material: item.materialFit,
    distance: Math.max(5, 100 - item.distance * 0.9),
    volume: item.volume,
    rating: item.rating,
    price: item.price,
    carbon: item.carbon,
  });
  const scoreFor = (item) => {
    const s = factorScores(item);
    const preference = (s.distance * weights.distance + s.price * weights.price + s.carbon * weights.carbon) / 100;
    return Math.round(s.material * .25 + s.volume * .15 + s.rating * .1 + preference * .5);
  };
  let activeMatchId = null;
  const getFilteredMatches = () => {
    const selectedCategory = document.querySelector(".js-match-category")?.value || "all";
    const radius = Number(document.querySelector(".js-radius-filter")?.value || 120);
    const sort = document.querySelector(".js-match-sort")?.value || "score";
    const result = matchData.filter((item) => (selectedCategory === "all" || item.category === selectedCategory) && item.distance <= radius)
      .map((item) => ({ ...item, score: scoreFor(item) }));
    result.sort((a, b) => sort === "distance" ? a.distance - b.distance : sort === "volume" ? b.volume - a.volume : b.score - a.score);
    return result;
  };
  const scoreColor = (score) => score >= 85 ? "#9de33f" : score >= 70 ? "#f1c84b" : "#aeb7b2";
  const renderMapPins = (items) => {
    const wrap = document.querySelector(".js-map-pins");
    if (!wrap) return;
    wrap.innerHTML = items.map((item) => `<button class="map-pin${item.id === activeMatchId ? " is-active" : ""}" data-match-id="${item.id}" style="left:${item.x}%;top:${item.y}%;background:${scoreColor(item.score)}"><span>${item.score}</span></button>`).join("");
    wrap.querySelectorAll(".map-pin").forEach((pin) => pin.addEventListener("click", () => {
      activeMatchId = pin.dataset.matchId;
      highlightMatch(activeMatchId);
      openDrawer(activeMatchId);
    }));
  };
  const bindCards = () => {
    document.querySelectorAll(".match-card").forEach((card) => {
      card.addEventListener("click", () => { activeMatchId = card.dataset.matchId; highlightMatch(activeMatchId); openDrawer(activeMatchId); });
      card.addEventListener("mouseenter", () => highlightMatch(card.dataset.matchId));
      card.addEventListener("mouseleave", () => highlightMatch(activeMatchId));
    });
  };
  const renderMatches = () => {
    const grid = document.querySelector(".js-match-grid");
    if (!grid) return;
    const items = getFilteredMatches();
    document.querySelector(".js-match-count").textContent = items.length;
    grid.innerHTML = items.length ? items.map((item) => `<article class="match-card${item.id === activeMatchId ? " is-highlighted" : ""}" data-match-id="${item.id}"><div class="match-card__head"><span class="match-card__badge">${item.type}</span><small>${item.id}</small></div><span class="match-score" style="--score:${item.score};--score-color:${scoreColor(item.score)}"><strong>${item.score}%</strong></span><h2>${item.name}</h2><p>${item.material} · ${item.city}</p><div class="match-card__meta"><span>Jarak<strong>${item.distance} km</strong></span><span>Volume cocok<strong>${item.volume}%</strong></span><span>CO₂e<strong>${item.impact} ton</strong></span></div></article>`).join("") : `<div class="detail-card"><h2>Tidak ada kecocokan pada filter ini.</h2><p class="eco-copy">Perbesar radius atau pilih kategori lain.</p></div>`;
    bindCards();
    renderMapPins(items);
  };
  const highlightMatch = (id) => {
    document.querySelectorAll(".match-card").forEach((card) => card.classList.toggle("is-highlighted", card.dataset.matchId === id));
    document.querySelectorAll(".map-pin").forEach((pin) => pin.classList.toggle("is-active", pin.dataset.matchId === id));
  };
  const drawer = document.querySelector(".match-drawer");
  const openDrawer = (id) => {
    const item = matchData.find((entry) => entry.id === id) || matchData[0];
    if (!drawer) return;
    const scores = factorScores(item);
    const score = scoreFor(item);
    const contributions = [
      ["Material", scores.material, 25],
      ["Jarak", scores.distance, weights.distance * .5],
      ["Volume", scores.volume, 15],
      ["Rating", scores.rating, 10],
      ["Harga", scores.price, weights.price * .5],
      ["Karbon", scores.carbon, weights.carbon * .5],
    ];
    drawer.querySelector(".js-drawer-name").textContent = item.name;
    drawer.querySelector(".js-drawer-score").textContent = `${score}%`;
    drawer.querySelector(".js-drawer-summary").textContent = `${item.material} · ${item.distance} km · bobot aktif ${weights.distance}% jarak, ${weights.price}% harga, ${weights.carbon}% karbon.`;
    drawer.querySelector(".js-drawer-impact").textContent = `${item.impact} tCO₂e`;
    drawer.querySelector(".js-drawer-breakdown").innerHTML = contributions.map(([label, factor, contribution]) => `<div><span>${label}</span><i style="--w:${factor}%"></i><strong>${formatNumber(contribution, 1)}%</strong></div>`).join("");
    drawer.querySelector(".js-detail-link").href = `match-detail.html?id=${item.id}`;
    drawer.classList.add("is-open");
  };

  document.querySelectorAll("[data-priority]").forEach((range) => range.addEventListener("input", () => {
    balanceRanges(range, "[data-priority]");
    document.querySelectorAll("[data-priority]").forEach((item) => { weights[item.dataset.priority] = Number(item.value); });
    renderMatches();
    if (activeMatchId) openDrawer(activeMatchId);
  }));
  document.querySelector(".js-match-category")?.addEventListener("change", renderMatches);
  document.querySelector(".js-match-sort")?.addEventListener("change", renderMatches);
  document.querySelector(".js-radius-filter")?.addEventListener("input", (event) => {
    document.querySelector(".js-radius-value").textContent = event.target.value;
    renderMatches();
  });
  document.querySelector(".drawer-close")?.addEventListener("click", () => drawer?.classList.remove("is-open"));
  renderMatches();

  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelector(".js-match-grid")?.toggleAttribute("hidden", button.dataset.view === "map");
    document.querySelector(".js-matching-map")?.classList.toggle("is-active", button.dataset.view === "map");
    if (button.dataset.view === "list" && activeMatchId) {
      requestAnimationFrame(() => document.querySelector(`.match-card[data-match-id="${activeMatchId}"]`)?.scrollIntoView({ behavior:"smooth", block:"center" }));
    }
  }));

  const listingPriorityRanges = [...document.querySelectorAll(".js-listing-priority")];
  listingPriorityRanges.forEach((range) => range.addEventListener("input", () => balanceRanges(range, ".js-listing-priority")));

  const carbonRange = page === "carbon-market.html" ? document.querySelector('[data-range-output=".carbon-output"]') : null;
  const carbonCost = carbonRange?.closest(".dash-card")?.querySelector("strong[style]");
  const updateCarbonCost = () => { if (carbonRange && carbonCost) carbonCost.textContent = formatCurrency(Number(carbonRange.value) * 148000); };
  carbonRange?.addEventListener("input", updateCarbonCost);
  updateCarbonCost();

  document.querySelectorAll("[data-sort-carbon]").forEach((button) => button.addEventListener("click", () => {
    const tbody = document.querySelector(".js-carbon-table tbody");
    if (!tbody) return;
    const key = button.dataset.sortCarbon;
    const direction = button.dataset.direction === "asc" ? -1 : 1;
    button.dataset.direction = direction === 1 ? "asc" : "desc";
    [...tbody.rows].sort((a, b) => {
      const av = a.dataset[key];
      const bv = b.dataset[key];
      return Number.isNaN(Number(av)) ? av.localeCompare(bv) * direction : (Number(av) - Number(bv)) * direction;
    }).forEach((row) => tbody.appendChild(row));
  }));

  document.querySelectorAll("[data-impact-period]").forEach((button) => button.addEventListener("click", () => {
    const data = {
      "7": [426, 168, 84, 612], "30": [1846, 728, 426, 4281], "365": [18240, 7190, 1284, 31892],
    }[button.dataset.impactPeriod];
    document.querySelectorAll("[data-impact-period]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-impact-value]").forEach((node, index) => {
      node.textContent = formatNumber(data[index]) + (index < 2 ? " t" : "");
    });
    const chartTotal = document.querySelector(".dash-card--wide svg text");
    if (chartTotal) chartTotal.textContent = `${formatNumber(data[0])} t`;
  }));

  const marketData = [
    ["PET Bening Terkompresi","Plastik","Denpasar","12 ton","IDR 14.800/kg","Grade A"],
    ["rPET Flakes Food Grade","Plastik","Surabaya","18 ton","IDR 18.200/kg","Terverifikasi"],
    ["HDPE Campuran Warna","Plastik","Bandung","9 ton","IDR 11.400/kg","Grade B"],
    ["Serat Katun Pulih","Tekstil","Bandung","8 ton","IDR 9.200/kg","Katun 82%"],
    ["Potongan Poliester","Tekstil","Semarang","14 ton","IDR 7.800/kg","Terpilah"],
    ["Aluminium UBC","Logam","Surabaya","15 ton","IDR 22.400/kg","IoT weighed"],
    ["Tembaga Kabel","Logam","Denpasar","3 ton","IDR 81.000/kg","Kemurnian 94%"],
    ["Kardus OCC Bale","Kertas/Pulp","Denpasar","22 ton","IDR 3.100/kg","Kering"],
    ["Pulp Kertas Pulih","Kertas/Pulp","Semarang","17 ton","IDR 5.600/kg","FSC Mix"],
    ["Cullet Kaca Bening","Kaca","Surabaya","26 ton","IDR 2.400/kg","Warna terpilah"],
  ].map((item, index) => ({ id:`BTH-${1082-index}`, name:item[0], category:item[1], location:item[2], volume:item[3], price:item[4], badge:item[5] }));
  const renderMaterialMarket = () => {
    const grid = document.querySelector(".js-material-market-grid");
    if (!grid) return;
    const categoryValue = document.querySelector(".js-market-category")?.value || "all";
    const locationValue = document.querySelector(".js-market-location")?.value || "all";
    const items = marketData.filter((item) => (categoryValue === "all" || item.category === categoryValue) && (locationValue === "all" || item.location === locationValue));
    document.querySelector(".js-market-count").textContent = items.length;
    grid.innerHTML = items.map((item) => `<article class="match-card"><span class="match-card__badge">${item.badge}</span><h2>${item.name}</h2><p>${item.category} · ${item.location}</p><div class="match-card__meta"><span>Volume<strong>${item.volume}</strong></span><span>Harga<strong>${item.price}</strong></span><span>ID batch<strong>${item.id}</strong></span></div><a class="eco-button" href="material-detail.html?id=${item.id}" style="margin-top:18px">Detail & tawarkan harga</a></article>`).join("");
  };
  [".js-market-category",".js-market-location"].forEach((selector) => document.querySelector(selector)?.addEventListener("change", renderMaterialMarket));
  renderMaterialMarket();

  const partnerData = [
    ["Bali PET Recycling","PET, HDPE","Denpasar",284,4.9],
    ["Nusa Circular Hub","Plastik, Kertas","Denpasar",168,4.7],
    ["Koperasi Serat Kembali","Tekstil","Bandung",231,4.8],
    ["Surya Metal Loop","Logam","Surabaya",92,4.8],
    ["Pulp Kembali Nusantara","Kertas/Pulp","Surabaya",76,4.6],
    ["Kaca Lestari Indonesia","Kaca","Semarang",64,4.7],
    ["Aruna Textile Recovery","Tekstil","Bandung",48,4.5],
    ["BioLoop Organik","Organik","Surabaya",37,4.4],
    ["E-Cycle Teknologi","Elektronik","Semarang",22,4.6],
    ["Bank Sampah Melati","Plastik, Kertas","Denpasar",9,4.3],
  ].map((item,index) => ({ id:`MIT-${210+index}`, name:item[0], materials:item[1], location:item[2], transactions:item[3], rating:item[4], badge:item[3]>50?"Gold":item[3]>=10?"Silver":"Bronze" }));
  const renderPartners = () => {
    const grid = document.querySelector(".js-partner-grid");
    if (!grid) return;
    const query = (document.querySelector(".js-partner-search")?.value || "").toLowerCase();
    const location = document.querySelector(".js-partner-location")?.value || "all";
    const items = partnerData.filter((item) => (!query || `${item.name} ${item.materials}`.toLowerCase().includes(query)) && (location === "all" || item.location === location));
    document.querySelector(".js-partner-count").textContent = items.length;
    grid.innerHTML = items.map((item) => `<article class="layer-card"><span>${item.badge.toUpperCase()} · ★ ${item.rating}</span><svg viewBox="0 0 400 210"><path d="M75 170V92l76 35V73l85 48V55l90 52v63z"/></svg><h3>${item.name}</h3><p>${item.materials} · ${item.location} · ${item.transactions} transaksi selesai.</p><a href="partner-detail.html?id=${item.id}" class="eco-button" style="margin-top:20px">Lihat profil</a></article>`).join("");
  };
  document.querySelector(".js-partner-search")?.addEventListener("input", renderPartners);
  document.querySelector(".js-partner-location")?.addEventListener("change", renderPartners);
  renderPartners();

  const offerQuantity = document.querySelector(".js-offer-quantity");
  const offerPrice = document.querySelector(".js-offer-price");
  const updateOffer = () => {
    if (!offerQuantity || !offerPrice) return;
    document.querySelector(".js-offer-quantity-value").textContent = offerQuantity.value;
    document.querySelector(".js-offer-total").textContent = formatCurrency(Number(offerQuantity.value) * 1000 * Number(offerPrice.value));
  };
  offerQuantity?.addEventListener("input", updateOffer);
  offerPrice?.addEventListener("input", updateOffer);
  updateOffer();
  document.querySelector(".js-submit-offer")?.addEventListener("click", (event) => {
    event.currentTarget.textContent = "Penawaran berhasil diajukan";
    event.currentTarget.disabled = true;
  });

  const transactionButton = document.querySelector(".js-advance-status");
  if (transactionButton) {
    let status = 1;
    transactionButton.addEventListener("click", () => {
      status = Math.min(status + 1, 4);
      document.querySelectorAll(".status-stepper div").forEach((step, index) => step.classList.toggle("is-done", index < status));
      transactionButton.textContent = status === 4 ? "Transaksi selesai dan terverifikasi" : "Lanjutkan status simulasi";
      if (status === 4) {
        transactionButton.disabled = true;
        document.querySelector(".certificate-wrap").hidden = false;
        document.querySelector(".certificate-wrap").scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  document.querySelector(".js-download-certificate")?.addEventListener("click", () => window.print());
  document.querySelector(".js-listing-submit")?.addEventListener("click", () => {
    localStorage.setItem("revoraListingCreated", "true");
    window.location.href = "matching.html";
  });
});
