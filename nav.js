document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link[data-submenu]");
  const submenus = document.querySelectorAll(".submenu");
  const menuExpander = document.getElementById("menu-expander");
  let activeSubmenu = null;

  // --- NEW: Function to Highlight Current Page ---
  
  function setActiveLink() {
    console.log("Running active link logic");

    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    const links = document.querySelectorAll("#nav-container a");

    links.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      console.log("Checking link:", href);

      // Remove .html from href
      const cleanHref = href.replace(".html", "");

      // Match logic
      if (
        (currentPath === "/" && cleanHref === "index") ||
        currentPath.includes(cleanHref)
      ) {
        console.log("Matched:", href);
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
