document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const isAuthenticated = localStorage.getItem("revoraAuth") === "true";
  const loader = document.querySelector(".intro-loader");
  const navbar = document.querySelector(".navbar");
  const announcement = document.querySelector(".announcement");
  const announcementClose = document.querySelector(".announcement__close");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isAuthenticated) {
    const desktopLinks = document.querySelector(".navbar__links");
    const mobileLinksContainer = document.querySelector(".mobile-menu__links");
    desktopLinks?.insertAdjacentHTML(
      "beforeend",
      '<a href="activity.html">Dashboard</a>',
    );
    mobileLinksContainer?.insertAdjacentHTML(
      "beforeend",
      '<a href="activity.html">Dashboard <span>06</span></a>',
    );
    document.querySelector(".navbar__actions")?.replaceChildren();
    document.querySelector(".navbar__actions")?.insertAdjacentHTML(
      "beforeend",
      '<a class="button button--light button--small" href="activity.html">Dashboard</a>',
    );
  }
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  window.setTimeout(
    () => {
      loader?.classList.add("is-hidden");
    },
    reducedMotion ? 0 : 1050,
  );

  announcementClose?.addEventListener("click", () => {
    announcement.style.display = "none";
  });

  const toggleMenu = (forceOpen) => {
    const shouldOpen =
      typeof forceOpen === "boolean"
        ? forceOpen
        : !mobileMenu.classList.contains("is-open");

    menuToggle.classList.toggle("is-active", shouldOpen);
    mobileMenu.classList.toggle("is-open", shouldOpen);
    body.classList.toggle("menu-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute(
      "aria-label",
      shouldOpen ? "Tutup navigasi" : "Buka navigasi",
    );
  };

  menuToggle?.addEventListener("click", () => toggleMenu());
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  const updateNavbar = () => {
    const announcementHeight =
      announcement && announcement.style.display !== "none"
        ? announcement.offsetHeight
        : 0;
    navbar.classList.toggle("is-fixed", window.scrollY > announcementHeight + 90);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  const revealElements = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px" },
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min((index % 3) * 70, 140)}ms`;
      revealObserver.observe(element);
    });
  }

  const workflowSteps = document.querySelectorAll(".workflow-step");
  const workflowPanels = document.querySelectorAll(".workflow-panel");

  workflowSteps.forEach((step) => {
    step.addEventListener("click", () => {
      const target = step.dataset.workflow;

      workflowSteps.forEach((item) => {
        const isActive = item === step;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      workflowPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === target);
      });
    });
  });

  const roleTabs = document.querySelectorAll(".role-tabs button");
  const rolePanels = document.querySelectorAll(".role-panel");

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.role;
      roleTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      rolePanels.forEach((panel) => {
        panel.classList.toggle(
          "is-active",
          panel.dataset.rolePanel === target,
        );
      });
    });
  });

  const filterButtons = document.querySelectorAll(".market-filters button");
  const marketCards = document.querySelectorAll(".market-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach((item) =>
        item.classList.toggle("is-active", item === button),
      );

      marketCards.forEach((card) => {
        const shouldShow =
          category === "all" || card.dataset.category === category;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  document.querySelectorAll(".market-card__image > button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-saved");
      button.setAttribute(
        "aria-label",
        button.classList.contains("is-saved")
          ? "Hapus dari simpanan"
          : "Simpan produk",
      );
    });
  });

  const counters = document.querySelectorAll(".counter");
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter);
    const duration = 1400;
    const start = performance.now();

    const update = (currentTime) => {
      const progress = Math.min((currentTime - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString("en-US");

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.counter).toLocaleString("en-US");
    });
  }

  const sectionLinks = document.querySelectorAll(
    '.section-nav a[href^="#"]:not(.section-nav__action)',
  );
  const trackedSections = [...sectionLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 },
    );
    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  const videoModal = document.querySelector(".video-modal");
  const videoButton = document.querySelector(".js-video-button");
  const videoClose = document.querySelector(".video-modal__close");

  const setModal = (isOpen) => {
    videoModal.hidden = !isOpen;
    body.classList.toggle("modal-open", isOpen);
    if (isOpen) videoClose.focus();
  };

  videoButton?.addEventListener("click", () => setModal(true));
  videoClose?.addEventListener("click", () => setModal(false));
  videoModal?.addEventListener("click", (event) => {
    if (event.target === videoModal) setModal(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoModal.hidden) setModal(false);
  });

  document.querySelector(".back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  document.querySelector(".footer__newsletter form")?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector("button");
      const input = event.currentTarget.querySelector("input");

      if (!input.value.trim()) {
        input.focus();
        return;
      }

      button.textContent = "✓";
      input.value = "";
      input.placeholder = "Anda telah terdaftar";
    },
  );
});
