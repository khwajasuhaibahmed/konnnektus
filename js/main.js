/**
 * KONNNEKTUS PVT. LTD. - PRIMARY INTERACTION SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Load Animation Timeline
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // 2. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileMenuOverlay) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileMenuOverlay.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Scroll Progress & Sticky Header
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Update progress bar width
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Toggle sticky header class
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 4. Scroll Reveal (Intersection Observer)
    const revealSections = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible to optimize performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealSections.forEach(section => {
            revealObserver.observe(section);
        });
    } else {
        // Fallback for older browsers
        revealSections.forEach(section => {
            section.classList.add('visible');
        });
    }

    // 5. Active Nav Item Tracking on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for sticky navbar
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                // Also update mobile nav active states
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // 6. Magnetic Button Effect (with smooth mouse-hover tracking)
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                
                // Get mouse coordinates relative to button center
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                
                // Translate the button slightly (cap movement to max 12px)
                const movementX = x * 0.35;
                const movementY = y * 0.35;
                
                btn.style.transform = `translate3d(${movementX}px, ${movementY}px, 0) scale(1.03)`;
                btn.style.boxShadow = 'var(--shadow-glow)';
            });

            btn.addEventListener('mouseleave', () => {
                // Spring back smoothly
                btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
                btn.style.boxShadow = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease';
            });
            
            btn.addEventListener('mouseenter', () => {
                // Reset transition to allow immediate mouse tracking on hover
                btn.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
            });
        });
    }

    // 7. Contact Form Handling & Validation
    const contactForm = document.getElementById('contact-form');
    const successFeedback = document.getElementById('form-success');
    const errorFeedback = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide previous feedbacks
            successFeedback.style.display = 'none';
            errorFeedback.style.display = 'none';
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Simple Email Regex validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (name === '' || email === '' || !emailPattern.test(email) || message === '') {
                errorFeedback.style.display = 'block';
                errorFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }
            
            // Simulate API Request (Form Submission)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                successFeedback.style.display = 'block';
                contactForm.reset();
                successFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }
});
