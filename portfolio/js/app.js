
(function () {
    "use strict";
    let lenis = null;

    /* ------------------------------------------
       THEME TOGGLE (green / orange)
       ------------------------------------------ */

    function initThemeToggle() {
        const root = document.documentElement;
        const themeStorageKey = "portfolio-theme";

        function getStoredTheme() {
            const stored = localStorage.getItem(themeStorageKey);
            return stored === "green" || stored === "orange" ? stored : null;
        }

        function updateToggleLabels(theme) {
            const nextTheme = theme === "green" ? "orange" : "green";
            document.querySelectorAll(".theme-toggle").forEach((btn) => {
                btn.textContent = nextTheme;
                btn.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
            });
        }

        function applyTheme(theme) {
            root.setAttribute("data-theme", theme);
            updateToggleLabels(theme);
        }

        function toggleTheme() {
            const currentTheme = root.getAttribute("data-theme") || "green";
            const nextTheme = currentTheme === "green" ? "orange" : "green";
            localStorage.setItem(themeStorageKey, nextTheme);
            applyTheme(nextTheme);
        }

        const initialTheme = getStoredTheme() || "green";
        applyTheme(initialTheme);

        const headerInners = document.querySelectorAll(".header-inner");
        headerInners.forEach((headerInner) => {
            const navBtn = headerInner.querySelector(".nav-menu-btn");
            if (!navBtn || headerInner.querySelector(".theme-toggle")) return;

            let actions = headerInner.querySelector(".header-actions");
            if (!actions) {
                actions = document.createElement("div");
                actions.className = "header-actions";
                headerInner.insertBefore(actions, navBtn);
                actions.appendChild(navBtn);
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.className = "theme-toggle magnetic";
            toggleBtn.type = "button";
            toggleBtn.addEventListener("click", toggleTheme);
            actions.insertBefore(toggleBtn, navBtn);
        });

        updateToggleLabels(initialTheme);
    }

    /* ------------------------------------------
       CUSTOM CURSOR
       ------------------------------------------ */

    function initCursor() {
        const cursor = document.querySelector(".cursor");
        if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

        let cursorX = 0;
        let cursorY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener("mousemove", (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function updateCursor() {
            const lerp = 0.15;
            cursorX += (targetX - cursorX) * lerp;
            cursorY += (targetY - cursorY) * lerp;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(updateCursor);
        }

        updateCursor();

        const hoverables = document.querySelectorAll(
            'a, button, input, textarea, .project-card, .skill-tag, [data-hover="true"]'
        );

        hoverables.forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
        });

        document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
        document.addEventListener("mouseup", () => cursor.classList.remove("clicking"));

        document.addEventListener("mouseleave", () => cursor.classList.add("hidden"));
        document.addEventListener("mouseenter", () => cursor.classList.remove("hidden"));
    }

    /* ------------------------------------------
       LENIS SMOOTH SCROLL
       ------------------------------------------ */

    function initLenis() {
        if (typeof Lenis === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            touchMultiplier: 1.2,
        });

        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
            return;
        }

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    /* ------------------------------------------
       TEXT SPLIT ANIMATION (data-split elements)
       ------------------------------------------ */

    function initTextSplits() {
        const splitEls = document.querySelectorAll("[data-split]");

        splitEls.forEach((el) => {
            const text = el.textContent;
            el.textContent = "";
            el.classList.add("split-text");

            [...text].forEach((char, i) => {
                const span = document.createElement("span");
                span.classList.add("char");
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.transitionDelay = `${i * 0.025}s`;
                el.appendChild(span);
            });
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        splitEls.forEach((el) => observer.observe(el));
    }

    /* ------------------------------------------
       NAV LETTER FLIP HOVER
       ------------------------------------------ */

    function initNavFlipText() {
        const flipTargets = document.querySelectorAll("[data-nav-flip]");
        if (!flipTargets.length) return;

        flipTargets.forEach((el) => {
            if (el.dataset.navFlipReady === "true") return;

            const label = (el.dataset.navFlip || el.textContent || "").trim();
            if (!label) return;

            const visual = document.createElement("span");
            visual.className = "nav-flip-text";
            visual.setAttribute("aria-hidden", "true");

            [...label].forEach((char, index) => {
                const letter = document.createElement("span");
                letter.className = "nav-flip-char";
                letter.style.setProperty("--char-index", index);

                if (char === " ") {
                    letter.classList.add("nav-flip-char-space");
                }

                const top = document.createElement("span");
                top.className = "nav-flip-char-face nav-flip-char-face--top";
                top.textContent = char === " " ? "\u00A0" : char;

                const bottom = document.createElement("span");
                bottom.className = "nav-flip-char-face nav-flip-char-face--bottom";
                bottom.textContent = char === " " ? "\u00A0" : char;

                letter.append(top, bottom);
                visual.appendChild(letter);
            });

            const srOnly = document.createElement("span");
            srOnly.className = "sr-only";
            srOnly.textContent = label;

            el.textContent = "";
            el.append(visual, srOnly);
            el.dataset.navFlipReady = "true";
        });
    }

    /* ------------------------------------------
       HEADING SPLIT TEXT (GSAP SplitText)
       ------------------------------------------ */

    function initHeadingSplitText() {
        const headings = document.querySelectorAll("h1, h2");
        if (!headings.length || typeof gsap === "undefined" || typeof SplitText === "undefined") return;

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger, SplitText);
        } else {
            gsap.registerPlugin(SplitText);
        }

        var fontsReady =
            document.fonts && document.fonts.status === "loaded"
                ? Promise.resolve()
                : document.fonts
                    ? document.fonts.ready
                    : Promise.resolve();

        fontsReady.then(function () {
            headings.forEach(function (el) {
                if (!el.textContent || !el.textContent.trim()) return;

                var split = new SplitText(el, {
                    type: "chars",
                    charsClass: "split-char",
                });

                gsap.fromTo(
                    split.chars,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.25,
                        ease: "power3.out",
                        stagger: 0.03,
                        scrollTrigger:
                            typeof ScrollTrigger !== "undefined"
                                ? {
                                    trigger: el,
                                    start: "top 90%",
                                    once: true,
                                    fastScrollEnd: true,
                                }
                                : undefined,
                        force3D: true,
                    }
                );
            });
        });
    }

    /* ------------------------------------------
       LINE REVEAL ANIMATION
       ------------------------------------------ */

    function initLineReveals() {
        const lineEls = document.querySelectorAll(".line-reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add("revealed");
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        lineEls.forEach((el) => observer.observe(el));
    }

    /* ------------------------------------------
       SCROLL ANIMATIONS (Intersection Observer)
       ------------------------------------------ */

    function initScrollAnimations() {
        const animEls = document.querySelectorAll("[data-animate]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );

        animEls.forEach((el) => observer.observe(el));
    }

    /* ------------------------------------------
       MAGNETIC BUTTONS
       ------------------------------------------ */

    function initMagnetic() {
        const magneticEls = document.querySelectorAll(".magnetic");

        magneticEls.forEach((el) => {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = 0.3;

                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            el.addEventListener("mouseleave", () => {
                el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
                el.style.transform = "translate(0px, 0px)";
                setTimeout(() => {
                    el.style.transition = "";
                }, 500);
            });
        });
    }

    /* ------------------------------------------
       PARALLAX ON SCROLL
       ------------------------------------------ */

    function initParallax() {
        const parallaxEls = document.querySelectorAll("[data-parallax]");
        if (!parallaxEls.length) return;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxEls.forEach((el) => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) * speed;

                el.style.transform = `translateY(${offset}px)`;
            });

            requestAnimationFrame(updateParallax);
        }

        requestAnimationFrame(updateParallax);
    }

    /* ------------------------------------------
       HEADER SCROLL STATE
       ------------------------------------------ */

    function initHeaderScroll() {
        const header = document.querySelector(".site-header");
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

            lastScroll = scrollY;
        });
    }

    /* ------------------------------------------
       MARQUEE SPEED ON SCROLL (Lenis velocity)
       ------------------------------------------ */

    function initMarqueeScrollEffect() {
        const marqueeTrack = document.querySelector(".marquee-track");
        if (!marqueeTrack || !lenis) return;

        lenis.on("scroll", ({ velocity }) => {
            const speedMultiplier = 1 + Math.abs(velocity) * 0.05;
            marqueeTrack.style.animationDuration = `${25 / speedMultiplier}s`;
        });
    }

    /* ------------------------------------------
       INDEX PAGE — Clock
       ------------------------------------------ */

    function initClock() {
        const clockEl = document.getElementById("index-clock");
        if (!clockEl) return;

        function updateClock() {
            const now = new Date();
            const options = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Europe/Prague",
            };
            clockEl.textContent = now.toLocaleTimeString("en-GB", options) + " CET";
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    /* ------------------------------------------
       INDEX PAGE — Stagger animation
       ------------------------------------------ */

    function initIndexAnimations() {
        const items = document.querySelectorAll(".index-nav-item");
        const header = document.querySelector(".index-header");
        const footer = document.querySelector(".index-footer");

        if (header) {
            header.style.opacity = "0";
            header.style.transform = "translateY(-20px)";
            setTimeout(() => {
                header.style.transition =
                    "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
                header.style.opacity = "1";
                header.style.transform = "translateY(0)";
            }, 200);
        }

        items.forEach((item, i) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(40px)";
            setTimeout(() => {
                item.style.transition =
                    "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }, 400 + i * 120);
        });

        if (footer) {
            footer.style.opacity = "0";
            setTimeout(() => {
                footer.style.transition = "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)";
                footer.style.opacity = "1";
            }, 900);
        }
    }

    /* ------------------------------------------
       CONTACT FORM
       ------------------------------------------ */

    function initContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '✓ Sent! <span class="arrow">→</span>';
            btn.style.background = "var(--accent)";
            btn.style.color = "var(--bg)";
            btn.style.borderColor = "var(--accent)";

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = "";
                btn.style.color = "";
                btn.style.borderColor = "";
                form.reset();
            }, 3000);
        });
    }

    /* ------------------------------------------
       TILT EFFECT ON PROJECT CARDS
       ------------------------------------------ */

    function initCardTilt() {
        const cards = document.querySelectorAll(".project-card");

        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
                card.style.transform = "translateY(0) perspective(800px) rotateY(0) rotateX(0)";
                setTimeout(() => {
                    card.style.transition = "";
                }, 500);
            });
        });
    }

    /* ------------------------------------------
       COUNTER ANIMATION
       ------------------------------------------ */

    function initCounters() {
        const counters = document.querySelectorAll("[data-counter]");
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((el) => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.counter, 10);
        const duration = 2000;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);

            el.textContent = current + (el.dataset.counterSuffix || "");

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + (el.dataset.counterSuffix || "");
            }
        }

        requestAnimationFrame(step);
    }

    /* ------------------------------------------
       INIT ALL
       ------------------------------------------ */

    function init() {
        initThemeToggle();
        initNavFlipText();
        initLenis();
        initCursor();
        initHeadingSplitText();
        initTextSplits();
        initLineReveals();
        initScrollAnimations();
        initMagnetic();
        initParallax();
        initHeaderScroll();
        initMarqueeScrollEffect();
        initClock();
        initIndexAnimations();
        initContactForm();
        initCardTilt();
        initCounters();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
