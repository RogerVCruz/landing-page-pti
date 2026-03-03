(function () {
  'use strict';

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function toggleMenu(force) {
    const isOpen = typeof force === 'boolean' ? force : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', function () {
    toggleMenu();
  });

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      toggleMenu(false);
    }
  });

  const header = document.getElementById('header');

  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  const form    = document.getElementById('contatoForm');
  const success = document.getElementById('formSuccess');

  function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.closest('.form-group').querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.closest('.form-group').querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\+\d\s\(\)\-]{8,20}$/.test(phone.trim());
  }

  function validateField(input) {
    const name  = input.name;
    const value = input.value.trim();

    if (input.required && value === '') {
      showError(input, 'Este campo é obrigatório.');
      return false;
    }

    if (name === 'email' && value !== '' && !isValidEmail(value)) {
      showError(input, 'Informe um e-mail válido.');
      return false;
    }

    if (name === 'telefone' && value !== '' && !isValidPhone(value)) {
      showError(input, 'Informe um telefone válido.');
      return false;
    }

    clearError(input);
    return true;
  }

  if (form) {
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      form.querySelectorAll('input[required], textarea[required]').forEach(function (input) {
        if (!validateField(input)) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      setTimeout(function () {
        form.reset();
        form.querySelectorAll('input, textarea').forEach(clearError);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(function () { success.hidden = true; }, 6000);
      }, 1000);
    });
  }

  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  const anoEl = document.getElementById('anoAtual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

})();
