// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animate feature cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and steps
document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add click tracking for download button
document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', () => {
        // You can add analytics tracking here
        console.log('Download button clicked');
        
        // Show a helpful message
        setTimeout(() => {
            alert('After downloading, remember to extract the files and follow the installation steps below!');
        }, 100);
    });
});

// Add copy functionality for chrome://extensions/ text
document.addEventListener('DOMContentLoaded', () => {
    const codeElements = document.querySelectorAll('code');
    codeElements.forEach(code => {
        if (code.textContent.includes('chrome://')) {
            code.style.cursor = 'pointer';
            code.title = 'Click to copy';
            code.addEventListener('click', () => {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    const originalText = code.textContent;
                    code.textContent = 'Copied!';
                    code.style.background = '#10b981';
                    code.style.color = 'white';
                    setTimeout(() => {
                        code.textContent = originalText;
                        code.style.background = '#f3f4f6';
                        code.style.color = 'inherit';
                    }, 1000);
                });
            });
        }
    });
});