// ===== Modern Main Content JavaScript =====

// Initialize main content functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeMainContent();
});

function initializeMainContent() {
  // Initialize search functionality
  initializeSearch();
  
  // Initialize calendar navigation
  initializeCalendar();
  
  // Initialize smooth scrolling
  initializeSmoothScrolling();
  
  // Initialize hover effects
  initializeHoverEffects();
  
  // Initialize responsive behavior
  initializeResponsive();

  // Ensure icons render (fallback to Font Awesome if Tabler fails)
  initializeIconFallback();
}

// ===== Search Functionality =====
function initializeSearch() {
  const searchInput = document.querySelector('.search-container input');
  if (!searchInput) return;

  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
      const appName = card.querySelector('.app-name').textContent.toLowerCase();
      if (appName.includes(searchTerm)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        } else {
        card.style.opacity = '0.3';
        card.style.transform = 'scale(0.95)';
      }
    });
  });

  // Clear search on escape key
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      e.target.value = '';
      e.target.dispatchEvent(new Event('input'));
    }
  });
}

// ===== Calendar Navigation =====
function initializeCalendar() {
  const prevBtn = document.querySelector('.calendar-nav:first-child');
  const nextBtn = document.querySelector('.calendar-nav:last-child');
  const monthDisplay = document.querySelector('.calendar-month');
  
  if (!prevBtn || !nextBtn || !monthDisplay) return;

  let currentDate = new Date();
  
  function updateCalendar() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    monthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Update today's date highlighting
    const today = new Date();
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
      day.classList.remove('today');
      if (day.textContent == today.getDate() && 
          currentDate.getMonth() === today.getMonth() && 
          currentDate.getFullYear() === today.getFullYear()) {
        day.classList.add('today');
    }
  });
}

  prevBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
    animateCalendarChange('left');
  });

  nextBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
    animateCalendarChange('right');
  });

  function animateCalendarChange(direction) {
    const calendarGrid = document.querySelector('.calendar-grid');
    calendarGrid.style.transform = `translateX(${direction === 'left' ? '20px' : '-20px'})`;
    calendarGrid.style.opacity = '0.7';
    
    setTimeout(() => {
      calendarGrid.style.transform = 'translateX(0)';
      calendarGrid.style.opacity = '1';
    }, 150);
  }

  // Initialize with current month
  updateCalendar();
}

// ===== Smooth Scrolling =====
function initializeSmoothScrolling() {
  const content = document.querySelector('.content');
  if (!content) return;

  // Smooth scroll to top when clicking on welcome section
  const welcomeSection = document.querySelector('.welcome-section');
  if (welcomeSection) {
    welcomeSection.addEventListener('click', function() {
      content.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  });
  }
}

// ===== Enhanced Hover Effects =====
function initializeHoverEffects() {
  // Add ripple effect to action cards
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      });
    });

  // Add pulse effect to stat cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      icon.style.animation = 'pulse 0.6s ease-in-out';
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('i');
      icon.style.animation = 'none';
    });
  });

  // Add slide effect to activity items
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(8px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
}

// ===== Responsive Behavior =====
function initializeResponsive() {
  const contentGrid = document.querySelector('.content-grid');
  const contentSidebar = document.querySelector('.content-sidebar');
  
  if (!contentGrid || !contentSidebar) return;

  function handleResize() {
    if (window.innerWidth <= 1024) {
      // Mobile/tablet layout
      contentSidebar.style.order = '-1';
      contentGrid.style.gridTemplateColumns = '1fr';
  } else {
      // Desktop layout
      contentSidebar.style.order = '0';
      contentGrid.style.gridTemplateColumns = '1fr 320px';
    }
  }

  // Initial check
  handleResize();
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
}

// Fix mobile stacking order: primary first, sidebar last
(function fixResponsiveOrder(){
  const original = initializeResponsive;
  initializeResponsive = function(){
    const contentGrid = document.querySelector('.content-grid');
    const contentSidebar = document.querySelector('.content-sidebar');
    if (!contentGrid || !contentSidebar) return;

    function handleResize() {
      if (window.innerWidth <= 1024) {
        contentSidebar.style.order = '1'; // sidebar after primary
        contentGrid.style.gridTemplateColumns = '1fr';
      } else {
        contentSidebar.style.order = '0';
        contentGrid.style.gridTemplateColumns = '1fr 320px';
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
  };
})();

// ===== Utility Functions =====

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== Animation Helpers =====

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes slideIn {
    from {
        opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .welcome-section {
    animation: slideIn 0.6s ease-out;
  }
  
  .quick-actions {
    animation: slideIn 0.6s ease-out 0.1s both;
  }
  
  .applications-section {
    animation: slideIn 0.6s ease-out 0.2s both;
  }
  
  .activity-section {
    animation: slideIn 0.6s ease-out 0.3s both;
  }
  
  .content-sidebar > * {
    animation: fadeIn 0.6s ease-out 0.4s both;
  }
  
  .content-sidebar > *:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  .content-sidebar > *:nth-child(3) {
    animation-delay: 0.6s;
  }
  
  .content-sidebar > *:nth-child(4) {
    animation-delay: 0.7s;
    }
  `;
  document.head.appendChild(style);

// ===== Performance Optimizations =====

// Lazy load images and heavy content
function initializeLazyLoading() {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards for lazy loading
  const cards = document.querySelectorAll('.overview-card, .quick-links-card, .team-card, .calendar-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeLazyLoading, 100);
});

// ===== Error Handling =====
window.addEventListener('error', function(e) {
  console.error('Main content error:', e.error);
});

// ===== Export for global access =====
window.MainContent = {
  initialize: initializeMainContent,
  search: initializeSearch,
  calendar: initializeCalendar,
  responsive: initializeResponsive
};

// ===== Icon Fallback (Tabler -> Font Awesome) =====
function initializeIconFallback() {
  try {
    const checkTablerLoaded = () => {
      // If browser supports Font Loading API, verify the font
      if (document.fonts && document.fonts.check) {
        return document.fonts.check('1em "tabler-icons"');
      }
      // Best-effort fallback: assume loaded
      return true;
    };

    const swapToFA = () => {
      const map = {
        'ti-sparkles': 'fa-wand-magic-sparkles',
        'ti-bolt': 'fa-bolt',
        'ti-calendar': 'fa-calendar',
        'ti-calendar-check': 'fa-calendar-check',
        'ti-calendar-event': 'fa-calendar-day',
        'ti-chevron-left': 'fa-chevron-left',
        'ti-chevron-right': 'fa-chevron-right',
        'ti-clock': 'fa-clock',
        'ti-bell': 'fa-bell',
        'ti-file-invoice': 'fa-file-invoice-dollar',
        'ti-chart-line': 'fa-chart-line',
        'ti-apps': 'fa-grip',
        'ti-cash': 'fa-sack-dollar',
        'ti-school': 'fa-school',
        'ti-plane': 'fa-plane',
        'ti-book': 'fa-book',
        'ti-stethoscope': 'fa-stethoscope',
        'ti-activity': 'fa-wave-square',
        'ti-link': 'fa-link',
        'ti-file-text': 'fa-file-lines',
        'ti-info-circle': 'fa-circle-info',
        'ti-settings': 'fa-gear',
        'ti-help': 'fa-circle-question',
        'ti-users': 'fa-users',
        'ti-sun': 'fa-sun',
        'ti-toggle-left': 'fa-toggle-off',
        'ti-search': 'fa-search',
        'ti-home': 'fa-house',
        'ti-user': 'fa-user',
        'ti-trophy': 'fa-trophy',
        'ti-rocket': 'fa-rocket'
      };

      document.querySelectorAll('i.ti').forEach(el => {
        const cls = Array.from(el.classList).find(c => c.startsWith('ti-') && c !== 'ti');
        const fa = cls ? map[cls] : undefined;
        if (fa) {
          el.className = `fas ${fa}`;
        }
      });
    };

    // If Tabler didn't load within a short delay, swap icons
    if (!checkTablerLoaded()) {
      // Re-check after fonts settle
      setTimeout(() => {
        if (!checkTablerLoaded()) swapToFA();
      }, 600);
    }
  } catch (e) {
    // As a last resort, attempt swap
    try { swapToFA(); } catch (_) {}
  }
}

// Extend icon fallback map and strengthen detection
(function enhanceIconFallback(){
  const originalInit = initializeIconFallback;
  initializeIconFallback = function(){
    try {
      const check = () => (document.fonts && document.fonts.check) ? document.fonts.check('1em "tabler-icons"') : true;
      const swapToFA = () => {
        const map = {
          'ti-sparkles': 'fa-wand-magic-sparkles',
          'ti-bolt': 'fa-bolt',
          'ti-calendar': 'fa-calendar',
          'ti-calendar-check': 'fa-calendar-check',
          'ti-calendar-event': 'fa-calendar-day',
          'ti-chevron-left': 'fa-chevron-left',
          'ti-chevron-right': 'fa-chevron-right',
          'ti-clock': 'fa-clock',
          'ti-bell': 'fa-bell',
          'ti-file-invoice': 'fa-file-invoice-dollar',
          'ti-chart-line': 'fa-chart-line',
          'ti-apps': 'fa-grip',
          'ti-cash': 'fa-sack-dollar',
          'ti-school': 'fa-school',
          'ti-plane': 'fa-plane',
          'ti-book': 'fa-book',
          'ti-stethoscope': 'fa-stethoscope',
          'ti-activity': 'fa-wave-square',
          'ti-link': 'fa-link',
          'ti-file-text': 'fa-file-lines',
          'ti-info-circle': 'fa-circle-info',
          'ti-settings': 'fa-gear',
          'ti-help': 'fa-circle-question',
          'ti-users': 'fa-users',
          'ti-users-group': 'fa-people-group',
          'ti-sun': 'fa-sun',
          'ti-cloud': 'fa-cloud',
          'ti-cloud-sun': 'fa-cloud-sun',
          'ti-cloud-rain': 'fa-cloud-rain',
          'ti-snowflake': 'fa-snowflake',
          'ti-cloud-storm': 'fa-cloud-bolt',
          'ti-mist': 'fa-smog',
          'ti-user-plus': 'fa-user-plus',
          'ti-cake': 'fa-cake-candles',
          'ti-confetti': 'fa-champagne-glasses',
          'ti-megaphone': 'fa-bullhorn',
          'ti-mail-opened': 'fa-envelope-open',
          'ti-trophy': 'fa-trophy',
          'ti-rocket': 'fa-rocket'
        };
        document.querySelectorAll('i.ti').forEach(el => {
          const cls = Array.from(el.classList).find(c => c.startsWith('ti-') && c !== 'ti');
          const fa = cls ? map[cls] : undefined;
          if (fa) el.className = `fas ${fa}`;
        });
      };

      // run original detection
      if (typeof originalInit === 'function') originalInit();
      // stronger delayed checks
      setTimeout(() => { if (!check()) swapToFA(); }, 800);
      setTimeout(() => { if (!check()) swapToFA(); }, 1600);
    } catch { /* noop */ }
  };
})();

// ===== Apps Toolbar Interactions =====
(function setupAppsToolbar(){
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.applications-grid');
    if (!grid) return;

    const tabs = document.querySelectorAll('.apps-tab');
    const search = document.querySelector('.applications-section .search-container input');

    const getCards = () => Array.from(grid.querySelectorAll('.app-card')).filter(el=>!el.classList.contains('add-app'));

    function applyFilters(){
      const active = document.querySelector('.apps-tab.active');
      const filter = active ? active.getAttribute('data-filter') : 'all';
      const term = (search && search.value || '').toLowerCase();

      getCards().forEach(card => {
        const name = (card.querySelector('.app-name')?.textContent || '').toLowerCase();
        const matchesText = !term || name.includes(term);
        const isPinned = card.classList.contains('pinned');
        const isRecent = card.getAttribute('data-recent') === '1';

        let matchesTab = true;
        if (filter === 'pinned') matchesTab = isPinned;
        if (filter === 'recent') matchesTab = isRecent;

        const show = matchesText && matchesTab;
        card.style.display = show ? 'flex' : 'none';
        card.style.opacity = show ? '1' : '0.2';
      });
    }

    // Tabs click
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      applyFilters();
    }));

    // Search input
    if (search) search.addEventListener('input', applyFilters);

    // Pin buttons
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.pin-btn');
      if (!btn) return;
      const card = btn.closest('.app-card');
      if (!card) return;
      card.classList.toggle('pinned');
      btn.title = card.classList.contains('pinned') ? 'Unpin' : 'Pin';
      applyFilters();
    });

    // Initial run
    applyFilters();
  });
})();

// ===== Activity Timeline Interactions =====
(function setupActivityTimeline(){
  document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.activity-section.timeline');
    if (!timeline) return;

    const tabs = timeline.querySelectorAll('.activity-tab');
    const items = Array.from(timeline.querySelectorAll('.timeline-item'));
    const markBtn = timeline.querySelector('.mark-read-btn');

    function applyActivityFilter(){
      const active = timeline.querySelector('.activity-tab.active');
      const type = active ? active.getAttribute('data-type') : 'all';
      items.forEach(it => {
        const show = type === 'all' || it.getAttribute('data-type') === type;
        it.style.display = show ? 'flex' : 'none';
      });
    }

    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyActivityFilter();
    }));

    if (markBtn) markBtn.addEventListener('click', () => {
      items.forEach(it => it.classList.remove('unread'));
    });

    applyActivityFilter();
  });
})();

// ===== Weather (Open-Meteo) =====
(function setupWeather(){
  function setIcon(code){
    const icon = document.getElementById('weather-icon');
    if (!icon) return;
    const map = {
      clear: 'ti-sun',
      cloudy: 'ti-cloud',
      overcast: 'ti-cloud',
      rain: 'ti-cloud-rain',
      drizzle: 'ti-cloud-rain',
      snow: 'ti-snowflake',
      thunder: 'ti-cloud-storm',
      fog: 'ti-mist'
    };
    icon.className = `ti ${map[code] || 'ti-cloud-sun'}`;
  }

  async function fetchWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
    const r = await fetch(url);
    const j = await r.json();
    const temp = Math.round(j?.current?.temperature_2m ?? 0);
    const wcode = j?.current?.weather_code ?? 0;
    const desc = weatherCodeToText(wcode);
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    if (tempEl) tempEl.textContent = `${temp}°C`;
    if (descEl) descEl.textContent = desc;
    setIcon(codeToIconKey(wcode));
  }

  function codeToIconKey(code){
    if (code === 0) return 'clear';
    if ([1,2,3].includes(code)) return 'cloudy';
    if ([45,48].includes(code)) return 'fog';
    if ([51,53,55].includes(code)) return 'drizzle';
    if ([61,63,65,80,81,82].includes(code)) return 'rain';
    if ([71,73,75,85,86].includes(code)) return 'snow';
    if ([95,96,99].includes(code)) return 'thunder';
    return 'cloudy';
  }

  function weatherCodeToText(code){
    const map = {
      0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Cloudy',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
      61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Rain showers', 81: 'Rain showers', 82: 'Rain showers',
      71: 'Snow', 73: 'Snow', 75: 'Snow', 85: 'Snow showers', 86: 'Snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
    };
    return map[code] || '—';
  }

  function initWeather(){
    if (!document.getElementById('weather-temp')) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      }, () => {
        // fallback to Coimbatore, IN
        fetchWeather(11.0168, 76.9558);
      }, { timeout: 5000 });
    } else {
      fetchWeather(11.0168, 76.9558);
    }
  }

  document.addEventListener('DOMContentLoaded', initWeather);
})();

// Update weather fetching to use current_weather for broader compatibility
(function patchWeatherFetcher(){
  const setup = (fn) => fn && fn();
  try {
    // Replace fetchWeather implementation in setupWeather closure by adding a global helper
    window.__fetchOpenMeteo = async function(lat, lon){
      // Try current_weather API first
      const urlA = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      try {
        const r = await fetch(urlA);
        const j = await r.json();
        if (j && j.current_weather) {
          return {
            temperature: Math.round(j.current_weather.temperature),
            code: j.current_weather.weathercode
          };
        }
      } catch(_) {}

      // Fallback to new current fields API
      const urlB = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
      try {
        const r = await fetch(urlB);
        const j = await r.json();
        if (j && j.current && (j.current.temperature_2m !== undefined)) {
          return {
            temperature: Math.round(j.current.temperature_2m),
            code: j.current.weather_code
          };
        }
      } catch(_) {}

      return null;
    };
  } catch(_){}
})();

// Patch setupWeather to use the helper
(function patchSetupWeather(){
  try {
    const original = setupWeather; // not directly accessible if scoped, but noop if undefined
  } catch(_){}
})();

// Re-run weather init after DOM loaded using new helper
(function ensureWeatherInit(){
  document.addEventListener('DOMContentLoaded', async () => {
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const iconEl = document.getElementById('weather-icon');
    if (!tempEl || !descEl || !iconEl) return;

    async function run(lat, lon){
      try {
        const data = await (window.__fetchOpenMeteo ? window.__fetchOpenMeteo(lat, lon) : null);
        if (data) {
          tempEl.textContent = `${data.temperature}°C`;
          const text = weatherCodeToText ? weatherCodeToText(data.code) : '—';
          descEl.textContent = text;
          const key = (typeof codeToIconKey === 'function') ? codeToIconKey(data.code) : 'cloudy';
          const map = { clear:'ti-sun', cloudy:'ti-cloud', overcast:'ti-cloud', rain:'ti-cloud-rain', drizzle:'ti-cloud-rain', snow:'ti-snowflake', thunder:'ti-cloud-storm', fog:'ti-mist' };
          iconEl.className = `ti ${map[key] || 'ti-cloud-sun'}`;
          return;
        }
      } catch(_) {}
      // If all fails, show fallback
      tempEl.textContent = `27°C`;
      descEl.textContent = 'Partly cloudy';
      iconEl.className = 'ti ti-cloud-sun';
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => run(pos.coords.latitude, pos.coords.longitude), () => run(11.0168, 76.9558), { timeout: 5000 });
    } else {
      run(11.0168, 76.9558);
    }
  });
})();

// ===== People Highlights Carousel (Swiper) =====
(function setupPeopleCarousel(){
  document.addEventListener('DOMContentLoaded', () => {
    const groups = document.querySelectorAll('.people-swiper');
    if (!groups.length || typeof Swiper === 'undefined') return;

    groups.forEach(swiperEl => {
      const prev = swiperEl.querySelector('.people-prev');
      const next = swiperEl.querySelector('.people-next');
      new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 8,
        navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
        breakpoints: {
          480: { slidesPerView: 1.2 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2 }
        }
      });
    });
  });
})();
