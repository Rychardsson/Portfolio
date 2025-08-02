// ===== PORTFOLIO JAVASCRIPT - VERSÃO REFATORADA =====
// Autor: Rychardsson Souza
// Descrição: Script modular e organizado para o portfólio
// Versão: 2.0

"use strict";

/**
 * ===== CONFIGURAÇÕES GLOBAIS =====
 */
const CONFIG = Object.freeze({
  // Thresholds e limites
  scrollThreshold: 50,
  backToTopThreshold: 300,
  animationDelay: 100,
  observerThreshold: 0.3,

  // Configurações de animação
  animation: {
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stagger: 100,
  },

  // Google Analytics
  analytics: {
    trackingId: "G-363387019",
    events: Object.freeze({
      themeChange: "theme_change",
      navigation: "navigation",
      formSubmit: "form_submit",
      backToTop: "back_to_top",
      projectClick: "project_click",
      socialClick: "social_click",
      scrollDepth: "scroll_depth",
      pageLoad: "page_load",
    }),
  },

  // Seletores CSS
  selectors: Object.freeze({
    header: "#main-header",
    mobileMenuButton: "#mobile-menu-button",
    mobileMenu: "#mobile-menu",
    themeToggle: "#theme-toggle",
    mobileThemeToggle: "#mobile-theme-toggle",
    contactForm: "#contact-form",
    scrollAnimateElements: ".scroll-animate, .fade-in, .timeline-item",
    navLinks: "nav .nav-link",
    mobileMenuLinks: ".mobile-menu-link",
    sections: "main[id], section[id]",
    anchors: 'a[href^="#"]',
    projectLinks: 'a[href*="github"], a[href*="demo"], a[aria-label*="GitHub"]',
    socialLinks: 'a[href*="linkedin"], a[href*="github.com"]',
  }),
});

/**
 * ===== UTILITÁRIOS =====
 */
const Utils = {
  // Debounce para otimizar performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle para eventos de scroll
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Verificar se elemento está visível
  isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  },

  // Adicionar classe com delay
  addClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
      element.classList.add(className);
    }, delay);
  },

  // Logger personalizado
  log: {
    info: (message, ...args) => console.log(`ℹ️ ${message}`, ...args),
    success: (message, ...args) => console.log(`✅ ${message}`, ...args),
    warning: (message, ...args) => console.warn(`⚠️ ${message}`, ...args),
    error: (message, ...args) => console.error(`❌ ${message}`, ...args),
  },
};

/**
 * ===== GERENCIADOR DOM =====
 */
const DOMManager = {
  elements: {},

  init() {
    this.cacheElements();
    this.validateElements();
  },

  cacheElements() {
    // Cache de elementos únicos
    this.elements = {
      body: document.body,
      header: document.querySelector(CONFIG.selectors.header),
      mobileMenuButton: document.querySelector(
        CONFIG.selectors.mobileMenuButton
      ),
      mobileMenu: document.querySelector(CONFIG.selectors.mobileMenu),
      themeToggle: document.querySelector(CONFIG.selectors.themeToggle),
      mobileThemeToggle: document.querySelector(
        CONFIG.selectors.mobileThemeToggle
      ),
      contactForm: document.querySelector(CONFIG.selectors.contactForm),
    };

    // Cache de coleções
    this.elements.sections = document.querySelectorAll(
      CONFIG.selectors.sections
    );
    this.elements.navLinks = document.querySelectorAll(
      CONFIG.selectors.navLinks
    );
    this.elements.mobileMenuLinks = document.querySelectorAll(
      CONFIG.selectors.mobileMenuLinks
    );
    this.elements.anchors = document.querySelectorAll(CONFIG.selectors.anchors);
  },

  validateElements() {
    const required = ["body", "header"];
    const missing = required.filter((key) => !this.elements[key]);

    if (missing.length > 0) {
      Utils.log.warning(
        `Elementos obrigatórios não encontrados: ${missing.join(", ")}`
      );
    }
  },

  get(elementName) {
    return this.elements[elementName];
  },

  getFormInputs() {
    const form = this.get("contactForm");
    if (!form) return {};

    return {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      message: form.querySelector("#message"),
    };
  },
};

/**
 * ===== MÓDULO DE MENU MOBILE =====
 */
const MobileMenuModule = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    const button = DOMManager.get("mobileMenuButton");
    const menu = DOMManager.get("mobileMenu");
    const links = DOMManager.get("mobileMenuLinks");

    if (!button || !menu) {
      Utils.log.warning("Elementos do menu mobile não encontrados");
      return;
    }

    this.bindEvents(button, menu, links);
    this.isInitialized = true;
    Utils.log.success("Menu mobile inicializado");
  },

  bindEvents(button, menu, links) {
    // Toggle do menu
    button.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle(menu);
    });

    // Fechar ao clicar nos links
    links.forEach((link) => {
      link.addEventListener("click", () => {
        this.close(menu);
      });
    });

    // Fechar com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen(menu)) {
        this.close(menu);
      }
    });
  },

  toggle(menu) {
    menu.classList.toggle("hidden");
    Utils.log.info(`Menu mobile ${this.isOpen(menu) ? "aberto" : "fechado"}`);
  },

  close(menu) {
    menu.classList.add("hidden");
  },

  isOpen(menu) {
    return !menu.classList.contains("hidden");
  },
};

/**
 * ===== MÓDULO DE TEMA =====
 */
const ThemeModule = {
  currentTheme: "dark",
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    const savedTheme = localStorage.getItem("theme") || "dark";
    this.applyTheme(savedTheme);
    this.bindEvents();
    this.isInitialized = true;
    Utils.log.success(`Tema inicializado: ${savedTheme}`);
  },

  bindEvents() {
    const desktopToggle = DOMManager.get("themeToggle");
    const mobileToggle = DOMManager.get("mobileThemeToggle");

    [desktopToggle, mobileToggle].forEach((button) => {
      if (button) {
        button.addEventListener("click", () => this.toggle());
      }
    });
  },

  applyTheme(theme) {
    const body = DOMManager.get("body");
    const isLight = theme === "light";

    body.classList.toggle("light-theme", isLight);
    this.updateIcons(isLight);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  },

  updateIcons(isLight) {
    const buttons = [
      DOMManager.get("themeToggle"),
      DOMManager.get("mobileThemeToggle"),
    ].filter(Boolean);

    const iconPaths = {
      sun: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",
      moon: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z",
    };

    buttons.forEach((button) => {
      const svg = button.querySelector("svg");
      if (svg) {
        svg.innerHTML = `<path fill-rule="evenodd" d="${
          iconPaths[isLight ? "sun" : "moon"]
        }" clip-rule="evenodd"/>`;
      }
    });
  },

  toggle() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);

    // Analytics tracking
    AnalyticsModule.track(
      CONFIG.analytics.events.themeChange,
      "user_preference",
      newTheme
    );
  },

  getCurrentTheme() {
    return this.currentTheme;
  },
};

/**
 * ===== MÓDULO DE ANIMAÇÕES =====
 */
const AnimationModule = {
  observer: null,
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    this.setupIntersectionObserver();
    this.animateHeroSection();
    this.isInitialized = true;
    Utils.log.success("Módulo de animações inicializado");
  },

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: CONFIG.observerThreshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        );

        this.animateSection(mostVisible.target);
        NavigationModule.updateActiveNavLink(mostVisible.target);
      }
    }, options);

    DOMManager.get("sections").forEach((section) => {
      this.observer.observe(section);
    });
  },

  animateSection(section) {
    const elements = section.querySelectorAll(
      CONFIG.selectors.scrollAnimateElements
    );

    elements.forEach((element, index) => {
      const delay = index * CONFIG.animation.stagger;
      Utils.addClassWithDelay(element, "visible", delay);
      element.style.transitionDelay = `${delay}ms`;
    });
  },

  animateHeroSection() {
    const heroElements = document.querySelectorAll("#home .scroll-animate");

    heroElements.forEach((element, index) => {
      const delay = CONFIG.animation.stagger + index * CONFIG.animationDelay;
      Utils.addClassWithDelay(element, "visible", delay);
      element.style.transitionDelay = `${delay}ms`;
    });
  },

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
};

/**
 * ===== MÓDULO DE NAVEGAÇÃO =====
 */
const NavigationModule = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    this.setupSmoothScroll();
    this.isInitialized = true;
    Utils.log.success("Módulo de navegação inicializado");
  },

  setupSmoothScroll() {
    DOMManager.get("anchors").forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleAnchorClick(anchor);
      });
    });
  },

  handleAnchorClick(anchor) {
    const targetId = anchor.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      Utils.log.warning(`Seção não encontrada: ${targetId}`);
      return;
    }

    // Limpar estados ativos
    this.clearAllActiveStates();

    // Fechar menu mobile se estiver aberto
    const mobileMenu = DOMManager.get("mobileMenu");
    if (mobileMenu && MobileMenuModule.isOpen(mobileMenu)) {
      MobileMenuModule.close(mobileMenu);
    }

    // Scroll suave
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Ativar link após scroll
    setTimeout(() => {
      anchor.classList.add("nav-link-active");
    }, 100);

    // Analytics
    AnalyticsModule.track(
      CONFIG.analytics.events.navigation,
      "scroll_navigation",
      targetId.replace("#", "")
    );
  },

  updateActiveNavLink(section) {
    this.clearAllActiveStates();

    const activeLink = document.querySelector(
      `nav a.nav-link[href="#${section.id}"], a.mobile-menu-link[href="#${section.id}"]`
    );

    if (activeLink) {
      activeLink.classList.add("nav-link-active");
    }
  },

  clearAllActiveStates() {
    const allLinks = [
      ...DOMManager.get("navLinks"),
      ...DOMManager.get("mobileMenuLinks"),
    ];

    allLinks.forEach((link) => {
      link.classList.remove("nav-link-active");
      link.blur();
    });

    // Selector adicional para garantir limpeza completa
    document.querySelectorAll(".nav-link-active").forEach((link) => {
      link.classList.remove("nav-link-active");
    });
  },
};
/**
 * ===== MÓDULO DE SCROLL =====
 */
const ScrollModule = {
  isInitialized: false,
  progressBar: null,
  backToTopButton: null,

  init() {
    if (this.isInitialized) return;

    this.setupHeaderEffects();
    this.createProgressBar();
    this.createBackToTopButton();
    this.isInitialized = true;
    Utils.log.success("Módulo de scroll inicializado");
  },

  setupHeaderEffects() {
    const header = DOMManager.get("header");
    if (!header) return;

    const throttledScrollHandler = Utils.throttle((scrollY) => {
      const isScrolled = scrollY > CONFIG.scrollThreshold;

      header.classList.toggle("scrolled", isScrolled);
      header.classList.toggle("bg-black", isScrolled);
      header.classList.toggle("bg-opacity-80", isScrolled);
      header.classList.toggle("backdrop-blur-sm", isScrolled);

      // Efeito de opacidade
      const opacity = Math.min(scrollY / 100, 1);
      header.style.setProperty("--scroll-opacity", opacity);
    }, 16); // ~60fps

    window.addEventListener("scroll", () => {
      throttledScrollHandler(window.scrollY);
    });
  },

  createProgressBar() {
    this.progressBar = document.createElement("div");
    this.progressBar.id = "scroll-progress";

    Object.assign(this.progressBar.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "0%",
      height: "3px",
      background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
      zIndex: "9999",
      transition: "width 0.1s ease",
      boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)",
    });

    document.body.appendChild(this.progressBar);
    this.setupProgressBarAnimation();
  },

  setupProgressBarAnimation() {
    const throttledProgressHandler = Utils.throttle(() => {
      const winScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      this.progressBar.style.width = `${scrolled}%`;

      // Efeito de pulsação no final
      if (scrolled > 90) {
        this.progressBar.style.animation = "pulse 1s infinite";
      } else {
        this.progressBar.style.animation = "none";
      }
    }, 16);

    window.addEventListener("scroll", throttledProgressHandler);

    // Adicionar keyframes se não existirem
    this.addPulseKeyframes();
  },

  addPulseKeyframes() {
    if (document.querySelector("#pulse-keyframes")) return;

    const style = document.createElement("style");
    style.id = "pulse-keyframes";
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.5); }
        50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
        100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.5); }
      }
    `;
    document.head.appendChild(style);
  },

  createBackToTopButton() {
    this.backToTopButton = document.createElement("button");
    this.backToTopButton.innerHTML = "↑";
    this.backToTopButton.className =
      "fixed bottom-6 right-6 w-12 h-12 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 opacity-0 invisible z-50";
    this.backToTopButton.style.fontSize = "20px";
    this.backToTopButton.setAttribute("aria-label", "Voltar ao topo");

    document.body.appendChild(this.backToTopButton);
    this.setupBackToTopBehavior();
  },

  setupBackToTopBehavior() {
    const throttledVisibilityHandler = Utils.throttle((scrollY) => {
      const isVisible = scrollY > CONFIG.backToTopThreshold;
      this.backToTopButton.classList.toggle("opacity-0", !isVisible);
      this.backToTopButton.classList.toggle("invisible", !isVisible);
    }, 16);

    window.addEventListener("scroll", () => {
      throttledVisibilityHandler(window.scrollY);
    });

    this.backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      AnalyticsModule.track(
        CONFIG.analytics.events.backToTop,
        "navigation",
        "back_to_top_button"
      );
    });
  },
};

/**
 * ===== MÓDULO DE FORMULÁRIO =====
 */
const FormModule = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    const form = DOMManager.get("contactForm");
    if (!form) {
      Utils.log.warning("Formulário de contato não encontrado");
      return;
    }

    this.bindEvents(form);
    this.isInitialized = true;
    Utils.log.success("Módulo de formulário inicializado");
  },

  bindEvents(form) {
    form.addEventListener("submit", (e) => {
      this.handleSubmit(e, form);
    });
  },

  handleSubmit(event, form) {
    const validation = this.validateForm();

    if (!validation.isValid) {
      event.preventDefault();
      this.showErrors(validation.errors);
      return;
    }

    AnalyticsModule.track(
      CONFIG.analytics.events.formSubmit,
      "contact",
      "contact_form_submit"
    );
  },

  validateForm() {
    const inputs = DOMManager.getFormInputs();
    const errors = [];

    // Validação do nome
    if (!inputs.name?.value.trim() || inputs.name.value.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }

    // Validação do email
    if (!this.isValidEmail(inputs.email?.value)) {
      errors.push("Por favor, insira um email válido");
    }

    // Validação da mensagem
    if (
      !inputs.message?.value.trim() ||
      inputs.message.value.trim().length < 10
    ) {
      errors.push("Mensagem deve ter pelo menos 10 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  showErrors(errors) {
    const message = errors.join("\n");
    alert(message);
    Utils.log.warning("Erro de validação:", errors);
  },
};

/**
 * ===== MÓDULO DE ANALYTICS =====
 */
const AnalyticsModule = {
  isAvailable: false,
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    this.isAvailable = typeof gtag !== "undefined";

    if (!this.isAvailable) {
      Utils.log.warning("Google Analytics não está disponível");
      return;
    }

    this.setupTracking();
    this.isInitialized = true;
    Utils.log.success("Google Analytics configurado");
  },

  setupTracking() {
    this.setupProjectTracking();
    this.setupSocialTracking();
    this.setupScrollDepthTracking();
  },

  track(eventName, category, label, value = 1) {
    if (!this.isAvailable) return;

    try {
      gtag("event", eventName, {
        event_category: category,
        event_label: label,
        value: value,
      });

      Utils.log.info(`Analytics: ${eventName} - ${label}`);
    } catch (error) {
      Utils.log.error("Erro no tracking:", error);
    }
  },

  setupProjectTracking() {
    const projectLinks = document.querySelectorAll(
      CONFIG.selectors.projectLinks
    );

    projectLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const linkText =
          link.textContent.trim() ||
          link.getAttribute("aria-label") ||
          "Unknown Project";

        this.track(
          CONFIG.analytics.events.projectClick,
          "portfolio_projects",
          linkText
        );
      });
    });
  },

  setupSocialTracking() {
    const socialLinks = document.querySelectorAll(CONFIG.selectors.socialLinks);

    socialLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const platform = link.href.includes("linkedin") ? "LinkedIn" : "GitHub";

        this.track(
          CONFIG.analytics.events.socialClick,
          "social_media",
          platform
        );
      });
    });
  },

  setupScrollDepthTracking() {
    const scrollDepth = { 25: false, 50: false, 75: false, 100: false };

    const throttledScrollDepthHandler = Utils.throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );

      Object.keys(scrollDepth).forEach((depth) => {
        if (scrollPercent >= depth && !scrollDepth[depth]) {
          scrollDepth[depth] = true;
          this.track(
            CONFIG.analytics.events.scrollDepth,
            "engagement",
            `${depth}_percent`,
            parseInt(depth)
          );
        }
      });
    }, 100);

    window.addEventListener("scroll", throttledScrollDepthHandler);
  },
};

/**
 * ===== CONTROLADOR PRINCIPAL =====
 */
const PortfolioApp = {
  modules: [
    DOMManager,
    ThemeModule,
    MobileMenuModule,
    NavigationModule,
    AnimationModule,
    ScrollModule,
    FormModule,
    AnalyticsModule,
  ],

  async init() {
    console.log("PortfolioApp.init() chamado");
    Utils.log.info("🚀 Inicializando Portfolio...");

    try {
      // Inicializar módulos em sequência
      for (const module of this.modules) {
        if (module.init) {
          await module.init();
        }
      }

      // Tracking de inicialização
      AnalyticsModule.track(
        CONFIG.analytics.events.pageLoad,
        "application",
        "portfolio_loaded"
      );

      Utils.log.success("Portfolio carregado com sucesso!");
    } catch (error) {
      Utils.log.error("Erro ao carregar portfolio:", error);
    }
  },

  // Método para cleanup quando necessário
  cleanup() {
    AnimationModule.cleanup();
    Utils.log.info("Portfolio cleanup executado");
  },
};

/**
 * ===== INICIALIZAÇÃO =====
 */
console.log("Script carregado completamente");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - iniciando app");
  try {
    PortfolioApp.init();
    console.log("Portfolio App inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar Portfolio App:", error);
  }
});

// Cleanup ao sair da página
window.addEventListener("beforeunload", () => {
  PortfolioApp.cleanup();
});
