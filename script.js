// Espera que todo o conteúdo do HTML seja carregado antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // Lógica para o menu de navegação em ecrãs pequenos (móvel)
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  // Alterna a visibilidade do menu móvel ao clicar no botão
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Esconde o menu móvel depois de clicar num link
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  // Tema Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
  const body = document.body;

  // Verificar tema salvo ou usar padrão (dark)
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light-theme");
      updateThemeIcons(true);
    } else {
      body.classList.remove("light-theme");
      updateThemeIcons(false);
    }
    localStorage.setItem("theme", theme);
  }

  function updateThemeIcons(isLight) {
    const icons = [themeToggle, mobileThemeToggle];
    icons.forEach((button) => {
      if (button) {
        const svg = button.querySelector("svg");
        if (isLight) {
          // Ícone do sol
          svg.innerHTML =
            '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>';
        } else {
          // Ícone da lua
          svg.innerHTML =
            '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
        }
      }
    });
  }

  function toggleTheme() {
    const currentTheme = body.classList.contains("light-theme")
      ? "light"
      : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  }

  // Event listeners para os botões de tema
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", toggleTheme);
  }

  // Lógica para animações de scroll e para destacar o link de navegação ativo
  const sections = document.querySelectorAll("main[id], section[id]");
  const navLinks = document.querySelectorAll("nav .nav-link");

  // Opções para o Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4, // A secção torna-se "ativa" quando 40% está visível
  };

  // Cria um observador para detetar quando as secções entram no ecrã
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Se a secção está visível
      if (entry.isIntersecting) {
        // Anima os elementos dentro da secção
        entry.target
          .querySelectorAll(".scroll-animate, .fade-in, .timeline-item")
          .forEach((el, index) => {
            el.style.transitionDelay = `${index * 100}ms`; // Adiciona um atraso para um efeito escalonado
            el.classList.add("visible");
          });

        // Destaca o link de navegação correspondente
        const link = document.querySelector(
          `nav a.nav-link[href="#${entry.target.id}"]`
        );
        if (link) {
          navLinks.forEach((l) => l.classList.remove("nav-link-active"));
          link.classList.add("nav-link-active");
        }
      }
    });
  }, observerOptions);

  // Aplica o observador a cada secção
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Animação inicial para os elementos da primeira secção (hero)
  document.querySelectorAll("#home .scroll-animate").forEach((el, index) => {
    setTimeout(() => {
      el.style.transitionDelay = `${index * 100}ms`;
      el.classList.add("visible");
    }, 100);
  });

  // Lógica para tornar o cabeçalho transparente ao rolar a página
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    // Adiciona um fundo escuro ao cabeçalho depois de rolar 50 pixels
    if (window.scrollY > 50) {
      header.classList.add("bg-black", "bg-opacity-80", "backdrop-blur-sm");
    } else {
      header.classList.remove("bg-black", "bg-opacity-80", "backdrop-blur-sm");
    }
  });

  // ===== FUNCIONALIDADES ESSENCIAIS =====

  // 1. Smooth Scroll para navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Fecha o menu mobile se estiver aberto
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }

        // Smooth scroll
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 2. Validação básica do formulário
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      let isValid = true;

      // Validação simples
      if (!name.value.trim() || name.value.trim().length < 2) {
        alert("Nome deve ter pelo menos 2 caracteres");
        isValid = false;
      }

      if (!email.value.includes("@") || !email.value.includes(".")) {
        alert("Por favor, insira um email válido");
        isValid = false;
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        alert("Mensagem deve ter pelo menos 10 caracteres");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  // 3. Botão voltar ao topo
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = "↑";
  backToTopBtn.className =
    "fixed bottom-6 right-6 w-12 h-12 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 opacity-0 invisible z-50";
  backToTopBtn.style.fontSize = "20px";
  backToTopBtn.setAttribute("aria-label", "Voltar ao topo");
  document.body.appendChild(backToTopBtn);

  // Mostrar/esconder botão baseado no scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("opacity-0", "invisible");
    } else {
      backToTopBtn.classList.add("opacity-0", "invisible");
    }
  });

  // Scroll to top
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  console.log("✅ Portfolio carregado com funcionalidades essenciais!");
});
