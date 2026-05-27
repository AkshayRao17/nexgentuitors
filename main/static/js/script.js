window.addEventListener("scroll", function () {
    let elements = document.querySelectorAll(".reveal");

    elements.forEach(function (el) {
        let windowHeight = window.innerHeight;
        let elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
});

function confirmDelete() {
    return confirm("Are you sure you want to delete this event?");
}

// ================= SCROLL ANIMATION =================
// ===== FAST SCROLL ANIMATION ====
// ================= SCROLL REVEAL (SMOOTH & FIXED) =================
// ================= PRO SCROLL ANIMATION =================

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {

            // add stagger delay
            const children = entry.target.querySelectorAll(".reveal-child");

            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add("active");
                }, index * 150); // delay between items
            });

            entry.target.classList.add("active");
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach((el) => observer.observe(el));

window.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(".feature-card");

    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        const height = window.innerHeight;

        if (top < height - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
        let circle = document.createElement("span");
        circle.classList.add("ripple");

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        circle.style.left = x + "px";
        circle.style.top = y + "px";

        this.appendChild(circle);

        setTimeout(() => circle.remove(), 500);
    });
});

let menuScrollPosition = 0;

function lockPageScroll() {
    menuScrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
    document.body.style.top = `-${menuScrollPosition}px`;
}

function unlockPageScroll() {
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, menuScrollPosition);
}

function toggleMenu() {
    const menu = document.getElementById("navLinks");
    const overlay = document.getElementById("menuOverlay");
    const menuToggle = document.querySelector(".menu-toggle");

    if (!menu) {
        return;
    }

    const isOpen = menu.classList.toggle("active");
    menu.classList.toggle("show", isOpen);

    if (isOpen) {
        lockPageScroll();
    } else {
        unlockPageScroll();
    }

    if (overlay) {
        overlay.classList.toggle("active", isOpen);
    }

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
}

function closeMenu() {
    const menu = document.getElementById("navLinks");
    const overlay = document.getElementById("menuOverlay");
    const menuToggle = document.querySelector(".menu-toggle");

    if (menu) {
        menu.classList.remove("active", "show");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    unlockPageScroll();

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }
}

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

let lastScroll = 0;
const whatsappBtn = document.querySelector('.whatsapp-btn');

window.addEventListener('scroll', () => {
    if (!whatsappBtn) {
        return;
    }

    let currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
        whatsappBtn.classList.add('whatsapp-hide');
    } else {
        whatsappBtn.classList.remove('whatsapp-hide');
    }

    lastScroll = currentScroll;
});

function getEventCarouselFromControl(control) {
    return control ? control.closest("[data-carousel]") : null;
}

function pauseCarouselVideos(carousel) {
    carousel.querySelectorAll("video").forEach(video => {
        if (!video.paused) {
            video.pause();
        }
    });
}

function setEventSlide(carousel, index) {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".event-slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));

    if (!track || !slides.length) {
        return;
    }

    const nextIndex = (index + slides.length) % slides.length;
    carousel.dataset.carouselIndex = String(nextIndex);
    track.scrollTo({
        left: slides[nextIndex].offsetLeft,
        behavior: "smooth"
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === nextIndex);
    });

    pauseCarouselVideos(carousel);
}

function moveEventSlide(control, direction) {
    const carousel = getEventCarouselFromControl(control);

    if (!carousel) {
        return;
    }

    const currentIndex = Number(carousel.dataset.carouselIndex || 0);
    setEventSlide(carousel, currentIndex + direction);
}

function goToEventSlide(control, index) {
    const carousel = getEventCarouselFromControl(control);

    if (!carousel) {
        return;
    }

    setEventSlide(carousel, index);
}

function initEventCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(carousel => {
        if (carousel.dataset.carouselReady === "true") {
            return;
        }

        const track = carousel.querySelector("[data-carousel-track]");
        const slides = carousel.querySelectorAll(".event-slide");

        if (!track || slides.length <= 1) {
            return;
        }

        carousel.dataset.carouselReady = "true";
        carousel.dataset.carouselIndex = "0";

        let touchStartX = 0;

        carousel.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        carousel.addEventListener("touchend", event => {
            const touchEndX = event.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) < 45) {
                return;
            }

            const currentIndex = Number(carousel.dataset.carouselIndex || 0);
            setEventSlide(carousel, difference > 0 ? currentIndex + 1 : currentIndex - 1);
        }, { passive: true });

        track.addEventListener("scroll", () => {
            const slideWidth = track.clientWidth || 1;
            const currentIndex = Math.round(track.scrollLeft / slideWidth);
            const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
            carousel.dataset.carouselIndex = String(currentIndex);
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle("active", dotIndex === currentIndex);
            });
        }, { passive: true });

        setEventSlide(carousel, 0);
    });
}

initEventCarousels();
document.addEventListener("DOMContentLoaded", initEventCarousels);
