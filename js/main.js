// ===== INITIALIZE AOS (Animate On Scroll) =====
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    mirror: false,
    offset: 100
});

// ===== MOBILE NAVIGATION TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(247, 243, 237, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(247, 243, 237, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ANIMATED COUNTERS =====
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
};

animateCounters();

// ===== INITIALIZE SWIPER SLIDERS =====
// Gallery Swiper
const gallerySwiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Testimonials Swiper
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// ===== BEFORE/AFTER SLIDER FUNCTIONALITY =====
class BeforeAfterSlider {
    constructor(element) {
        this.slider = element;
        this.handle = this.slider.querySelector('.slider-handle');
        this.afterImage = this.slider.querySelector('.after-image');
        this.isDragging = false;
        this.isPointerInside = false;
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.handle.addEventListener('mousedown', this.startDrag.bind(this));
        this.slider.addEventListener('mousedown', (e) => {
            // Allow dragging/clicking anywhere on the slider track
            if (e.target !== this.handle) {
                this.updateFromEvent(e);
                this.startDrag(e);
            }
        });
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Touch events
        this.handle.addEventListener('touchstart', (e) => { this.startDrag(e); }, { passive: true });
        this.slider.addEventListener('touchstart', (e) => {
            if (e.target !== this.handle) {
                this.updateFromEvent(e);
                this.startDrag(e);
            }
        }, { passive: true });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', this.endDrag.bind(this));

        // Click to set position
        this.slider.addEventListener('click', (e) => {
            if (e.target !== this.handle) {
                this.updateFromEvent(e);
            }
        });
        
        // Set initial position
        this.updatePosition(50);
    }
    
    startDrag(e) {
        if (e.cancelable) e.preventDefault();
        this.isDragging = true;
        this.slider.style.cursor = 'ew-resize';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        this.updateFromEvent(e);
    }
    
    endDrag() {
        this.isDragging = false;
        this.slider.style.cursor = 'default';
    }
    
    updateFromEvent(e) {
        const rect = this.slider.getBoundingClientRect();
        let x = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));
        this.updatePosition(position);
    }

    updatePosition(percentage) {
        // Invert direction: moving right should reveal the image below (base image),
        // so we reduce the overlay (afterImage) width when percentage increases
        const overlayWidth = 100 - percentage;
        this.afterImage.style.width = overlayWidth + '%';
        this.handle.style.left = percentage + '%';
    }
}

// Initialize all before/after sliders
document.querySelectorAll('.before-after-slider').forEach(slider => {
    new BeforeAfterSlider(slider);
});

// ===== SERVICE CARDS HOVER EFFECT =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.service-details').style.maxHeight = '500px';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.service-details').style.maxHeight = null;
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Show success message (in production, this would send to a server)
        const successMessage = this.querySelector('.form-success');
        successMessage.style.display = 'block';
        
        // Reset form
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // In production, you would send the data to your server here
        console.log('Form submitted with data:', data);
        
        // Optional: Send to WhatsApp
        const whatsappMessage = `Nuovo contatto dal sito:%0A%0ANome: ${data.name}%0ATelefono: ${data.phone}%0AZona: ${data.area || 'Non specificata'}%0ATipo pavimento: ${data['floor-type'] || 'Non specificato'}%0AMessaggio: ${data.message || 'Nessun messaggio'}`;
        // window.open(`https://wa.me/393924556677?text=${whatsappMessage}`, '_blank');
    });
}

// ===== PARALLAX EFFECT FOR MARBLE TEXTURE =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const marbleTexture = document.querySelector('.marble-texture');
    if (marbleTexture) {
        marbleTexture.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== LAZY LOAD IMAGES =====
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===== GALLERY ITEM CLICK TO EXPAND =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles for modal
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s;
            }
            
            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .modal-content img {
                width: 100%;
                height: auto;
                border-radius: 16px;
            }
            
            .modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 40px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .modal-close:hover {
                transform: scale(1.2);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Close modal on click
        modal.addEventListener('click', function() {
            modal.remove();
            style.remove();
        });
    });
});

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    background: var(--gold);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: 0 4px 20px rgba(201, 169, 97, 0.4);
    transition: all 0.3s;
    z-index: 998;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== PROCESS TIMELINE ANIMATION =====
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.process-step').forEach(step => {
    timelineObserver.observe(step);
});

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">LT</div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    // Add preloader styles
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--ivory);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            transition: opacity 0.5s;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-logo {
            font-family: var(--font-serif);
            font-size: 4rem;
            color: var(--gold);
            margin-bottom: 2rem;
            animation: pulse 1.5s infinite;
        }
        
        .preloader-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(201, 169, 97, 0.2);
            border-top: 3px solid var(--gold);
            border-radius: 50%;
            margin: 0 auto;
            animation: spin 1s linear infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);
    
    // Remove preloader after page load
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
            preloaderStyle.remove();
        }, 500);
    }, 1000);
});

// ===== DYNAMIC YEAR IN FOOTER =====
const yearElements = document.querySelectorAll('.current-year');
const currentYear = new Date().getFullYear();
yearElements.forEach(element => {
    element.textContent = currentYear;
});