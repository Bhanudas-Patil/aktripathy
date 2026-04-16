document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link[data-submenu]");
  const submenus = document.querySelectorAll(".submenu");
  const menuExpander = document.getElementById("menu-expander");
  let activeSubmenu = null;

  // --- NEW: Function to Highlight Current Page ---
  
  function setActiveLink() {
    let currentPath = window.location.pathname.toLowerCase();

    // Normalize path
    if (currentPath.endsWith("/")) {
      currentPath = currentPath.slice(0, -1);
    }

    if (currentPath === "") {
      currentPath = "/";
    }

    const allLinks = document.querySelectorAll("#nav-container a");

    allLinks.forEach((link) => {
      let href = link.getAttribute("href");

      if (!href || href === "#") return;

      // Normalize link
      href = href.toLowerCase().replace(".html", "");

      // Match cases:
      if (
        (currentPath === "/" && href === "index") ||
        (currentPath === "/" && href === "") ||
        currentPath.includes(href)
      ) {
        link.classList.add("active-link");

        // Highlight parent submenu
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
  // Run the highlighter immediately
  setActiveLink();

  // --- EXISTING NAVIGATION LOGIC ---
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSubmenuId = this.dataset.submenu;
      const targetSubmenu = document.getElementById(targetSubmenuId);

      // If clicking the same link, toggle it
      if (activeSubmenu === targetSubmenu) {
        targetSubmenu.classList.toggle("visible");
        // If we just closed it, clear activeSubmenu
        if (!targetSubmenu.classList.contains("visible")) {
          activeSubmenu = null;
        }
      } else {
        // Close previous
        if (activeSubmenu) {
          activeSubmenu.classList.remove("visible");
        }
        // Open new
        if (targetSubmenu) {
          targetSubmenu.classList.add("visible");
          activeSubmenu = targetSubmenu;
        } else {
          activeSubmenu = null;
        }
      }

      // Update expander icon
      const isAnySubmenuVisible =
        !!activeSubmenu && activeSubmenu.classList.contains("visible");
      menuExpander.classList.toggle("expanded", isAnySubmenuVisible);
    });
  });

  // The expander button
  menuExpander.addEventListener("click", () => {
    if (activeSubmenu && activeSubmenu.classList.contains("visible")) {
      activeSubmenu.classList.remove("visible");
      menuExpander.classList.remove("expanded");
      activeSubmenu = null;
    }
  });

  // Close submenu when clicking outside
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
