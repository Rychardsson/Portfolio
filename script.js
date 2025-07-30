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
});
