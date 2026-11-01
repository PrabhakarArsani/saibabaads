(function () {
  const VIDEOS = Array.from({ length: 17 }, (_, i) => `videos/${i + 1}.mp4`);

  const rail = document.getElementById("signage-video-grid");
  const modal = document.getElementById("signage-video-modal");
  if (!rail || !modal) return;

  const player = document.getElementById("signage-video-player");
  const counter = document.getElementById("signage-video-counter");
  const railPrev = document.getElementById("signage-rail-prev");
  const railNext = document.getElementById("signage-rail-next");

  let currentIndex = 0;

  const setModalVideo = (index) => {
    currentIndex = index;
    if (!player) return;
    player.src = VIDEOS[index];
    player.load();
    player.play().catch(() => {});
    if (counter) {
      counter.textContent =
        VIDEOS.length > 1 ? `${index + 1} / ${VIDEOS.length}` : "";
    }
  };

  const openModal = (index) => {
    setModalVideo(index);
    modal.removeAttribute("hidden");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.classList.add("gallery-open");
  };

  const closeModal = () => {
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    modal.classList.remove("is-open");
    document.body.classList.remove("gallery-open");
    setTimeout(() => {
      if (!modal.classList.contains("is-open")) modal.setAttribute("hidden", "");
    }, 350);
  };

  const scrollRail = (direction) => {
    const amount = Math.min(rail.clientWidth * 0.85, 420);
    rail.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (railPrev) railPrev.addEventListener("click", () => scrollRail(-1));
  if (railNext) railNext.addEventListener("click", () => scrollRail(1));

  let touchMoved = false;
  let touchStartX = 0;
  let touchStartY = 0;

  rail.addEventListener(
    "touchstart",
    (e) => {
      touchMoved = false;
      if (e.touches.length) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  rail.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches.length) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > dy && dx > 8) touchMoved = true;
    },
    { passive: true }
  );

  VIDEOS.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "signage-reel-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    if (index % 5 === 0) card.classList.add("signage-reel-card--tall");
    card.setAttribute("aria-label", "Play video");

    const frame = document.createElement("div");
    frame.className = "signage-reel-frame";

    const preview = document.createElement("video");
    preview.className = "signage-reel-preview";
    preview.src = src;
    preview.muted = true;
    preview.playsInline = true;
    preview.preload = "metadata";
    preview.setAttribute("aria-hidden", "true");

    const gloss = document.createElement("div");
    gloss.className = "signage-reel-gloss";
    gloss.setAttribute("aria-hidden", "true");

    const play = document.createElement("span");
    play.className = "signage-reel-play";
    play.innerHTML = '<span class="signage-reel-play-dot"></span>';

    frame.append(preview, gloss, play);
    card.appendChild(frame);

    const activate = () => {
      if (touchMoved) return;
      openModal(index);
    };

    card.addEventListener("click", activate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });

    card.addEventListener("mouseenter", () => {
      preview.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      preview.pause();
      preview.currentTime = 0;
    });

    rail.appendChild(card);
  });

  modal.querySelectorAll("[data-close-signage-video]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  const prevBtn = modal.querySelector(".signage-video-prev");
  const nextBtn = modal.querySelector(".signage-video-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) setModalVideo(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < VIDEOS.length - 1) setModalVideo(currentIndex + 1);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft" && currentIndex > 0) setModalVideo(currentIndex - 1);
    if (e.key === "ArrowRight" && currentIndex < VIDEOS.length - 1) {
      setModalVideo(currentIndex + 1);
    }
  });
})();
