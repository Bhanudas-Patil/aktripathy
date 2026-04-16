document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link[data-submenu]");
  const submenus = document.querySelectorAll(".submenu");
  const menuExpander = document.getElementById("menu-expander");
  let activeSubmenu = null;

  function setActiveLink() {
    const currentPath = window.location.pathname
      .replace(/\.html$/, "") // strip .html
      .replace(/\/$/, "") // strip trailing slash
      .toLowerCase();

    const links = document.querySelectorAll("#nav-container a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      // Normalize href the same way
      const cleanHref = href
        .replace(/\.html$/, "")
        .replace(/^\.\//, "") // strip leading ./
        .replace(/\/$/, "")
        .toLowerCase();

      // Build the expected path (e.g. "/experience")
      const expectedPath = cleanHref.startsWith("/")
        ? cleanHref
        : "/" + cleanHref;

      const isHome =
        (currentPath === "" || currentPath === "/index") &&
        (cleanHref === "index" || cleanHref === "" || expectedPath === "/");

      const isMatch = isHome || currentPath === expectedPath;

      if (isMatch) {
        link.classList.add("active-link");

        // Highlight parent nav trigger if inside a submenu
        const parentSubmenu = link.closest(".submenu");
        if (parentSubmenu) {
          const parentTrigger = document.querySelector(
            `.nav-link[data-submenu="${parentSubmenu.id}"]`,
          );
          if (parentTrigger) {
            parentTrigger.classList.add("active-link");
          }
        }
      }
    });
  }

  setActiveLink();

  // --- EXISTING NAVIGATION LOGIC (unchanged) ---
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSubmenuId = this.dataset.submenu;
      const targetSubmenu = document.getElementById(targetSubmenuId);

      if (activeSubmenu === targetSubmenu) {
        targetSubmenu.classList.toggle("visible");
        if (!targetSubmenu.classList.contains("visible")) {
          activeSubmenu = null;
        }
      } else {
        if (activeSubmenu) activeSubmenu.classList.remove("visible");
        if (targetSubmenu) {
          targetSubmenu.classList.add("visible");
          activeSubmenu = targetSubmenu;
        } else {
          activeSubmenu = null;
        }
      }

      const isAnySubmenuVisible =
        !!activeSubmenu && activeSubmenu.classList.contains("visible");
      menuExpander.classList.toggle("expanded", isAnySubmenuVisible);
    });
  });

  menuExpander.addEventListener("click", () => {
    if (activeSubmenu && activeSubmenu.classList.contains("visible")) {
      activeSubmenu.classList.remove("visible");
      menuExpander.classList.remove("expanded");
      activeSubmenu = null;
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#nav-container")) {
      if (activeSubmenu) {
        activeSubmenu.classList.remove("visible");
        menuExpander.classList.remove("expanded");
        activeSubmenu = null;
      }
    }
  });
});
