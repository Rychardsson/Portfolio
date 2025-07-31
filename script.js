// ===== PORTFOLIO JAVASCRIPT - REFATORADO =====
// Autor: Rychardsson Souza
// Descrição: Script principal do portfólio com funcionalidades modernas

document.addEventListener("DOMContentLoaded", () => {
  // ===== CONFIGURAÇÕES GLOBAIS =====
  const CONFIG = {
    scrollThreshold: 50,
    backToTopThreshold: 300,
    animationDelay: 100,
    observerThreshold: 0.4,
  };

  // ===== SELETORES DOM =====
  const DOM = {
    // Menu
    mobileMenuButton: document.getElementById("mobile-menu-button"),
    mobileMenu: document.getElementById("mobile-menu"),
    mobileMenuLinks: document.querySelectorAll(".mobile-menu-link"),

    // Tema
    themeToggle: document.getElementById("theme-toggle"),
    mobileThemeToggle: document.getElementById("mobile-theme-toggle"),
    body: document.body,

    // Navegação
    header: document.getElementById("main-header"),
    sections: document.querySelectorAll("main[id], section[id]"),
    navLinks: document.querySelectorAll("nav .nav-link"),

    // Formulário
    contactForm: document.getElementById("contact-form"),
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    messageInput: document.getElementById("message"),
  };

  // ===== MÓDULO DE MENU MOBILE =====
  const MobileMenu = {
    init() {
      this.bindEvents();
    },

    bindEvents() {
      DOM.mobileMenuButton?.addEventListener("click", this.toggle);
      DOM.mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", this.close);
      });
    },

    toggle() {
      DOM.mobileMenu?.classList.toggle("hidden");
    },

    close() {
      DOM.mobileMenu?.classList.add("hidden");
    },

    isOpen() {
      return DOM.mobileMenu && !DOM.mobileMenu.classList.contains("hidden");
    },
  };

  // ===== MÓDULO DE TEMA =====
  const ThemeManager = {
    init() {
      const savedTheme = localStorage.getItem("theme") || "dark";
      this.applyTheme(savedTheme);
      this.bindEvents();
    },

    bindEvents() {
      DOM.themeToggle?.addEventListener("click", this.toggle.bind(this));
      DOM.mobileThemeToggle?.addEventListener("click", this.toggle.bind(this));
    },

    applyTheme(theme) {
      if (theme === "light") {
        DOM.body.classList.add("light-theme");
        this.updateIcons(true);
      } else {
        DOM.body.classList.remove("light-theme");
        this.updateIcons(false);
      }
      localStorage.setItem("theme", theme);
    },

    updateIcons(isLight) {
      const buttons = [DOM.themeToggle, DOM.mobileThemeToggle];
      const sunIcon =
        '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>';
      const moonIcon =
        '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';

      buttons.forEach((button) => {
        if (button) {
          const svg = button.querySelector("svg");
          if (svg) {
            svg.innerHTML = isLight ? sunIcon : moonIcon;
          }
        }
      });
    },

    toggle() {
      const currentTheme = DOM.body.classList.contains("light-theme")
        ? "light"
        : "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";

      this.applyTheme(newTheme);
      Analytics.trackThemeChange(newTheme);
    },

    getCurrentTheme() {
      return DOM.body.classList.contains("light-theme") ? "light" : "dark";
    },
  };

  // ===== MÓDULO DE ANIMAÇÕES =====
  const AnimationManager = {
    init() {
      this.setupObserver();
      this.animateHeroSection();
    },

    setupObserver() {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: CONFIG.observerThreshold,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateSection(entry.target);
            this.updateActiveNavLink(entry.target);
          }
        });
      }, observerOptions);

      DOM.sections.forEach((section) => observer.observe(section));
    },

    animateSection(section) {
      const elements = section.querySelectorAll(
        ".scroll-animate, .fade-in, .timeline-item"
      );
      elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * CONFIG.animationDelay}ms`;
        el.classList.add("visible");
      });
    },

    updateActiveNavLink(section) {
      const activeLink = document.querySelector(
        `nav a.nav-link[href="#${section.id}"]`
      );
      if (activeLink) {
        DOM.navLinks.forEach((link) =>
          link.classList.remove("nav-link-active")
        );
        activeLink.classList.add("nav-link-active");
      }
    },

    animateHeroSection() {
      const heroElements = document.querySelectorAll("#home .scroll-animate");
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.transitionDelay = `${index * CONFIG.animationDelay}ms`;
          el.classList.add("visible");
        }, CONFIG.animationDelay);
      });
    },
  };

  // ===== MÓDULO DE SCROLL =====
  const ScrollManager = {
    init() {
      this.setupSmoothScroll();
      this.setupHeaderTransparency();
      this.createBackToTopButton();
    },

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();

          const targetId = anchor.getAttribute("href");
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            if (MobileMenu.isOpen()) {
              MobileMenu.close();
            }

            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            Analytics.trackNavigation(targetId.replace("#", ""));
          }
        });
      });
    },

    setupHeaderTransparency() {
      window.addEventListener("scroll", () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
          DOM.header?.classList.add(
            "bg-black",
            "bg-opacity-80",
            "backdrop-blur-sm"
          );
        } else {
          DOM.header?.classList.remove(
            "bg-black",
            "bg-opacity-80",
            "backdrop-blur-sm"
          );
        }
      });
    },

    createBackToTopButton() {
      const button = document.createElement("button");
      button.innerHTML = "↑";
      button.className =
        "fixed bottom-6 right-6 w-12 h-12 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 opacity-0 invisible z-50";
      button.style.fontSize = "20px";
      button.setAttribute("aria-label", "Voltar ao topo");

      document.body.appendChild(button);

      // Show/hide based on scroll
      window.addEventListener("scroll", () => {
        if (window.scrollY > CONFIG.backToTopThreshold) {
          button.classList.remove("opacity-0", "invisible");
        } else {
          button.classList.add("opacity-0", "invisible");
        }
      });

      // Scroll to top
      button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        Analytics.trackBackToTop();
      });

      return button;
    },
  };

  // ===== MÓDULO DE VALIDAÇÃO DE FORMULÁRIO =====
  const FormValidator = {
    init() {
      if (!DOM.contactForm) return;
      this.bindEvents();
    },

    bindEvents() {
      DOM.contactForm.addEventListener("submit", this.handleSubmit.bind(this));
    },

    handleSubmit(e) {
      const validation = this.validateForm();

      if (!validation.isValid) {
        e.preventDefault();
        this.showErrors(validation.errors);
      } else {
        Analytics.trackFormSubmit();
      }
    },

    validateForm() {
      const errors = [];

      if (
        !DOM.nameInput?.value.trim() ||
        DOM.nameInput.value.trim().length < 2
      ) {
        errors.push("Nome deve ter pelo menos 2 caracteres");
      }

      if (
        !DOM.emailInput?.value.includes("@") ||
        !DOM.emailInput.value.includes(".")
      ) {
        errors.push("Por favor, insira um email válido");
      }

      if (
        !DOM.messageInput?.value.trim() ||
        DOM.messageInput.value.trim().length < 10
      ) {
        errors.push("Mensagem deve ter pelo menos 10 caracteres");
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },

    showErrors(errors) {
      alert(errors.join("\n"));
    },
  };

  // ===== MÓDULO DE ANALYTICS =====
  const Analytics = {
    isAvailable: typeof gtag !== "undefined",

    init() {
      if (!this.isAvailable) {
        console.log("⚠️ Google Analytics não está disponível");
        return;
      }

      this.setupProjectTracking();
      this.setupSocialTracking();
      this.setupScrollDepthTracking();

      console.log("✅ Google Analytics configurado e pronto!");
    },

    track(eventName, category, label, value = 1) {
      if (!this.isAvailable) return;

      gtag("event", eventName, {
        event_category: category,
        event_label: label,
        value: value,
      });

      console.log(`📊 GA: ${eventName} trackado -`, label);
    },

    setupProjectTracking() {
      const projectLinks = document.querySelectorAll(
        'a[href*="github"], a[href*="demo"], a[aria-label*="GitHub"], a[aria-label*="demonstração"]'
      );

      projectLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const linkText =
            link.textContent.trim() ||
            link.getAttribute("aria-label") ||
            "Unknown";
          this.track("click", "portfolio_projects", linkText);
        });
      });
    },

    setupSocialTracking() {
      const socialLinks = document.querySelectorAll(
        'a[href*="linkedin"], a[href*="github.com"]'
      );

      socialLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const platform = link.href.includes("linkedin")
            ? "LinkedIn"
            : "GitHub";
          this.track("social_click", "social_media", platform);
        });
      });
    },

    setupScrollDepthTracking() {
      const scrollDepth = { 25: false, 50: false, 75: false, 100: false };

      window.addEventListener("scroll", () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
            100
        );

        Object.keys(scrollDepth).forEach((depth) => {
          if (scrollPercent >= depth && !scrollDepth[depth]) {
            scrollDepth[depth] = true;
            this.track(
              "scroll_depth",
              "engagement",
              `${depth}_percent`,
              parseInt(depth)
            );
          }
        });
      });
    },

    trackNavigation(targetId) {
      this.track("navigation", "scroll_navigation", targetId);
    },

    trackFormSubmit() {
      this.track("form_submit", "contact", "contact_form_submit");
    },

    trackBackToTop() {
      this.track("back_to_top", "navigation", "back_to_top_button");
    },

    trackThemeChange(newTheme) {
      this.track("theme_change", "user_preference", newTheme);
    },
  };

  // ===== INICIALIZAÇÃO =====
  const Portfolio = {
    init() {
      console.log("� Inicializando Portfolio...");

      MobileMenu.init();
      ThemeManager.init();
      AnimationManager.init();
      ScrollManager.init();
      FormValidator.init();
      Analytics.init();

      console.log("✅ Portfolio carregado com sucesso!");
    },
  };

  // Inicializar aplicação
  Portfolio.init();
});
