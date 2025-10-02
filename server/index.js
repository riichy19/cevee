// ====== UI core: año, tema, reveal, progreso, toTop, navbar blur, ripple, scrollspy ======
document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yEl = document.getElementById('y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // ---- Tema (claro/oscuro) con persistencia ----
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-bs-theme', initial);
  updateThemeIcon(initial);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          html.setAttribute('data-bs-theme', next);
          localStorage.setItem('theme', next);
          updateThemeIcon(next);
        });
      } else {
        html.setAttribute('data-bs-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
      }
    });
  }
  function updateThemeIcon(mode) {
    if (!themeBtn) return;
    themeBtn.innerHTML = mode === 'dark'
      ? '<i class="bi bi-moon-stars"></i><span class="d-none d-sm-inline"> Oscuro</span>'
      : '<i class="bi bi-brightness-high"></i><span class="d-none d-sm-inline"> Claro</span>';
  }

  // ---- Reveal en scroll ----
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // ---- Scrollspy & navegación activa ----
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    let currentId = '';
    const offset = 120;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top - offset <= 0) currentId = sec.id;
    });
    navLinks.forEach(a => {
      const id = a.getAttribute('href').replace('#','');
      a.classList.toggle('active', id === currentId);
    });
  }

  // ---- Progreso lectura + toTop + navbar blur ----
  const progressBar = document.querySelector('#scrollProgress .bar');
  const toTop = document.getElementById('toTop');
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (toTop) (scrolled > 600) ? toTop.classList.add('show') : toTop.classList.remove('show');
    if (navbar) (scrolled > 8) ? navbar.classList.add('is-scrolled') : navbar.classList.remove('is-scrolled');
    updateActiveNav();
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Botones: ripple effect ----
  document.querySelectorAll('.btn-raise').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---- Imagen hero: micro parallax ----
  const avatar = document.querySelector('.avatar.interactive');
  if (avatar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const strength = 8;
    avatar.addEventListener('mousemove', (e) => {
      const r = avatar.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      avatar.style.transform = `translate(${x*strength}px, ${y*strength}px) scale(1.02)`;
    });
    avatar.addEventListener('mouseleave', () => { avatar.style.transform = ''; });
  }

  // ---- Tooltips (opcional) ----
  if (window.bootstrap) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  }

  // ====== Feed Social ======
  const FEED_KEY = 'ra-feed-v1';
  const feedEl = document.getElementById('feedList');
  const publishBtn = document.getElementById('publishBtn');
  const composerText = document.getElementById('composerText');
  const composerImage = document.getElementById('composerImage');
  const addStoryBtn = document.getElementById('addStoryBtn');
  const charCount = document.getElementById('charCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  // Seed inicial (adaptado a tus proyectos reales)
  const seed = [
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 12,
      text: 'Refactor del Sistema Multi-Inventario: endpoints más limpios, nuevos índices en MySQL y dashboard con gráficos mensuales.',
      likes: 14, comments: 3, liked: false,
      tags: ['#Node', '#MySQL', '#CleanCode']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 36,
      text: 'Implementé 2FA en Angular con envío de tokens por SMS/Email + módulo de reset. Backend Node y SQL Server.',
      likes: 23, comments: 5, liked: true,
      tags: ['#Angular', '#2FA', '#Node', '#SQLServer']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 72,
      text: 'Pipeline de automatización: descarga SFTP, unzip, conversión a CSV y carga a DB. Scripts en Node + Linux Ubuntu.',
      likes: 19, comments: 2, liked: false,
      tags: ['#Automatización', '#SFTP', '#CSV', '#Linux']
    },
    {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
      time: Date.now() - 1000 * 60 * 60 * 96,
      text: 'Proyecto tipo Twitter (Udemy): auth, timeline y seguidores con Node + MongoDB. Tests de endpoints con Postman.',
      likes: 31, comments: 6, liked: false,
      tags: ['#MongoDB', '#Node', '#Postman']
    }
  ];

  let posts = loadPosts();

  // Render inicial
  renderFeed(posts);

  // Composer: autosize + contador + publicar
  if (composerText) {
    autoResize(composerText);
    composerText.addEventListener('input', () => {
      const len = composerText.value.length;
      charCount.textContent = `${len}/280`;
      charCount.classList.toggle('text-danger', len > 260);
      publishBtn.disabled = len === 0;
      autoResize(composerText);
    });
    composerText.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter' && !publishBtn.disabled) {
        e.preventDefault();
        publish();
      }
    });
  }
  if (publishBtn) publishBtn.addEventListener('click', publish);

  // Adjuntar imagen (simple)
  document.getElementById('btnAttach')?.addEventListener('click', () => composerImage.click());
  if (composerImage) {
    composerImage.addEventListener('change', () => {
      // Nota: para demo, solo mostramos que hay imagen adjunta.
      if (composerImage.files?.length) {
        toast('Imagen adjunta lista para publicar.');
      }
    });
  }
  // Etiquetas rápidas
  document.getElementById('btnTag')?.addEventListener('click', () => {
    const tag = prompt('Agrega una etiqueta (sin #):');
    if (tag) {
      const cur = composerText.value.trim();
      composerText.value = (cur + ' #' + tag.replace(/\s+/g, '')).trim() + ' ';
      composerText.dispatchEvent(new Event('input'));
    }
  });

  // Stories: por ahora, un placeholder para interacción
  if (addStoryBtn) {
    addStoryBtn.addEventListener('click', () => toast('Historias editables próximamente.'));
  }

  // Delegación de eventos del feed
  feedEl?.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.btn-like');
    const img = e.target.closest('[data-img-src]');
    const cmToggle = e.target.closest('[data-cm-toggle]');
    if (likeBtn) toggleLike(likeBtn);
    if (img) openImage(img.getAttribute('data-img-src') || '');
    if (cmToggle) toggleComments(cmToggle);
  });

  // Cargar más
  loadMoreBtn?.addEventListener('click', () => {
    showSkeletons(2);
    setTimeout(() => {
      const more = [
        {
          id: cryptoRandomId(),
          author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
          time: Date.now() - 1000 * 60 * 15,
          text: 'Pequeña mejora de performance: cache selectiva y compresión de respuestas en Node.',
          likes: 5, comments: 0, liked: false,
          tags: ['#Performance', '#Node']
        },
        {
          id: cryptoRandomId(),
          author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: './img/traje.png' },
          time: Date.now() - 1000 * 60 * 50,
          text: 'Snippet CSS: skeleton loaders accesibles y con prefers-reduced-motion.',
          likes: 8, comments: 1, liked: false,
          tags: ['#CSS', '#A11y']
        }
      ];
      posts = [...more, ...posts];
      savePosts(posts);
      renderFeed(posts);
    }, 650);
  });

  // ====== Helpers del Feed ======
  function publish() {
    const text = composerText.value.trim();
    if (!text) return;
    const newPost = {
      id: cryptoRandomId(),
      author: { name: 'Ricardo Alexis', handle: '@ricardo.dev', avatar: '../client/img/traje.png' },
      time: Date.now(),
      text,
      likes: 0, comments: 0, liked: false,
      tags: extractTags(text)
    };
    const file = composerImage.files?.[0];
    if (file) {
      // Demo: no subimos, mostramos en modal al abrir
      newPost.image = URL.createObjectURL(file);
      composerImage.value = '';
    }
    posts = [newPost, ...posts];
    savePosts(posts);
    renderFeed(posts);
    composerText.value = '';
    composerText.dispatchEvent(new Event('input'));
    toast('Publicado ✨');
  }

  function toggleLike(btn) {
    const id = btn.getAttribute('data-id');
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return;
    const p = posts[idx];
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    savePosts(posts);
    // Actualiza UI del card
    const likeCountEl = btn.querySelector('[data-like-count]');
    likeCountEl.textContent = p.likes;
    btn.classList.toggle('liked', p.liked);
    btn.setAttribute('aria-pressed', String(p.liked));
  }

  function toggleComments(btn) {
    const id = btn.getAttribute('data-id');
    const el = document.getElementById('cm-' + id);
    if (!el) return;
    const isShown = el.classList.contains('show');
    if (window.bootstrap) {
      const c = bootstrap.Collapse.getOrCreateInstance(el);
      isShown ? c.hide() : c.show();
    } else {
      el.classList.toggle('show');
    }
  }

  function openImage(src) {
    const img = document.getElementById('imgModalSrc');
    if (!img) return;
    img.src = src;
    if (window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance('#imgModal').show();
    }
  }

  // ====== Chatbot ======
  const chatToggle = document.getElementById('chatToggle');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const contactEmail = 'ricardo.alexis031299@gmail.com';
  const emailLink = `<a href="mailto:${contactEmail}">${contactEmail}</a>`;
  let chatInitialized = false;
  let chatStage = 'intro';
  let autoOpenTriggered = false;
  let emailShared = false;
  let chatTransitionHandler = null;

  const positiveReactions = [
    '¡Qué bueno que te guste la experiencia!',
    '¡Genial! Saber que te gusta me motiva a seguir mejorando.',
    '¡Excelente! Me alegra que la página te esté gustando.'
  ];

  const postOpinionPrompts = [
    '¿Quieres que te resuma algunos proyectos destacados?',
    'Puedo contarte del stack, los proyectos o la experiencia profesional. ¿Qué prefieres?',
    'Si buscas algo en específico del portafolio, dime y lo revisamos.'
  ];

  const feedbackPrompts = [
    'Gracias por avisar. ¿Qué te gustaría mejorar? Deja tu comentario y lo haré llegar a Ricardo.',
    'Aprecio la sinceridad. Escríbeme qué no te convenció y se lo paso al desarrollador.',
    'Lo entiendo. Cuéntame qué podríamos mejorar y lo compartiré con Ricardo.'
  ];

  const feedbackThanks = [
    '¡Gracias! Tu comentario ya está encaminado al desarrollador.',
    'Recibido. Compartiré tu comentario con Ricardo cuanto antes.',
    'Aprecio el feedback, lo enviaré de inmediato al desarrollador.'
  ];

  const fallbackReplies = [
    'Puedo ayudarte con los proyectos destacados, las habilidades o la experiencia mostrada en la página. ¿Qué te interesa?',
    'Este asistente sólo cubre la página de Ricardo: proyectos, experiencia, habilidades y CV. Dime qué sección quieres explorar.',
    '¿Quieres saber más sobre alguna sección del portafolio (proyectos, habilidades, contacto o CV)? Estoy listo.'
  ];

  const sectionReplies = [
    { pattern: /(proyecto|portfolio|portafolio|plataforma|inventario|2fa|automatizacion)/, reply: 'En la sección de proyectos puedes ver sistemas de inventario, 2FA corporativo y automatizaciones en Node.js. ¿Quieres detalles de alguno?' },
    { pattern: /(habilidad|skills|stack|tecnolog)/, reply: 'El stack principal es JavaScript full stack con Node.js, Angular, SQL Server, MySQL y MongoDB, además de automatización en Linux.' },
    { pattern: /(experiencia|perfil|sobre mi|servicio)/, reply: 'En “Sobre mí” se explica la experiencia como desarrollador Full Stack Jr con enfoque en integraciones seguras y automatización.' },
    { pattern: /(cv|curriculum|resume)/, reply: 'Puedes descargar el CV actualizado desde el botón principal en el hero. ¿Necesitas el enlace directo?' }
  ];

  if (chatWidget) {
    chatWidget.setAttribute('aria-hidden', 'true');
    document.body.classList.add('has-chat');
  }

  function appendMessage(sender, message, allowHTML = false) {
    if (!chatMessages) return null;
    const row = document.createElement('div');
    row.className = `chat-message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (allowHTML) {
      bubble.innerHTML = message;
    } else {
      bubble.textContent = message;
    }
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function primeChat() {
    if (chatInitialized) return;
    chatInitialized = true;
    chatStage = 'await-opinion';
    appendMessage('bot', 'Hola! Soy el asistente virtual. ¿Te gusta la página? Responde "si me gusta" o "no me gusta".');
  }

  function openChat() {
    if (!chatWidget) return;
    if (chatWidget.classList.contains('is-active')) {
      chatInput?.focus();
      return;
    }
    primeChat();
    if (chatTransitionHandler) {
      chatWidget.removeEventListener('transitionend', chatTransitionHandler);
      chatTransitionHandler = null;
    }
    chatWidget.hidden = false;
    chatWidget.setAttribute('aria-hidden', 'false');
    chatToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('chat-open');
    requestAnimationFrame(() => {
      chatWidget.classList.add('is-active');
      chatInput?.focus();
    });
  }

  function closeChat() {
    if (!chatWidget || !chatWidget.classList.contains('is-active')) return;
    chatWidget.classList.remove('is-active');
    chatWidget.setAttribute('aria-hidden', 'true');
    chatToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('chat-open');

    chatTransitionHandler = (event) => {
      if (event.target !== chatWidget || event.propertyName !== 'opacity') return;
      chatWidget.hidden = true;
      chatWidget.removeEventListener('transitionend', chatTransitionHandler);
      chatTransitionHandler = null;
    };
    chatWidget.addEventListener('transitionend', chatTransitionHandler);
  }

  function sanitizeText(text) {
    try {
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch {
      return text;
    }
  }

  function handlePhoneRequest() {
    appendMessage('bot', 'Por ahora no tengo un número telefónico disponible. Si necesitas el correo, pídemelo y con gusto te lo comparto.');
  }

  function shareEmail() {
    if (!emailShared) {
      appendMessage('bot', `Puedes escribirme a ${emailLink}.`, true);
      emailShared = true;
    } else {
      appendMessage('bot', `Ya te había compartido mi correo: ${emailLink}.`, true);
    }
  }

  function respondToSection(sanitized) {
    for (const item of sectionReplies) {
      if (item.pattern.test(sanitized)) {
        appendMessage('bot', item.reply);
        return true;
      }
    }
    return false;
  }

  function processChatInput(rawMessage) {
    const normalized = rawMessage.toLowerCase();
    const sanitized = sanitizeText(normalized);

    if (/(tel|phone|cel|numero)/.test(sanitized)) {
      handlePhoneRequest();
      return;
    }

    if (/(correo|mail|email|contacto)/.test(sanitized)) {
      shareEmail();
      return;
    }

    if (chatStage === 'await-opinion') {
      if (/(si|me gusta)/.test(sanitized) && !/(no)/.test(sanitized)) {
        chatStage = 'open';
        appendMessage('bot', randomItem(positiveReactions));
        appendMessage('bot', randomItem(postOpinionPrompts));
        return;
      }
      if (/(no|meh|mal)/.test(sanitized) && !/(si)/.test(sanitized)) {
        chatStage = 'collect-feedback';
        appendMessage('bot', randomItem(feedbackPrompts));
        return;
      }
      appendMessage('bot', 'Para continuar necesito saber si te gusta la página. Responde con "si me gusta" o "no me gusta".');
      return;
    }

    if (chatStage === 'collect-feedback') {
      chatStage = 'open';
      appendMessage('bot', randomItem(feedbackThanks));
      appendMessage('bot', 'Si quieres seguir explorando, pregúntame sobre proyectos, habilidades o el CV.');
      return;
    }

    if (respondToSection(sanitized)) return;

    appendMessage('bot', randomItem(fallbackReplies));
  }

  chatToggle?.addEventListener('click', () => {
    if (!chatWidget) return;
    chatWidget.hidden ? openChat() : closeChat();
  });

  chatClose?.addEventListener('click', closeChat);

  chatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!chatInput) return;
    const value = chatInput.value.trim();
    if (!value) return;
    appendMessage('user', value);
    chatInput.value = '';
    processChatInput(value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatWidget?.hidden) {
      closeChat();
    }
  });

  const triggerAutoOpen = () => {
    if (autoOpenTriggered) return;
    autoOpenTriggered = true;
    openChat();
  };

  ['pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, triggerAutoOpen, { once: true }));
  document.addEventListener('scroll', triggerAutoOpen, { once: true, passive: true });

  function renderFeed(list) {
    if (!feedEl) return;
    feedEl.innerHTML = list.map(renderPost).join('');
  }

  function renderPost(p) {
    const time = timeAgo(p.time);
    const tags = (p.tags || []).map(t => `<a href="#" class="chip" role="button">${escapeHTML(t)}</a>`).join(' ');
    const image = p.image ? `
      <div class="mt-2">
        <img src="${p.image}" class="img-fluid rounded-3" alt="Imagen adjunta" data-img-src="${p.image}" style="cursor: zoom-in;">
      </div>` : '';
    return `
      <article class="card feed-card" data-id="${p.id}">
        <div class="card-body">
          <div class="author">
            <div>
              <div class="d-flex align-items-center gap-2">
                <span class="fw-semibold">${escapeHTML(p.author.name)}</span>
                <span class="text-body-secondary">${escapeHTML(p.author.handle)}</span>
                <span class="meta">· ${time}</span>
              </div>
            </div>
          </div>
          <div class="content">${linkify(escapeHTML(p.text))}</div>
          ${tags ? `<div class="tags">${tags}</div>` : ''}
          ${image}
          <div class="action-bar">
            <button class="btn-action btn-like ${p.liked ? 'liked' : ''}" data-id="${p.id}" aria-pressed="${p.liked}" aria-label="Me gusta">
              <i class="bi bi-heart"></i> <span data-like-count>${p.likes}</span>
            </button>
            <button class="btn-action" data-cm-toggle data-id="${p.id}" aria-controls="cm-${p.id}" aria-expanded="false">
              <i class="bi bi-chat-dots"></i> <span>${p.comments}</span>
            </button>
            <button class="btn-action" onclick="navigator.clipboard?.writeText(window.location.href + '#${p.id}')">
              <i class="bi bi-link-45deg"></i> <span>Compartir</span>
            </button>
          </div>
          <div class="collapse mt-2" id="cm-${p.id}">
            <div class="border rounded-3 p-3 text-body-secondary small">Comentarios próximamente.</div>
          </div>
        </div>
      </article>
    `;
  }

  function showSkeletons(n=2) {
    if (!feedEl) return;
    const frag = document.createDocumentFragment();
    for (let i=0;i<n;i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton';
      frag.appendChild(sk);
    }
    feedEl.prepend(frag);
    setTimeout(() => {
      document.querySelectorAll('.skeleton').forEach(el => el.remove());
    }, 700);
  }

  function extractTags(text) {
    const tags = (text.match(/#\w+/g) || []).slice(0, 6);
    return Array.from(new Set(tags));
  }

  function timeAgo(ts) {
    const diff = Date.now() - (typeof ts === 'number' ? ts : new Date(ts).getTime());
    const s = Math.floor(diff/1000);
    if (s < 60) return 'ahora';
    const m = Math.floor(s/60);
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m/60);
    if (h < 24) return `hace ${h}h`;
    const d = Math.floor(h/24);
    return `hace ${d}d`;
  }

  function linkify(text) {
    return text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="link-muted">$1</a>')
      .replace(/#(\w+)/g, '<a href="#" class="link-muted">#$1</a>');
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function savePosts(arr) { localStorage.setItem(FEED_KEY, JSON.stringify(arr)); }
  function loadPosts() {
    try {
      const raw = localStorage.getItem(FEED_KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(FEED_KEY, JSON.stringify(seed));
      return seed;
    } catch { return seed; }
  }

  function cryptoRandomId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function autoResize(ta) {
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 560) + 'px'; };
    ta.addEventListener('input', fit); fit();
  }

  function toast(msg) {
    // Simple mini-toast accesible
    const el = document.createElement('div');
    el.role = 'status';
    el.ariaLive = 'polite';
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);padding:.5rem .75rem;background:var(--bs-body-bg);border:1px solid var(--bs-border-color);border-radius:.5rem;box-shadow:var(--shadow-2);z-index:2000;';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
});
