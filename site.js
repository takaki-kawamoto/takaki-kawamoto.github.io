(() => {
  /* =========================
     Left menu active by URL
  ========================= */
  const leftNav = document.querySelector(".sidebar-left");
  if (leftNav) {
    const links = Array.from(leftNav.querySelectorAll("a[href]"));
    const normalizePath = (pathname) => pathname.replace(/\/$/, "/index.html");
    const currentPath = normalizePath(new URL(window.location.href).pathname);

    links.forEach((a) => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });

    for (const a of links) {
      const url = new URL(a.getAttribute("href"), window.location.href);
      const linkPath = normalizePath(url.pathname);
      if (linkPath === currentPath) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
        break;
      }
    }
  }

  /* =========================
     Right TOC scrollspy
  ========================= */
  const toc = document.querySelector(".sidebar-right");
  if (toc) {
    const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
    const idToLink = new Map();
    tocLinks.forEach((a) => {
      const id = decodeURIComponent(a.getAttribute("href").slice(1));
      idToLink.set(id, a);
    });

    const sections = Array.from(idToLink.keys())
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      tocLinks.forEach((a) => {
        a.classList.remove("active-toc");
        a.removeAttribute("aria-current");
      });
      const a = idToLink.get(id);
      if (a) {
        a.classList.add("active-toc");
        a.setAttribute("aria-current", "true");
      }
    };

    let lastActiveId = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;

        const id = visible[0].target.id;
        if (!id || id === lastActiveId) return;
        lastActiveId = id;
        setActive(id);
      },
      { root: null, rootMargin: "-92px 0px -65% 0px", threshold: 0.01 }
    );

    sections.forEach((sec) => observer.observe(sec));

    tocLinks.forEach((a) => {
      a.addEventListener("click", () => {
        const id = decodeURIComponent(a.getAttribute("href").slice(1));
        if (idToLink.has(id)) setActive(id);
      });
    });

    if (sections[0]) setActive(sections[0].id);
  }

  /* =========================
     Copy Email button
  ========================= */
  const btn = document.getElementById("copy-email");
  const emailEl = document.getElementById("email-text");

  if (btn && emailEl) {
    btn.addEventListener("click", async () => {
      const raw = emailEl.textContent.trim();
      const email = raw.replace("◎", "@");
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = "Copy Email"; }, 900);
      } catch (e) {
        /* fallback */
        const ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = "Copy Email"; }, 900);
      }
    });
  }
})();
