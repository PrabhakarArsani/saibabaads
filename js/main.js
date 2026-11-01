(function () {
  /** +91 970 3333 878 — digits only, with country code (no + or spaces) */
  const WHATSAPP_NUMBER = "919703333878";
  const DEFAULT_QUOTE_TEXT =
    "Hi Sai Baba Ads, I would like to get a quote for printing/signage.";

  const whatsAppQuoteUrl = (text) => {
    const msg = encodeURIComponent(text || DEFAULT_QUOTE_TEXT);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  };

  const ensureWhatsAppBridge = () => {
    let form = document.getElementById("whatsapp-bridge");
    if (form) return form;

    form = document.createElement("form");
    form.id = "whatsapp-bridge";
    form.method = "GET";
    form.action = `https://wa.me/${WHATSAPP_NUMBER}`;
    form.style.cssText =
      "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
    const textInput = document.createElement("input");
    textInput.type = "hidden";
    textInput.name = "text";
    textInput.id = "whatsapp-bridge-text";
    form.appendChild(textInput);
    document.body.appendChild(form);
    return form;
  };

  const buildQuoteMessageFromForm = (form) => {
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    const serviceEl = form.querySelector('[name="service"]');
    const serviceLabel =
      serviceEl?.options[serviceEl.selectedIndex]?.text?.trim() || "";

    return [
      "Hi Sai Baba Ads, I would like a quote.",
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      email && `Email: ${email}`,
      serviceLabel && `Service: ${serviceLabel}`,
      message && `Details: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const openWhatsAppQuote = (text) => {
    const message = text || DEFAULT_QUOTE_TEXT;
    const form = ensureWhatsAppBridge();
    const textInput = document.getElementById("whatsapp-bridge-text");
    if (textInput) textInput.value = message;

    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    form.target = mobile ? "_self" : "_blank";
    form.action = `https://wa.me/${WHATSAPP_NUMBER}`;
    form.submit();
  };

  document.querySelectorAll("[data-wa-quote]").forEach((el) => {
    const custom = el.getAttribute("data-wa-message");
    const href = whatsAppQuoteUrl(custom || DEFAULT_QUOTE_TEXT);
    if (el.tagName === "A") {
      el.setAttribute("href", href);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
    el.addEventListener("click", (e) => {
      if (el.tagName === "A") return;
      e.preventDefault();
      openWhatsAppQuote(custom || DEFAULT_QUOTE_TEXT);
    });
  });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navInner = header?.querySelector(".nav-inner");
  const mobileNavMq = window.matchMedia("(max-width: 768px)");

  let navBackdrop = document.querySelector(".mobile-nav-backdrop");
  if (!navBackdrop) {
    navBackdrop = document.createElement("div");
    navBackdrop.className = "mobile-nav-backdrop";
    navBackdrop.setAttribute("aria-hidden", "true");
    document.body.insertBefore(navBackdrop, document.body.firstChild);
  }

  const syncMobileNavPlacement = () => {
    if (!navLinks || !navInner) return;
    if (mobileNavMq.matches) {
      if (navLinks.parentElement !== document.body) {
        document.body.appendChild(navLinks);
      }
    } else if (navLinks.parentElement === document.body) {
      navInner.appendChild(navLinks);
    }
  };

  syncMobileNavPlacement();
  mobileNavMq.addEventListener("change", syncMobileNavPlacement);

  if (header) {
    const onScroll = () => {
      if (document.body.classList.contains("menu-open")) return;
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && navLinks) {
    const setMenuOpen = (open) => {
      navLinks.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      navBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
      if (header) {
        header.classList.toggle("menu-active", open);
        header.classList.toggle("scrolled", open || window.scrollY > 40);
      }
    };

    const closeMenu = () => setMenuOpen(false);

    toggle.addEventListener("click", () => {
      setMenuOpen(!navLinks.classList.contains("open"));
    });

    navBackdrop.addEventListener("click", closeMenu);

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html")
    ) {
      a.classList.add("active");
    }
  });

  document.querySelectorAll(".hero-text, .hero-visual").forEach((el) => {
    el.classList.add("visible");
  });

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 0px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            run();
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
    } else {
      run();
    }
  });

  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("form-success");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      openWhatsAppQuote(buildQuoteMessageFromForm(contactForm));
      if (contactSuccess) {
        contactSuccess.textContent =
          "Opening WhatsApp to send your quote request…";
        contactSuccess.style.display = "block";
        setTimeout(() => {
          contactSuccess.style.display = "none";
        }, 5000);
      }
      contactForm.reset();
    });
  }

  const popup = document.getElementById("home-quote-popup");
  if (popup) {
    const openPopup = () => {
      popup.removeAttribute("hidden");
      requestAnimationFrame(() => {
        popup.classList.add("is-open");
      });
      document.body.classList.add("popup-open");
    };

    const closePopup = () => {
      popup.classList.remove("is-open");
      document.body.classList.remove("popup-open");
      setTimeout(() => {
        if (!popup.classList.contains("is-open")) {
          popup.setAttribute("hidden", "");
        }
      }, 350);
    };

    popup.querySelectorAll("[data-close-popup]").forEach((el) => {
      el.addEventListener("click", closePopup);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popup.classList.contains("is-open")) {
        closePopup();
      }
    });

    const popupForm = document.getElementById("popup-quote-form");
    const popupSuccess = document.getElementById("popup-form-success");
    if (popupForm) {
      popupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = buildQuoteMessageFromForm(popupForm);
        openWhatsAppQuote(message);
      });
    }

    setTimeout(openPopup, 600);
  }

  const PORTFOLIO = window.SAI_BABA_PORTFOLIO || [];

  const galleryModal = document.getElementById("service-gallery-modal");
  if (galleryModal) {
    const galleryImg = document.getElementById("service-gallery-img");
    const galleryTitle = document.getElementById("service-gallery-title");
    const galleryCounter = document.getElementById("service-gallery-counter");
    const prevBtn = galleryModal.querySelector(".service-gallery-prev");
    const nextBtn = galleryModal.querySelector(".service-gallery-next");

    let galleryImages = [];
    let galleryIndex = 0;

    const renderGallerySlide = () => {
      if (!galleryImages.length || !galleryImg) return;
      galleryImg.src = galleryImages[galleryIndex];
      galleryImg.alt = `${galleryTitle?.textContent || "Our work"} — photo ${galleryIndex + 1}`;
      if (galleryCounter) {
        galleryCounter.textContent =
          galleryImages.length > 1
            ? `${galleryIndex + 1} / ${galleryImages.length}`
            : "";
      }
      if (prevBtn) prevBtn.disabled = galleryIndex <= 0;
      if (nextBtn) nextBtn.disabled = galleryIndex >= galleryImages.length - 1;
    };

    const openGallery = (title, images, startIndex = 0) => {
      galleryImages = images;
      galleryIndex = Math.max(0, Math.min(startIndex, images.length - 1));
      if (galleryTitle) galleryTitle.textContent = title;
      renderGallerySlide();
      galleryModal.removeAttribute("hidden");
      requestAnimationFrame(() => galleryModal.classList.add("is-open"));
      document.body.classList.add("gallery-open");
    };

    const openFullPortfolio = (startIndex = 0) => {
      if (!PORTFOLIO.length) return;
      openGallery("Our work — full gallery", PORTFOLIO, startIndex);
    };

    const closeGallery = () => {
      galleryModal.classList.remove("is-open");
      document.body.classList.remove("gallery-open");
      setTimeout(() => {
        if (!galleryModal.classList.contains("is-open")) {
          galleryModal.setAttribute("hidden", "");
          if (galleryImg) galleryImg.src = "";
        }
      }, 350);
    };

    const buildMarqueeItems = (track, sources) => {
      if (!track || !sources.length) return;
      track.innerHTML = "";
      const createSet = () => {
        sources.forEach((src) => {
          const globalIndex = PORTFOLIO.indexOf(src);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "work-marquee-item";
          btn.dataset.portfolioIndex = String(globalIndex >= 0 ? globalIndex : 0);
          const img = document.createElement("img");
          img.src = src;
          img.alt = "Sai Baba Ads project photo";
          img.loading = "lazy";
          img.decoding = "async";
          btn.appendChild(img);
          btn.addEventListener("click", () => {
            openFullPortfolio(parseInt(btn.dataset.portfolioIndex, 10) || 0);
          });
          track.appendChild(btn);
        });
      };
      createSet();
      createSet();
    };

    document.querySelectorAll("[data-marquee-track]").forEach((track) => {
      if (track.hasAttribute("data-marquee-hero")) {
        buildMarqueeItems(track, PORTFOLIO.slice(0, 10));
        return;
      }
      const row = track.getAttribute("data-marquee-row");
      const half = Math.ceil(PORTFOLIO.length / 2);
      if (row === "2") {
        buildMarqueeItems(track, PORTFOLIO.slice(half));
      } else {
        buildMarqueeItems(track, PORTFOLIO.slice(0, half));
      }
    });

    document.querySelectorAll(".service-card--portfolio").forEach((card) => {
      card.addEventListener("click", () => {
        const src = card.getAttribute("data-portfolio-src");
        const idx = src ? PORTFOLIO.indexOf(src) : 0;
        openFullPortfolio(idx >= 0 ? idx : 0);
      });
    });

    document.querySelectorAll(".service-list-item--gallery").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        let images = [];
        try {
          images = JSON.parse(trigger.getAttribute("data-gallery") || "[]");
        } catch {
          images = [];
        }
        if (!images.length) return;
        const first = images[0];
        const idxInPortfolio = PORTFOLIO.indexOf(first);
        if (idxInPortfolio >= 0 && PORTFOLIO.length) {
          openFullPortfolio(idxInPortfolio);
        } else {
          openGallery(trigger.getAttribute("data-gallery-title") || "Our work", images, 0);
        }
      });
    });

    galleryModal.querySelectorAll("[data-close-gallery]").forEach((el) => {
      el.addEventListener("click", closeGallery);
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (galleryIndex > 0) {
          galleryIndex -= 1;
          renderGallerySlide();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (galleryIndex < galleryImages.length - 1) {
          galleryIndex += 1;
          renderGallerySlide();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!galleryModal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft" && galleryIndex > 0) {
        galleryIndex -= 1;
        renderGallerySlide();
      }
      if (e.key === "ArrowRight" && galleryIndex < galleryImages.length - 1) {
        galleryIndex += 1;
        renderGallerySlide();
      }
    });
  }
})();
