// ===== Global Variables =====
let currentSection = "dashboard";
let isNavOpen = false;

// ===== DOM Elements =====
const btnNav = document.getElementById("btn-nav");
const sidenav = document.getElementById("sidenav");
const searchInput = document.getElementById("search");
const navItems = document.querySelectorAll(".nav-item");
const apps = document.querySelectorAll(".app");
const quickDockItems = document.querySelectorAll(".quick-dock-item");

// ===== Initialize Everything =====
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  initializeSidebar();
  initializeSearch();
  initializeApps();
  initializeQuickDock();
  initializeLazyLoading();
  initializeSmoothScrolling();
  initializeAccessibility();
  initializeHeaderInteractions();
  initializeHeroSection();
});

// ===== Animation Initialization =====
function initializeAnimations() {
  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
    });
  }

  // Initialize Particles.js
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.1 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  // Initialize GSAP
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin();

    // Hero animation on load
    const heroTimeline = gsap.timeline();
    heroTimeline
      .from(".hero-logo", {
        scale: 0,
        rotation: 180,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
      .from(
        ".hero h2",
        { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .from(
        ".hero p",
        { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Body animation on load
    window.addEventListener("load", () => {
      gsap.from("body", { opacity: 0, duration: 0.5, ease: "power2.out" });
    });
  }
}

// ===== Sidebar Initialization =====
function initializeSidebar() {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Enhanced Sidebar Interactions
  const sidebarSearch = document.querySelector(".sidebar-search input");
  const navItems = document.querySelectorAll(".nav-item");

  // Sidebar search functionality
  if (sidebarSearch) {
    sidebarSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      navItems.forEach((item) => {
        const text = item
          .querySelector(".nav-item-text")
          .textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = "flex";
          item.style.opacity = "1";
        } else {
          item.style.opacity = "0.3";
        }
      });
    });
  }

  // Enhanced nav item interactions
  navItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(item, {
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    });

    item.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(item, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    });
  });

  // Sidebar stats animation
  const statValues = document.querySelectorAll(".stat-value");
  statValues.forEach((stat) => {
    const finalValue = parseInt(stat.textContent);
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        stat,
        { textContent: 0 },
        {
          textContent: finalValue,
          duration: 1.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          delay: 0.5,
        }
      );
    }
  });

  // Sidebar action buttons
  const sidebarActionBtns = document.querySelectorAll(".sidebar-action-btn");
  sidebarActionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const action = btn.textContent.toLowerCase();
      showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} clicked!`);

      // Add ripple effect
      addRippleEffect(btn, e);
    });
  });

  // Add ripple animation CSS
  addRippleCSS();
}

// ===== Navigation Functions =====
function toggleNav() {
  isNavOpen = !isNavOpen;
  sidenav.classList.toggle("open", isNavOpen);
  btnNav.setAttribute("aria-expanded", isNavOpen.toString());

  // Update hamburger icon
  const hamburgerIcon = btnNav.querySelector("i");
  if (hamburgerIcon) {
    hamburgerIcon.className = isNavOpen ? "fas fa-times" : "fas fa-bars";
  }
}

function navigateToSection(section) {
  // Remove active class from all nav items
  navItems.forEach((item) => item.classList.remove("active"));

  // Add active class to clicked item
  const activeItem = document.querySelector(`[data-section="${section}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  currentSection = section;

  // Close mobile nav if open
  if (isNavOpen) {
    toggleNav();
  }

  // Show toast notification
  showToast(
    `Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`
  );
}

// ===== Search Functionality =====
function initializeSearch() {
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase();
      if (query.length > 0) {
        searchContent(query);
      }
    }, 300);
  });

  // GSAP animation on search
  searchInput.addEventListener("focus", () => {
    if (typeof gsap !== "undefined") {
      gsap.to(searchInput, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    }
  });

  searchInput.addEventListener("blur", () => {
    if (typeof gsap !== "undefined") {
      gsap.to(searchInput, { scale: 1, duration: 0.2, ease: "power2.out" });
    }
  });
}

function searchContent(query) {
  // This would typically search through apps, people, and content
  console.log(`Searching for: ${query}`);
  showToast(`Searching for "${query}"...`);
}

// ===== Apps Functionality =====
function initializeApps() {
  apps.forEach((app) => {
    app.addEventListener("click", (e) => {
      e.preventDefault();

      // Add loading state
      const originalContent = app.innerHTML;
      app.innerHTML = '<div class="loading">Loading...</div>';
      app.style.pointerEvents = "none";

      // Simulate app loading
      setTimeout(() => {
        app.innerHTML = originalContent;
        app.style.pointerEvents = "auto";
        showToast("App opened successfully!");
      }, 1000);
    });

    // GSAP hover animations
    app.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(app, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    app.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(app, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  });
}

// ===== Quick Dock Functionality =====
function initializeQuickDock() {
  quickDockItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Visual feedback
      item.style.transform = "scale(0.95)";
      setTimeout(() => {
        item.style.transform = "scale(1)";
      }, 150);

      const action = item.querySelector(".quick-dock-label").textContent;
      showToast(`${action} opened!`);

      console.log(`Quick action: ${action}`);
    });
  });
}

// ===== Lazy Loading =====
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

// ===== Smooth Scrolling =====
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ===== Accessibility =====
function initializeAccessibility() {
  // Initialize accessibility attributes
  if (btnNav) {
    btnNav.setAttribute("aria-expanded", "false");
  }

  if (searchInput) {
    searchInput.setAttribute("aria-label", "Search apps, people, and content");
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isNavOpen) {
      toggleNav();
    }
  });

  // Focus management
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = Array.from(
        document.querySelectorAll(focusableElements)
      );
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// ===== Utility Functions =====
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--brand-600);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: var(--shadow-3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, duration);
}

function addRippleEffect(button, event) {
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(11, 115, 182, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = event.clientX - rect.left - size / 2 + "px";
  ripple.style.top = event.clientY - rect.top - size / 2 + "px";

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function addRippleCSS() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== Event Listeners =====
// Navigation toggle
if (btnNav) {
  btnNav.addEventListener("click", toggleNav);
}

// Navigation items
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const section = item.getAttribute("data-section");
    if (section) {
      navigateToSection(section);
    }
  });
});

// Close nav when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (isNavOpen && window.innerWidth <= 720) {
    if (!sidenav.contains(e.target) && !btnNav.contains(e.target)) {
      toggleNav();
    }
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 720 && isNavOpen) {
    toggleNav();
  }
});

// ===== Calendar Functionality =====
function initializeCalendar() {
  const calendarNav = document.querySelectorAll(".calendar-nav button");
  const calendarMonth = document.querySelector(".calendar-month");

  if (calendarNav.length > 0) {
    calendarNav.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Add visual feedback
        btn.style.transform = "scale(0.95)";
        setTimeout(() => {
          btn.style.transform = "scale(1)";
        }, 150);

        showToast("Calendar navigation clicked!");
      });
    });
  }
}

// Initialize calendar when DOM is ready
document.addEventListener("DOMContentLoaded", initializeCalendar);

// ===== Hero Section Initialization =====
function initializeHeroSection() {
  // Dynamic greeting based on time
  updateDynamicGreeting();

  // Daily thought rotation
  initializeDailyThought();

  // Initialize action buttons
  initializeActionButtons();

  // Initialize access buttons
  initializeAccessButtons();
}

function updateDynamicGreeting() {
  const greetingElement = document.getElementById("dynamic-greeting");
  if (!greetingElement) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = "Good Morning, RUBESH!";
  } else if (hour < 17) {
    greeting = "Good Afternoon, RUBESH!";
  } else {
    greeting = "Good Evening, RUBESH!";
  }

  greetingElement.textContent = greeting;
}

function initializeDailyThought() {
  const thoughts = [
    "Excellence is not a skill, it's an attitude.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
  ];

  const thoughtElement = document.getElementById("daily-thought");
  if (!thoughtElement) return;

  // Get a different thought based on the day
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const thoughtIndex = dayOfYear % thoughts.length;

  thoughtElement.textContent = `"${thoughts[thoughtIndex]}"`;
}

function initializeActionButtons() {
  const actionButtons = document.querySelectorAll(".action-btn");

  actionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Add ripple effect
      const ripple = document.createElement("div");
      ripple.classList.add("ripple-effect");
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.6)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.left =
        e.clientX - button.getBoundingClientRect().left + "px";
      ripple.style.top = e.clientY - button.getBoundingClientRect().top + "px";
      ripple.style.width = ripple.style.height = "20px";

      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Handle button actions
      if (this.classList.contains("primary")) {
        // Start Day action
        showToast("Starting your day! 🚀", "success");
      } else if (this.classList.contains("secondary")) {
        // View Schedule action
        showToast("Opening schedule... 📅", "info");
      }
    });
  });
}

function initializeAccessButtons() {
  const accessButtons = document.querySelectorAll(".app");

  accessButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      // Handle different access actions based on data-app attribute
      const appType = this.getAttribute("data-app");
      const text = this.querySelector("span").textContent;

      switch (appType) {
        case "attendance":
          showEnhancedToast("Opening attendance portal... ⏰", "info");
          break;
        case "leave":
          showEnhancedToast("Opening leave management... 📅", "info");
          break;
        case "payroll":
          showEnhancedToast("Opening payroll portal... 💰", "info");
          break;
        case "performance":
          showEnhancedToast("Opening performance dashboard... 📊", "info");
          break;
        case "travel":
          showEnhancedToast("Opening travel portal... ✈️", "info");
          break;
        case "directory":
          showEnhancedToast("Opening employee directory... 👥", "info");
          break;
        default:
          showEnhancedToast(`Opening ${text}...`, "info");
      }
    });
  });
}

// Toast notification function
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#10b981" : "#3b82f6"};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-size: 14px;
    font-weight: 500;
  `;

  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add ripple animation CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== Enhanced Header Interactions =====
function initializeHeaderInteractions() {
  // Logo hover effects
  const logoContainer = document.querySelector(".logo-container");
  if (logoContainer) {
    logoContainer.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(".logo", {
          duration: 0.3,
          scale: 1.05,
          rotation: 2,
          ease: "back.out(1.7)",
        });
      }
    });

    logoContainer.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(".logo", {
          duration: 0.3,
          scale: 1,
          rotation: 0,
          ease: "back.out(1.7)",
        });
      }
    });
  }

  // Search input enhancements
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(".search-icon", {
          duration: 0.3,
          scale: 1.1,
          color: "rgba(255, 255, 255, 0.9)",
        });
        gsap.to(".search-input", {
          duration: 0.3,
          y: -2,
          ease: "back.out(1.7)",
        });
      }
    });

    searchInput.addEventListener("blur", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(".search-icon", {
          duration: 0.3,
          scale: 1,
          color: "rgba(255, 255, 255, 0.7)",
        });
        gsap.to(".search-input", {
          duration: 0.3,
          y: 0,
          ease: "back.out(1.7)",
        });
      }
    });
  }

  // Icon button ripple effects
  const iconButtons = document.querySelectorAll(".icon-btn");
  iconButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = this.querySelector(".ripple");
      if (ripple) {
        ripple.style.width = "0px";
        ripple.style.height = "0px";
        ripple.style.opacity = "1";

        setTimeout(() => {
          ripple.style.width = "100px";
          ripple.style.height = "100px";
          ripple.style.opacity = "0";
        }, 10);
      }
    });
  });

  // User dropdown animation
  const userSection = document.querySelector(".user");
  if (userSection) {
    userSection.addEventListener("click", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(".user-dropdown i", {
          duration: 0.3,
          rotation: 180,
          ease: "back.out(1.7)",
        });
      }
    });
  }

  // Badge pulse animation
  const badges = document.querySelectorAll(".badge.pulse");
  badges.forEach((badge) => {
    if (typeof gsap !== "undefined") {
      gsap.to(badge, {
        duration: 2,
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  });

  // Status indicator pulse
  const statusIndicator = document.querySelector(".status-indicator");
  if (statusIndicator && typeof gsap !== "undefined") {
    gsap.to(statusIndicator, {
      duration: 2,
      scale: 1.2,
      opacity: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }
}
