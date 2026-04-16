document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link[data-submenu]");
  const submenus = document.querySelectorAll(".submenu");
  const menuExpander = document.getElementById("menu-expander");
  let activeSubmenu = null;

  // --- NEW: Function to Highlight Current Page ---
  function setActiveLink() {
    // Get the current file name (e.g., "research.html")
    // If path is empty (root), default to "index.html"
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    // Select all links inside the nav container
    const allLinks = document.querySelectorAll("#nav-container a");

    allLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");

      // Check if the link matches the current page
      // (We split by '#' to handle anchors like publications.html#books)
      if (linkHref && linkHref.split("#")[0] === currentPage) {
        // 1. Add 'active-link' class to the link itself
        link.classList.add("active-link");

        // 2. If this link is inside a submenu, highlight the parent trigger button too
        const parentSubmenu = link.closest(".submenu");
        if (parentSubmenu) {
          const submenuId = parentSubmenu.id;
          // Find the main nav button that opens this submenu
          const parentTrigger = document.querySelector(
            `.nav-link[data-submenu="${submenuId}"]`
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
