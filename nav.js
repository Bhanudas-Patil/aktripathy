document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link[data-submenu]");
  const submenus = document.querySelectorAll(".submenu");
  const menuExpander = document.getElementById("menu-expander");
  let activeSubmenu = null;

  // --- NEW: Function to Highlight Current Page ---
  function setActiveLink() {
    // Get the current file name - more robust handling
    let currentPage = window.location.pathname.split("/").pop().trim();

    // Handle root path or empty path (default to index.html)
    if (!currentPage || currentPage === "") {
      currentPage = "index.html";
    }

    // 🔥 FIX: Handle Netlify clean URLs (no .html)
    if (!currentPage.includes(".")) {
      currentPage = currentPage + ".html";
    }

    // Select all nav buttons and links inside the nav container
    const navButtons = document.querySelectorAll("#nav-container .nav-link");
    const allLinks = document.querySelectorAll("#nav-container a");

    // First pass: find which page we're on and highlight it
    let highlightedPageLink = null;

    allLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");

      if (linkHref && linkHref !== "#") {
        // Extract the page name (handle anchors like publications.html#books)
        const pageFromLink = linkHref.split("#")[0].trim();

        // Check if this link matches the current page
        if (
          pageFromLink === currentPage ||
          (currentPage === "index.html" && pageFromLink === "")
        ) {
          // Mark this link as active
          link.classList.add("active-link");
          highlightedPageLink = link;

          // 2. If this link is inside a submenu, highlight the parent trigger button too
          const parentSubmenu = link.closest(".submenu");
          if (parentSubmenu) {
            const submenuId = parentSubmenu.id;
            // Find the main nav button that opens this submenu
            const parentTrigger = document.querySelector(
              `.nav-link[data-submenu="${submenuId}"]`,
            );
            if (parentTrigger) {
              parentTrigger.classList.add("active-link");
            }
          }
        }
      }
    });

    // Also highlight nav buttons that are direct links (like Book Chapters, Talks, Academics)
    navButtons.forEach((btn) => {
      const btnHref = btn.getAttribute("href");
      if (btnHref && btnHref !== "#") {
        const pageFromBtn = btnHref.split("#")[0].trim();
        if (pageFromBtn === currentPage) {
          btn.classList.add("active-link");
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
