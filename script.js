// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when link is clicked
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Reading Progress Bar
function initReadingProgress() {
    // Create progress bar if it doesn't exist
    if (!document.querySelector('.reading-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.insertBefore(progressBar, document.body.firstChild);
    }

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = (scrollPosition / scrollHeight) * 100;
        
        const progressBar = document.querySelector('.reading-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNav(this.getAttribute('href'));
        }
    });
});

// Update active navigation link
function updateActiveNav(id) {
    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav a[href="${id}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Highlight active nav on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        updateActiveNav(`#${current}`);
    }
});

// Form submission with validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name) {
            showNotification('Per favore inserisci il tuo nome', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Per favore inserisci un\'email valida', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Il messaggio deve contenere almeno 10 caratteri', 'error');
            return;
        }
        
        // Simulate sending message
        showNotification(`Grazie ${name}! Il tuo messaggio è stato ricevuto con successo. Ti contatteremo presto all'indirizzo ${email}.`, 'success');
        contactForm.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    notification.style.cssText = style;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Newsletter form handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email')?.value.trim();
        
        if (email) {
            showNotification('Grazie! Verifica la tua email per confermare l\'iscrizione.', 'success');
            newsletterForm.reset();
        }
    });
}

// Advanced scroll animations
const createScrollObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    return observer;
};

const scrollObserver = createScrollObserver();

// Observe all animated elements
const elementsToObserve = document.querySelectorAll('.blog-post, .stat-card, .info-item, .float-card, .newsletter-content');
elementsToObserve.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(element);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.blob, .floating-cards');
    
    parallaxElements.forEach(element => {
        if (element.classList.contains('blob')) {
            const offset = window.scrollY * 0.5;
            element.style.transform = `translate(0, ${offset}px)`;
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe blog posts and stat cards for animation
document.querySelectorAll('.blog-post, .stat-card, .info-item, .float-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Animate counter numbers
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-card h3');
    const observerCounters = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = element.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                if (numericValue) {
                    let currentValue = 0;
                    const increment = numericValue / 50;
                    const interval = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            element.textContent = finalValue;
                            clearInterval(interval);
                        } else {
                            element.textContent = Math.floor(currentValue).toLocaleString() + '+';
                        }
                    }, 20);
                }
                
                observerCounters.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observerCounters.observe(card));
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', animateCounters);

// Smooth header shadow on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
    }
});

// Ripple effect on button click
document.querySelectorAll('.cta-btn, .submit-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        // Ensure button has position relative
        if (getComputedStyle(this).position === 'static') {
            this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
    }

    .slide-in-left {
        animation: slideInLeft 0.8s ease-out forwards;
    }

    .slide-in-right {
        animation: slideInRight 0.8s ease-out forwards;
    }
`;
document.head.appendChild(rippleStyle);

// Blog Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    const searchModalClose = document.getElementById('searchModalClose');
    const searchModalOverlay = document.getElementById('searchModalOverlay');
    
    // Modal functions
    function openSearchModal() {
        searchModal.classList.add('active');
        searchModalOverlay.classList.add('active');
        document.getElementById('searchInputModal').focus();
        document.body.style.overflow = 'hidden';
    }

    function closeSearchModal() {
        searchModal.classList.remove('active');
        searchModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Modal event listeners
    if (searchToggle) {
        searchToggle.addEventListener('click', openSearchModal);
    }

    if (searchModalClose) {
        searchModalClose.addEventListener('click', closeSearchModal);
    }

    if (searchModalOverlay) {
        searchModalOverlay.addEventListener('click', closeSearchModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });

    // Search functionality
    const searchInputModal = document.getElementById('searchInputModal');
    const searchClearModal = document.getElementById('searchClearModal');
    const searchTagsModal = document.querySelectorAll('.search-tag-modal');
    const blogGrid = document.getElementById('blogGrid');
    const blogPosts = blogGrid ? Array.from(blogGrid.querySelectorAll('.blog-post')) : [];
    const searchResultsModal = document.getElementById('searchResultsModal');
    
    let activeFilters = {
        search: '',
        tags: []
    };

    // Store original blog post data
    const blogPostsData = blogPosts.map(post => ({
        element: post,
        title: post.querySelector('h3')?.textContent.toLowerCase() || '',
        content: post.querySelector('.post-content p')?.textContent.toLowerCase() || '',
        badge: post.querySelector('.post-badge')?.textContent.toLowerCase() || '',
        allText: (post.textContent || '').toLowerCase()
    }));

    // Search input listener
    if (searchInputModal) {
        searchInputModal.addEventListener('input', function(e) {
            activeFilters.search = e.target.value.trim().toLowerCase();
            updateSearchClearModal();
            filterBlogPosts();
        });
    }

    // Clear search button
    if (searchClearModal) {
        searchClearModal.addEventListener('click', function() {
            searchInputModal.value = '';
            activeFilters.search = '';
            updateSearchClearModal();
            filterBlogPosts();
        });
    }

    // Tag filter buttons
    searchTagsModal.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagValue = this.getAttribute('data-tag').toLowerCase();
            
            if (activeFilters.tags.includes(tagValue)) {
                activeFilters.tags = activeFilters.tags.filter(t => t !== tagValue);
                this.classList.remove('active');
            } else {
                activeFilters.tags.push(tagValue);
                this.classList.add('active');
            }
            
            filterBlogPosts();
        });
    });

    // Update clear button visibility
    function updateSearchClearModal() {
        if (searchInputModal.value.trim() !== '') {
            searchClearModal.classList.add('active');
        } else {
            searchClearModal.classList.remove('active');
        }
    }

    // Filter blog posts based on search and tags
    function filterBlogPosts() {
        let visibleCount = 0;

        blogPostsData.forEach(post => {
            let matchesSearch = true;
            let matchesTags = true;

            // Check search filter
            if (activeFilters.search) {
                matchesSearch = post.title.includes(activeFilters.search) || 
                               post.content.includes(activeFilters.search) ||
                               post.badge.includes(activeFilters.search);
            }

            // Check tag filters
            if (activeFilters.tags.length > 0) {
                matchesTags = activeFilters.tags.some(tag => post.badge.includes(tag));
            }

            const isVisible = matchesSearch && matchesTags;
            post.element.style.display = isVisible ? '' : 'none';
            post.element.style.opacity = isVisible ? '1' : '0';
            post.element.style.pointerEvents = isVisible ? 'auto' : 'none';
            
            if (isVisible) {
                visibleCount++;
            }
        });

        // Update search results message
        updateSearchResultsModal(visibleCount);
    }

    // Update search results message
    function updateSearchResultsModal(count) {
        if (activeFilters.search || activeFilters.tags.length > 0) {
            searchResultsModal.classList.add('active');
            
            if (count === 0) {
                searchResultsModal.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>Nessun articolo trovato. Prova a modificare i filtri di ricerca.</p>
                `;
            } else {
                searchResultsModal.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>${count} articolo${count !== 1 ? 'i' : ''} trovato${count !== 1 ? 's' : ''}</p>
                `;
            }
        } else {
            searchResultsModal.classList.remove('active');
            searchResultsModal.innerHTML = '';
        }
    }
});
