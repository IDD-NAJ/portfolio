document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle with localStorage and system preference
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }

    // Initialize theme with system preference
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Theme toggle event with keyboard support
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Enhanced smooth scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, '', this.getAttribute('href'));
            }
        });
    });

    // Improved scroll progress indicator with performance optimization
    const scrollProgress = document.querySelector('.scroll-progress');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                scrollProgress.style.width = scrolled + '%';
                ticking = false;
            });
            ticking = true;
        }
    });

    // Enhanced back to top button with fade animation
    const backToTop = document.getElementById('backToTop');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide button with fade effect
        if (scrollTop > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }

        // Add scroll direction class
        if (scrollTop > lastScrollTop) {
            backToTop.classList.add('scrolling-down');
        } else {
            backToTop.classList.remove('scrolling-down');
        }
        
        lastScrollTop = scrollTop;
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced form validation with better UX
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formStatus = document.getElementById('formStatus');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Form validation
                const formData = new FormData(contactForm);
                let isValid = true;
                const requiredFields = ['name', 'email', 'subject', 'message'];
                
                // Clear previous errors
                contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                formStatus.textContent = '';
                formStatus.className = 'form-status';
                
                // Validate required fields
                requiredFields.forEach(field => {
                    const input = contactForm.querySelector(`[name="${field}"]`);
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        input.setAttribute('aria-invalid', 'true');
                    }
                });

                if (!isValid) {
                    throw new Error('Please fill in all required fields');
                }

                // Email validation
                const email = formData.get('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    const emailInput = contactForm.querySelector('[name="email"]');
                    emailInput.classList.add('error');
                    emailInput.setAttribute('aria-invalid', 'true');
                    throw new Error('Please enter a valid email address');
                }

                // Submit form
                formStatus.textContent = 'Sending message...';
                formStatus.classList.add('sending');
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Success
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.add('success');
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);

            } catch (error) {
                formStatus.textContent = error.message;
                formStatus.classList.add('error');
                
                // Reset button
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });

        // Real-time validation
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('error');
                    input.removeAttribute('aria-invalid');
                }
            });
        });
    }

    // Enhanced animations with Intersection Observer
    const animateOnScroll = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Enhanced mobile menu with better accessibility
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isExpanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            
            // Trap focus within menu when open
            if (!isExpanded) {
                const focusableElements = nav.querySelectorAll('a, button');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                
                nav.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.burger')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
                burger.focus();
            }
        });
    }

    // Enhanced header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up', 'scroll-down');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add loading animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .burger.toggle .line2 {
            opacity: 0;
        }

        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }

        header.scroll-up {
            transform: translateY(0);
            transition: transform 0.3s ease-in-out;
        }

        header.scroll-down {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }

        .form-status {
            margin-top: 1rem;
            padding: 0.5rem;
            border-radius: 4px;
            text-align: center;
        }

        .form-status.error {
            background-color: rgba(255, 0, 0, 0.1);
            color: #ff0000;
        }

        .form-status.success {
            background-color: rgba(0, 255, 0, 0.1);
            color: #00aa00;
        }

        .form-status.sending {
            background-color: rgba(0, 0, 255, 0.1);
            color: #0000ff;
        }

        input.error, textarea.error {
            border-color: #ff0000 !important;
        }

        .back-to-top {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .back-to-top.scrolling-down {
            transform: translateY(100%);
        }
    `;
    document.head.appendChild(style);
}); 