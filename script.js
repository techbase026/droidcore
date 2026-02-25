﻿(() => {
  'use strict';

  const doc = document;
  const win = window;

  const onReady = (fn) => {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const qs = (sel, root = doc) => root.querySelector(sel);
  const qsa = (sel, root = doc) => Array.from(root.querySelectorAll(sel));

  const showNotification = (message, type = 'info') => {
    let container = qs('.site-toast-container');
    if (!container) {
      container = doc.createElement('div');
      container.className = 'site-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      doc.body.appendChild(container);
    }

    const toast = doc.createElement('div');
    toast.className = `notification ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    win.setTimeout(() => toast.classList.add('out'), 2800);
    win.setTimeout(() => toast.remove(), 3400);
  };

  const initMobileNav = () => {
    const hamburger = qs('.hamburger');
    const nav = qs('.nav');
    if (!hamburger || !nav) return;

    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Apri menu');
    hamburger.setAttribute('aria-expanded', 'false');

    const closeNav = () => {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleNav = () => {
      const isOpen = nav.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    hamburger.addEventListener('click', toggleNav);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNav();
      }
    });

    qsa('.nav a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    doc.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) closeNav();
    });

    win.addEventListener('resize', () => {
      if (win.innerWidth > 768) closeNav();
    });
  };

  const initSmoothAnchors = () => {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = qs(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const initReadingProgress = () => {
    let bar = qs('.reading-progress');
    if (!bar) {
      bar = doc.createElement('div');
      bar.className = 'reading-progress';
      doc.body.prepend(bar);
    }

    let ticking = false;
    const updateProgress = () => {
      const scrollHeight = doc.documentElement.scrollHeight - win.innerHeight;
      const pct = scrollHeight > 0 ? (win.scrollY / scrollHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      ticking = false;
    };

    win.addEventListener('scroll', () => {
      if (!ticking) {
        win.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  };

  const initHeaderState = () => {
    const header = qs('.header');
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle('is-scrolled', win.scrollY > 12);
    };

    win.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  };

  const initScrollReveal = () => {
    const items = qsa('.blog-post, .stat-card, .info-item, .float-card, .newsletter-content, .trending-card, .article-cta');
    if (!items.length) return;

    items.forEach((el) => el.classList.add('reveal-ready'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => observer.observe(el));
  };

  const initCounters = () => {
    const counters = qsa('.stat-card h3');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const original = el.textContent || '';
        const value = parseInt(original.replace(/\D/g, ''), 10);

        if (!Number.isFinite(value) || value <= 0) {
          obs.unobserve(el);
          return;
        }

        let current = 0;
        const step = Math.max(1, Math.floor(value / 40));

        const timer = win.setInterval(() => {
          current += step;
          if (current >= value) {
            el.textContent = original;
            win.clearInterval(timer);
          } else if (original.includes('%')) {
            el.textContent = `${current}%`;
          } else {
            el.textContent = `+${current}`;
          }
        }, 22);

        obs.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach((counter) => observer.observe(counter));
  };

  const initContactForm = () => {
    const form = qs('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (qs('#name')?.value || '').trim();
      const email = (qs('#email')?.value || '').trim();
      const message = (qs('#message')?.value || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) return showNotification('Inserisci il tuo nome.', 'error');
      if (!emailRegex.test(email)) return showNotification('Inserisci una email valida.', 'error');
      if (message.length < 10) return showNotification('Il messaggio deve avere almeno 10 caratteri.', 'error');

      showNotification(`Grazie ${name}, messaggio inviato con successo.`, 'success');
      form.reset();
    });
  };

  const initNewsletterForm = () => {
    const form = qs('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (qs('#newsletter-email')?.value || '').trim();
      if (!email) return;

      showNotification('Iscrizione ricevuta. Controlla la tua email.', 'success');
      form.reset();
    });
  };

  const initSearchModal = () => {
    const openBtn = qs('#searchToggle');
    const closeBtn = qs('#searchModalClose');
    const modal = qs('#searchModal');
    const overlay = qs('#searchModalOverlay');
    const input = qs('#searchInputModal');
    const clearBtn = qs('#searchClearModal');
    const tags = qsa('.search-tag-modal');
    const blogGrid = qs('#blogGrid');
    const results = qs('#searchResultsModal');

    if (!modal || !overlay || !input || !results) return;

    const cards = blogGrid ? qsa('.blog-post', blogGrid) : [];
    const model = cards.map((card) => {
      const title = (qs('h3', card)?.textContent || '').toLowerCase();
      const text = (card.textContent || '').toLowerCase();
      const badge = (qs('.post-badge', card)?.textContent || '').toLowerCase();
      return { card, title, text, badge };
    });

    const state = { search: '', tags: [] };

    const setOpen = (open) => {
      modal.classList.toggle('active', open);
      overlay.classList.toggle('active', open);
      doc.body.classList.toggle('modal-open', open);
      modal.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) win.setTimeout(() => input.focus(), 40);
    };

    const applyFilters = () => {
      let visible = 0;

      model.forEach((entry) => {
        const searchOk = !state.search || entry.title.includes(state.search) || entry.text.includes(state.search);
        const tagsOk = !state.tags.length || state.tags.some((tag) => entry.badge.includes(tag));
        const show = searchOk && tagsOk;

        entry.card.classList.toggle('filtered-out', !show);
        if (show) visible += 1;
      });

      const active = Boolean(state.search) || state.tags.length > 0;
      results.classList.toggle('active', active);
      if (!active) {
        results.textContent = '';
        return;
      }

      results.textContent = visible === 0
        ? 'Nessun articolo trovato. Prova a cambiare ricerca.'
        : `${visible} articolo${visible > 1 ? 'i' : ''} trovato${visible > 1 ? 'i' : ''}.`;
    };

    if (openBtn) openBtn.addEventListener('click', () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));

    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) setOpen(false);
    });

    input.addEventListener('input', () => {
      state.search = input.value.trim().toLowerCase();
      clearBtn?.classList.toggle('active', Boolean(state.search));
      applyFilters();
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      state.search = '';
      clearBtn.classList.remove('active');
      applyFilters();
    });

    tags.forEach((tagBtn) => {
      tagBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const value = (tagBtn.dataset.tag || '').toLowerCase();
        const index = state.tags.indexOf(value);

        if (index >= 0) {
          state.tags.splice(index, 1);
          tagBtn.classList.remove('active');
        } else {
          state.tags.push(value);
          tagBtn.classList.add('active');
        }

        applyFilters();
      });
    });
  };

  const initArticleEnhancements = () => {
    const article = qs('.article-content');
    const body = qs('.article-body', article || doc);
    if (!article || !body) return;
    doc.body.classList.add('article-premium');

    const headings = qsa('h2', body);
    const meta = qs('.article-meta', article);
    const heroImage = qs('.article-image-img', article);
    if (heroImage) heroImage.classList.add('article-hero-image');

    if (meta) {
      const words = (body.textContent || '').trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 200));
      const estimate = doc.createElement('span');
      estimate.className = 'article-estimate';
      estimate.innerHTML = `<i class="fas fa-book-open"></i> ${minutes} min effettivi`;
      meta.appendChild(estimate);
    }

    const firstParagraph = qs('p', body);
    if (firstParagraph) firstParagraph.classList.add('article-intro');

    qsa('ul, ol', body).forEach((list) => list.classList.add('article-list'));

    if (headings.length < 3) return;

    const toc = doc.createElement('aside');
    toc.className = 'article-toc';
    toc.innerHTML = '<h3>In Questo Articolo</h3>';

    const tocList = doc.createElement('ul');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const slug = (heading.textContent || `sezione-${index + 1}`)
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        heading.id = `section-${index + 1}-${slug}`;
      }

      const li = doc.createElement('li');
      const link = doc.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || `Sezione ${index + 1}`;
      li.appendChild(link);
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);

    const layout = doc.createElement('div');
    layout.className = 'article-main-layout';
    body.parentNode.insertBefore(layout, body);
    layout.appendChild(toc);
    layout.appendChild(body);

    // Scroll spy for TOC active link
    const tocLinks = qsa('a', tocList);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        tocLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    headings.forEach((h) => observer.observe(h));
  };

  // ==========================================
  // ADVANCED AI COMPARATOR (LOCAL FUZZY LOGIC)
  // ==========================================
  
  const initComparatorAI = () => {
    const form = qs('#aiComparatorForm');
    const summary = qs('#aiSummary');
    const ranking = qs('#aiRanking');
    if (!form || !summary || !ranking) return;

    // Database smartphone con caratteristiche dettagliate
    const phones = [
      { 
        name: 'Samsung Galaxy A55', 
        price: 449, 
        camera: 7.8, 
        battery: 8.5, 
        performance: 7.3, 
        display: 8.1, 
        ai: 6.8, 
        link: 'blog.html',
        strengths: ['autonomia', 'display'],
        weaknesses: ['performance', 'fotocamera notturna']
      },
      { 
        name: 'Samsung Galaxy S24 FE', 
        price: 649, 
        camera: 8.6, 
        battery: 8.0, 
        performance: 8.3, 
        display: 8.4, 
        ai: 8.2, 
        link: 'blog.html',
        strengths: ['fotocamera', 'AI features'],
        weaknesses: ['prezzo elevato']
      },
      { 
        name: 'Samsung Galaxy S25 FE', 
        price: 749, 
        camera: 8.9, 
        battery: 8.4, 
        performance: 8.7, 
        display: 8.6, 
        ai: 8.8, 
        link: 'post5-samsung-s25-fe.html',
        strengths: ['equilibrio', 'AI avanzata', 'fotocamera'],
        weaknesses: ['non waterproof']
      },
      { 
        name: 'Samsung Galaxy S26', 
        price: 999, 
        camera: 9.4, 
        battery: 8.8, 
        performance: 9.3, 
        display: 9.0, 
        ai: 9.2, 
        link: 'post1-samsung-s26.html',
        strengths: ['performance', 'AI', 'display'],
        weaknesses: ['prezzo', 'dimensioni']
      },
      { 
        name: 'Samsung Galaxy S26 Ultra', 
        price: 1299, 
        camera: 9.8, 
        battery: 9.2, 
        performance: 9.6, 
        display: 9.6, 
        ai: 9.5, 
        link: 'post1-samsung-s26.html',
        strengths: ['miglior fotocamera', 'top performance', 'S Pen'],
        weaknesses: ['molto costoso', 'pesante']
      }
    ];

    // ==========================================
    // FUZZY LOGIC WEIGHTS SYSTEM
    // ==========================================
    
    const baseWeights = { camera: 1, battery: 1, performance: 1, display: 1, ai: 0.8 };
    
    // Boost basati sulla priorità dell'utente
    const priorityBoost = {
      balanced: {},
      camera: { camera: 1.2, display: 0.3, ai: 0.2 },
      battery: { battery: 1.3, ai: 0.2, display: 0.1 },
      performance: { performance: 1.3, display: 0.3, battery: 0.2 },
      display: { display: 1.4, camera: 0.2, ai: 0.1 }
    };
    
    // Boost basati sull'uso principale
    const usageBoost = {
      daily: { battery: 0.5, ai: 0.4, display: 0.2 },
      gaming: { performance: 1.2, display: 0.5, battery: 0.4, ai: 0.2 },
      creator: { camera: 1.1, display: 0.5, performance: 0.4, ai: 0.3 },
      work: { battery: 0.8, ai: 0.7, performance: 0.4, display: 0.2 }
    };

    // ==========================================
    // SCORING FUNCTIONS
    // ==========================================
    
    const buildWeights = (priority, usage) => {
      const weights = { ...baseWeights };
      Object.entries(priorityBoost[priority] || {}).forEach(([k, v]) => { weights[k] += v; });
      Object.entries(usageBoost[usage] || {}).forEach(([k, v]) => { weights[k] += v; });
      return weights;
    };

    // Funzione di scoring con logica fuzzy
    const scorePhone = (phone, weights, budgetMax) => {
      // Score qualità pesato
      const qualityScore =
        (phone.camera * weights.camera) +
        (phone.battery * weights.battery) +
        (phone.performance * weights.performance) +
        (phone.display * weights.display) +
        (phone.ai * weights.ai);
      
      // Penalità budget (logica fuzzy: più è oltre budget, maggiore è la penalità)
      let budgetPenalty = 0;
      if (phone.price > budgetMax) {
        const excess = phone.price - budgetMax;
        const excessRatio = excess / budgetMax;
        // Penalità non lineare (penalità maggiore per eccessi proporzionalmente maggiori)
        budgetPenalty = (excess / 40) * (1 + excessRatio);
      }
      
      // Bonus per essere sotto budget
      const budgetBonus = phone.price < budgetMax * 0.7 ? 0.5 : 0;
      
      return qualityScore - budgetPenalty + budgetBonus;
    };

    // Genera spiegazione dettagliata
    const generateExplanation = (phone, priority, usage) => {
      const explanations = [];
      
      // Basato sulla priorità
      if (priority === 'camera') {
        explanations.push(`fotocamera principale ${phone.camera.toFixed(1)}/10`);
        if (phone.camera >= 9) explanations.push('qualità fotografica eccezionale');
      } else if (priority === 'battery') {
        explanations.push(`batteria ${phone.battery.toFixed(1)}/10`);
        if (phone.battery >= 9) explanations.push('autonomia eccellente');
      } else if (priority === 'performance') {
        explanations.push(`prestazioni ${phone.performance.toFixed(1)}/10`);
        if (phone.performance >= 9) explanations.push('performance da top di gamma');
      } else if (priority === 'display') {
        explanations.push(`display ${phone.display.toFixed(1)}/10`);
        if (phone.display >= 9) explanations.push('schermo eccellente');
      } else {
        explanations.push(`profilo bilanciato con AI ${phone.ai.toFixed(1)}/10`);
      }
      
      // Basato sull'uso
      if (usage === 'gaming' && phone.performance >= 8.5) {
        explanations.push('ottimo per gaming');
      } else if (usage === 'creator' && phone.camera >= 8.5) {
        explanations.push('ideale per creazione contenuti');
      } else if (usage === 'work' && phone.ai >= 8) {
        explanations.push('funzioni AI per produttività');
      }
      
      // Punti di forza
      if (phone.strengths && phone.strengths.length > 0) {
        explanations.push(`punti forti: ${phone.strengths.join(', ')}`);
      }
      
      return explanations.join('. ');
    };

    // ==========================================
    // AI SIMULATION (SIMULATED THINKING)
    // ==========================================
    
    const simulateAIThinking = async () => {
      // Mostra indicatore di "Elaborazione AI"
      summary.innerHTML = `
        <div class="ai-thinking">
          <div class="ai-thinking-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="ai-thinking-text">
            <span class="ai-thinking-title">Analisi AI in corso...</span>
            <span class="ai-thinking-subtitle">Elaborazione delle preferenze con logica fuzzy</span>
          </div>
          <div class="ai-thinking-progress">
            <div class="ai-thinking-bar"></div>
          </div>
        </div>
      `;
      
      // Simula tempo di elaborazione (per dare effetto "AI")
      return new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
    };

    // ==========================================
    // FORM SUBMISSION HANDLER
    // ==========================================
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const budget = Number(qs('#budget', form)?.value || 650);
      const priority = qs('#priority', form)?.value || 'balanced';
      const usage = qs('#usage', form)?.value || 'daily';
      const weights = buildWeights(priority, usage);

      // Mostra animazione AI
      await simulateAIThinking();

      // Calcola rankings
      const ranked = phones
        .map((phone) => ({ phone, score: scorePhone(phone, weights, budget) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const winner = ranked[0]?.phone;
      if (!winner) return;

      // Genera il sommario con spiegazione dettagliata
      const explanation = generateExplanation(winner, priority, usage);
      const priceTag = winner.price <= budget ? `${winner.price} EUR ✓` : `${winner.price} EUR (supera budget)`;
      
      summary.innerHTML = `
        <div class="ai-result-summary">
          <div class="ai-badge"><i class="fas fa-robot"></i> Consiglio AI</div>
          <h3 class="ai-winner-name">${winner.name}</h3>
          <p class="ai-winner-price">${priceTag}</p>
          <p class="ai-explanation">${explanation}</p>
          <div class="ai-confidence">
            <span>Certezza:</span>
            <div class="ai-confidence-bar">
              <div class="ai-confidence-fill" style="width: ${Math.min(98, Math.round(ranked[0].score * 8 + 40))}%"></div>
            </div>
            <span>${Math.min(98, Math.round(ranked[0].score * 8 + 40))}%</span>
          </div>
        </div>
      `;

      // Mostra i rankings
      ranking.innerHTML = ranked.map((entry, idx) => {
        const p = entry.phone;
        const isWinner = idx === 0;
        const scorePercent = Math.round(entry.score * 8 + 40);
        
        return `
          <article class="comparator-card ${isWinner ? 'winner' : ''}">
            <p class="comparator-rank">${isWinner ? '<i class="fas fa-trophy"></i> #1' : '#' + (idx + 1)}</p>
            <h3>${p.name}</h3>
            <p class="comparator-price">${p.price} EUR</p>
            <div class="comparator-score">
              <div class="score-bar">
                <div class="score-fill" style="width: ${scorePercent}%"></div>
              </div>
              <span>Score: ${scorePercent}%</span>
            </div>
            <p class="comparator-metrics">
              <span><i class="fas fa-camera"></i> ${p.camera.toFixed(1)}</span>
              <span><i class="fas fa-battery-full"></i> ${p.battery.toFixed(1)}</span>
              <span><i class="fas fa-microchip"></i> ${p.performance.toFixed(1)}</span>
              <span><i class="fas fa-mobile-alt"></i> ${p.display.toFixed(1)}</span>
            </p>
            <a class="read-more" href="${p.link}"><span>Approfondisci</span><i class="fas fa-arrow-right"></i></a>
          </article>
        `;
      }).join('');
    });
  };


  const initStaffPublishedPosts = () => {
    const STAFF_POSTS_KEY = 'staff_blog_posts';
    const blogGrid = qs('#blogGrid');
    if (!blogGrid) return;

    const parsePosts = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(STAFF_POSTS_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const escapeHtml = (value) => String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    const shortText = (value, len = 170) => {
      const clean = String(value || '').replace(/\s+/g, ' ').trim();
      if (clean.length <= len) return clean;
      return `${clean.slice(0, len - 1)}...`;
    };

    const buildStaffArticleHtml = (post) => {
      const dateLabel = new Date(post.date || Date.now()).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
      return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(post.title)} | DroidCore</title>
<meta name="description" content="${escapeHtml(post.metaDesc || post.title)}">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
<section class="article-section">
<div class="container">
<article class="article-content">
<div class="article-header">
<a href="blog.html" class="back-link"><i class="fas fa-arrow-left"></i> Torna al Blog</a>
<div class="article-badge">${escapeHtml(post.category)}</div>
<h1>${escapeHtml(post.title)}</h1>
<div class="article-meta"><span><i class="fas fa-calendar"></i> ${dateLabel}</span><span><i class="fas fa-user"></i> Staff DroidCore</span></div>
</div>
<img loading="lazy" src="${escapeHtml(post.image || 'download.webp')}" alt="${escapeHtml(post.title)}" class="article-image-img">
<div class="article-body"><p>${escapeHtml(post.intro)}</p>${post.content || ''}</div>
</article>
</div>
</section>
<script src="script.js" defer><\/script>
</body>
</html>`;
    };

    const posts = parsePosts().sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
    if (!posts.length) return;

    posts.slice(0, 8).reverse().forEach((post) => {
      const dateLabel = new Date(post.date || Date.now()).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const card = doc.createElement('article');
      card.className = 'blog-post staff-post';
      card.innerHTML = `
        <div class="post-badge">${escapeHtml(post.category || '📰 Articolo')}</div>
        <img loading="lazy" src="${escapeHtml(post.image || 'download.webp')}" alt="${escapeHtml(post.title)}" class="post-image-img">
        <div class="post-content">
          <h3>${escapeHtml(post.title)}</h3>
          <p class="post-date"><i class="fas fa-calendar"></i> ${dateLabel}</p>
          <p>${escapeHtml(shortText(post.intro))}</p>
          <a href="#" class="read-more staff-read-more" data-staff-id="${escapeHtml(post.id)}"><span>Leggi Articolo</span><i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      blogGrid.prepend(card);
    });

    doc.addEventListener('click', (e) => {
      const link = e.target.closest('.staff-read-more');
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute('data-staff-id');
      const post = parsePosts().find((p) => String(p.id) === String(id));
      if (!post) return;

      const html = buildStaffArticleHtml(post);
      const articleWin = win.open('', '_blank');
      if (!articleWin) {
        showNotification('Popup bloccato dal browser. Consenti i popup per leggere l\'articolo.', 'error');
        return;
      }

      articleWin.document.open();
      articleWin.document.write(html);
      articleWin.document.close();
    });
  };

  const initLocalComparatorAssistant = () => {
    const input = qs('#aiAssistantInput');
    const ask = qs('#aiAssistantAsk');
    const answer = qs('#aiAssistantAnswer');
    const budgetEl = qs('#budget');
    const priorityEl = qs('#priority');
    const usageEl = qs('#usage');
    if (!input || !ask || !answer || !budgetEl || !priorityEl || !usageEl) return;

    const clean = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const buildResponse = () => {
      const q = clean(input.value);
      const budget = Number(budgetEl.value || 650);
      const priority = priorityEl.value || 'balanced';
      const usage = usageEl.value || 'daily';

      if (!q.trim()) {
        return 'Scrivi una domanda (es. "miglior camera sotto 800") e ti rispondo usando i dati locali del comparatore.';
      }

      const mapPriority = {
        camera: 'Punta su modelli con sensore migliore e ottimo processing. In questa fascia il consiglio tende a S25 FE o superiori.',
        battery: 'Con priorita batteria conviene cercare equilibrio tra autonomia e ottimizzazione: A55 e S25 FE sono spesso i piu efficienti.',
        performance: 'Per performance e gaming il motore spinge sui modelli S26/S26 Ultra quando il budget lo consente.',
        display: 'Se il focus e display, la serie S26 resta la scelta principale per luminosita e fluidita.',
        balanced: 'Profilo bilanciato: il miglior rapporto generale cambia con budget, di solito S24 FE o S25 FE.'
      };

      let hint = mapPriority[priority] || mapPriority.balanced;

      if (budget <= 300) {
        hint = 'Con questo budget il focus deve essere autonomia e fluidita base: Galaxy A55 risulta la scelta piu pragmatica.';
      } else if (budget <= 700) {
        hint = 'Budget medio: il candidato migliore e spesso S24 FE o S25 FE, a seconda di priorita camera/performance.';
      } else if (budget > 1000) {
        hint = 'Budget alto: S26 e S26 Ultra sono in vantaggio su camera, display e prestazioni pure.';
      }

      if (q.includes('gaming')) {
        return `Per gaming con budget ${budget} EUR: priorita prestazioni + dissipazione. ${budget >= 850 ? 'S26 (o Ultra) e la scelta top.' : 'S25 FE e il compromesso migliore.'}`;
      }
      if (q.includes('foto') || q.includes('camera')) {
        return `Per foto/video con budget ${budget} EUR: attiva priorita "Fotocamera". ${budget >= 850 ? 'S26/S26 Ultra dominano.' : 'S25 FE e il migliore in fascia media.'}`;
      }
      if (q.includes('lavoro') || q.includes('produttiv')) {
        return `Per lavoro quotidiano: uso "Lavoro" + profilo bilanciato/batteria. Con ${budget} EUR il consiglio tipico e ${budget >= 650 ? 'S24 FE o S25 FE' : 'A55'}.`;
      }

      return `${hint} Uso selezionato: ${usage}. Se vuoi una risposta piu precisa, includi nella domanda camera/gaming/batteria e fascia prezzo.`;
    };

    const run = () => {
      answer.textContent = buildResponse();
    };

    ask.addEventListener('click', run);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });
  };
  onReady(() => {
    initMobileNav();
    initSmoothAnchors();
    initReadingProgress();
    initHeaderState();
    initScrollReveal();
    initCounters();
    initContactForm();
    initNewsletterForm();
    initStaffPublishedPosts();
    initSearchModal();
    initArticleEnhancements();
    initComparatorAI();
    initLocalComparatorAssistant();
  });
})();



