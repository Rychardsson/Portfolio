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
          .querySelectorAll(".scroll-animate")
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
