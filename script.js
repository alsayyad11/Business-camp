class NovaBootcamp {
  constructor() {
    this.isLoading = true;
    this.scrollPosition = 0;
    this.intersectionObserver = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.startLoadingSequence();
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.initializeCounters();
    this.setupNavigation();
    this.loadContent();
  }

  // Loading Screen Animation
  startLoadingSequence() {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingProgress = document.querySelector(".loading-progress");

    if (!loadingScreen) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;

      if (loadingProgress) {
        loadingProgress.style.width = `${progress}%`;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add("hidden");
          this.isLoading = false;
          this.triggerEntranceAnimations();
        }, 500);
      }
    }, 150);
  }

  // Entrance Animations
  triggerEntranceAnimations() {
    const elements = document.querySelectorAll(
      ".animate-fadeInUp, .animate-fadeInRight"
    );
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animationPlayState = "running";
      }, index * 100);
    });

    // Start counter animations
    this.startCounterAnimations();
  }

  // Theme Management
  initializeTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  }

  getSavedTheme() {
    const saved = localStorage.getItem("nova-theme");
    if (saved) return saved;

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark-mode";
    }
    return "light-mode";
  }

  applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("nova-theme", theme);

    // Update theme toggle icon
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");

    if (theme === "dark-mode") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-mode")
      ? "dark-mode"
      : "light-mode";
    const newTheme = currentTheme === "dark-mode" ? "light-mode" : "dark-mode";

    this.applyTheme(newTheme);
    this.animateThemeTransition();
  }

  animateThemeTransition() {
    document.body.style.transition = "all 0.3s ease";
    setTimeout(() => {
      document.body.style.transition = "";
    }, 300);
  }

  // Navigation
  setupNavigation() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (navbar) {
        if (scrollTop > 100) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }

      lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });
    }

    // Smooth scroll for nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.smoothScrollTo(target);
            if (navMenu && navMenu.classList.contains("active")) {
              navMenu.classList.remove("active");
              hamburger.classList.remove("active");
              document.body.classList.remove("menu-open");
            }
          }
        }
      });
    });
  }

  smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 70; // Account for navbar height
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ease = this.easeInOutCubic(progress / duration);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
      .instructor-card, .session-card, .stat-item, .section-header,
      .hero-badge, .cta-content, .footer-content
    `);

    animatableElements.forEach((el) => {
      this.intersectionObserver.observe(el);
    });
  }

  animateElement(element) {
    if (element.classList.contains("animated")) return;

    element.classList.add("animated");
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 100);
  }

  // Counter Animations
  initializeCounters() {
    this.counters = document.querySelectorAll(".stat-item");
    this.counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("counted")
          ) {
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.7 }
    );

    this.counters.forEach((counter) => {
      this.counterObserver.observe(counter);
    });
  }

  startCounterAnimations() {
    // Delay counter animations until after loading
    setTimeout(() => {
      this.counters.forEach((counter) => {
        if (this.isElementInViewport(counter)) {
          this.animateCounter(counter);
        }
      });
    }, 1000);
  }

  animateCounter(counterElement) {
    if (counterElement.classList.contains("counted")) return;

    counterElement.classList.add("counted");
    const target = parseFloat(counterElement.dataset.counter);
    const numberElement = counterElement.querySelector(".stat-number");

    if (!numberElement || !target) return;

    let current = 0;
    const increment = target / 60; // 60 frames for 1 second
    const isDecimal = target % 1 !== 0;

    const updateCounter = () => {
      current += increment;

      if (current >= target) {
        if (target === 4.9) {
          numberElement.textContent = "4.9";
        } else if (target === 24) {
          numberElement.textContent = "24/7";
        } else {
          numberElement.textContent = Math.ceil(target) + (target >= 95 ? "%" : "+");
        }
        return;
      }

      if (target === 4.9) {
        numberElement.textContent = current.toFixed(1);
      } else if (target === 24) {
        numberElement.textContent = Math.floor(current) + "/7";
      } else {
        numberElement.textContent = Math.floor(current) + (target >= 95 ? "%" : "+");
      }

      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  }

  // Parallax Effects
  setupParallaxEffects() {
    const shapes = document.querySelectorAll(".shape");
    const heroVisual = document.querySelector(".hero-visual");

    window.addEventListener("scroll", () => {
      if (this.isLoading) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      // Animate floating shapes
      shapes.forEach((shape, index) => {
        const speed = 0.2 + index * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
      });

      // Parallax hero visual
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${rate * 0.3}px)`;
      }
    });
  }

  // Back to Top Button
  setupBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");

    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      });

      backToTopBtn.addEventListener("click", () => {
        this.smoothScrollTo(document.body);
      });
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Play video button
    const playButton = document.getElementById("play-video");
    if (playButton) {
      playButton.addEventListener("click", () => {
        this.showVideoModal();
      });
    }

    // Setup back to top
    this.setupBackToTop();

    // Window resize handler
    window.addEventListener("resize", this.debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModals();
      }
    });
  }

  // Video Modal
  showVideoModal() {
    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        </div>
      </div>
    `;

    document.body.appendChild(modal );
    document.body.classList.add("modal-open");

    // Animate modal in
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);

    // Close modal handlers
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => {
      this.closeVideoModal(modal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeVideoModal(modal);
      }
    });
  }

  closeVideoModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.classList.remove("modal-open");
    }, 300);
  }

  closeModals() {
    const modals = document.querySelectorAll(".video-modal");
    modals.forEach((modal) => {
      this.closeVideoModal(modal);
    });
  }

  // Content Loading
  loadContent() {
    console.log("Loading content...");
    if (this.isHomePage()) {
      console.log("On Home Page");
      this.loadInstructors();
      this.loadSessions();
    } else if (this.isSessionPage()) {
      console.log("On Session Page");
      this.loadSessionPage();
    }
  }

  isHomePage() {
    const path = window.location.pathname;
    return (
      path.includes("index.html") ||
      path === "/" ||
      path === "" ||
      path.endsWith("/")
    ); // Added path.endsWith("/") for GitHub Pages root
  }

  isSessionPage() {
    return window.location.pathname.includes("session.html");
  }

  // Instructors Data
  getInstructorsData() {
    return [
      {
        id: 1,
        name: "Abdallah Altaqawy",
        bio: "A Business graduate from Mansoura University. Currently the Head of the Business Committee at Breakin Point and Founder of Cuppy startup. I've participated in various local and international competitions. Passionate about innovation and building impactful startups.",
        image: "./assets/instructor1.jpg", // Corrected path
        skills: ["Business Strategy", "Startup Development", "Innovation"],
        social: {
          facebook: "https://www.facebook.com/share/16km663qnL/",
          linkedin: "https://www.linkedin.com/in/abdullah-altaqawy-94976b285/",
        },
      },
      {
        id: 2,
        name: "Ahmed M Alsayyad",
        bio: "Hacker for fun.",
        image: "./assets/instructor2.jpg", // Corrected path
        skills: ["Cybersecurity"],
        social: {
          facebook: "https://www.facebook.com/profile.php?id=100058504338456",
          linkedin: "https://www.linkedin.com/in/alsayyad11/",
        },
      },
      {
        id: 3,
        name: "Hoda Reda",
        bio: "An Electronics and Communications Engineering student, currently Head of PR at Breakin Point and a Business Committee Supervisor. I'm passionate about Marketing, especially Sales, and I love applying what I learn in real-world projects. I'm also one of the co-founders of CUPPY and Sensopal.",
        image: "./assets/instructor5.jpg", // Corrected path (assuming this is the correct image )
        skills: ["Marketing", "Sales", "Public Relations"],
        social: {
          facebook: "https://www.facebook.com/share/16GiCTMHbi/",
          linkedin: "https://www.linkedin.com/in/hoda-reda-6a58ab281/",
        },
      },
      {
        id: 4,
        name: "Manar Ashraf",
        bio: "An Electronics & Communications student currently working as a Business Supervisor at Breakin point. Passionate about data analysis and data science, I've honed my skills through multiple business camps and competitions that fueled both my technical growth and personal development.",
        image: "./assets/instructor7.jpg", // Corrected path (assuming this is the correct image )
        skills: ["Data Analysis", "Data Science", "Business Intelligence"],
        social: {
          facebook: "https://www.facebook.com/profile.php?id=100082033623873&mibextid=2JQ9oc",
          linkedin: "http://www.linkedin.com/in/manar-ashraf-63b556293",
        },
      },
      {
        id: 5,
        name: "Basant Adel",
        bio: "A Business graduate specialized in Accounting and an Instructor at Breakin Point's Business Committee. I'm passionate about entrepreneurship, marketing, and turning ideas into impactful projects. I founded Piny Candles, a handcrafted brand reflecting warmth and creativity.",
        image: "./assets/instructor5.jpg", // Corrected path (assuming this is the correct image )
        skills: ["Accounting", "Entrepreneurship", "Brand Development"],
        social: {
          facebook: "https://www.facebook.com/share/19DRp9Byii/",
          linkedin: "https://www.linkedin.com/in/basant-adel-48254530b",
        },
      },
    ];
  }

  loadInstructors( ) {
    console.log("Loading instructors...");
    const instructors = this.getInstructorsData();
    const instructorsGrid = document.getElementById("instructors-grid");

    if (!instructorsGrid) {
      console.error("Instructors grid element not found!");
      return;
    }

    instructorsGrid.innerHTML = ""; // Clear existing content

    instructors.forEach((instructor) => {
      const instructorCard = document.createElement("div");
      instructorCard.className = "instructor-card";
      instructorCard.innerHTML = `
        <img src="${instructor.image}" alt="${instructor.name}">
        <h3>${instructor.name}</h3>
        <p>${instructor.bio}</p>
        <div class="social-links">
          <a href="${instructor.social.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="${instructor.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
        </div>
      `;
      instructorsGrid.appendChild(instructorCard);
    });
    console.log("Instructors loaded.");
  }

  // Sessions Data
  getSessionsData() {
    return [
      {
        id: 1,
        title: "Introduction to Entrepreneurship",
        instructor: "Abdallah Altaqawy",
        date: "August 5, 2025",
        duration: "2 hours",
        level: "Beginner",
        description: "A beginner-friendly session that introduces the key concepts of starting a business. You'll learn about the entrepreneurial mindset, how to spot opportunities, and what it takes to turn an idea into a real project.",
        coverImage: "./assets/session1_cover.jpg", // Corrected path
        presentationPdf: "./assets/presentation_sample.pdf",
        summaryPdf: "./assets/GYM APP .pdf", // Corrected path based on previous request
        recommendedVideos: [
          {
            title: "What is Entrepreneurship?",
            url: "https://www.youtube.com/embed/ZkPBvLF3N2c", // Example real video
            duration: "06:10",
            description: "Understanding the fundamentals of entrepreneurship and business creation.",
          },
          {
            title: "Entrepreneurial Mindset",
            url: "https://www.youtube.com/embed/f_g4_w8z-0Q", // Example real video
            duration: "12:45",
            description: "Developing the mindset needed to succeed as an entrepreneur.",
          },
        ],
        task: "Develop a SWOT analysis for a hypothetical startup in the tech industry. Identify key strengths, weaknesses, opportunities, and threats. Submit a 2-page report.",
      },
      {
        id: 2,
        title: "Digital Marketing Strategies",
        instructor: "Hoda Reda",
        date: "August 12, 2025",
        duration: "2.5 hours",
        level: "Intermediate",
        description: "Dive deep into the world of digital marketing. Learn about SEO, social media marketing, content creation, and effective online advertising techniques.",
        coverImage: "./assets/session3_cover.jpg", // Corrected path
        presentationPdf: "./assets/presentation_sample.pdf",
        summaryPdf: "./assets/summary_sample.pdf",
        recommendedVideos: [
          {
            title: "Introduction to Digital Marketing",
            url: "https://www.youtube.com/embed/n_Q_J0_eW0k", // Example real video
            duration: "08:20",
            description: "An overview of the digital marketing landscape.",
          },
          {
            title: "SEO Best Practices",
            url: "https://www.youtube.com/embed/xsF_G_y1f6Q", // Example real video
            duration: "10:00",
            description: "Tips and tricks for optimizing your website for search engines.",
          },
        ],
        task: "Create a digital marketing plan for a small local business, including target audience, channels, and key metrics. Present your plan in a short video.",
      },
      {
        id: 3,
        title: "Financial Management for Startups",
        instructor: "Basant Adel",
        date: "August 19, 2025",
        duration: "3 hours",
        level: "Advanced",
        description: "Master the essentials of financial planning, budgeting, fundraising, and cash flow management crucial for startup success.",
        coverImage: "./assets/session1_cover.jpg", // Corrected path
        presentationPdf: "./assets/presentation_sample.pdf",
        summaryPdf: "./assets/summary_sample.pdf",
        recommendedVideos: [
          {
            title: "Startup Funding Explained",
            url: "https://www.youtube.com/embed/1234567890", // Placeholder, replace with real video
            duration: "07:00",
            description: "Understanding different funding options for startups.",
          },
          {
            title: "Budgeting for Small Businesses",
            url: "https://www.youtube.com/embed/0987654321", // Placeholder, replace with real video
            duration: "09:30",
            description: "Practical tips for managing your startup's budget.",
          },
        ],
        task: "Prepare a 12-month financial forecast for a new e-commerce venture, including projected revenue, expenses, and break-even analysis.",
      },
    ];
  }

  loadSessions( ) {
    console.log("Loading sessions...");
    const sessions = this.getSessionsData();
    const sessionsGrid = document.getElementById("sessions-grid");

    if (!sessionsGrid) {
      console.error("Sessions grid element not found!");
      return;
    }

    sessionsGrid.innerHTML = ""; // Clear existing content

    sessions.forEach((session) => {
      const sessionCard = document.createElement("a");
      sessionCard.href = `session.html?id=${session.id}`;
      sessionCard.className = "session-card";
      sessionCard.innerHTML = `
        <img src="${session.coverImage}" alt="${session.title}">
        <div class="session-card-content">
          <h3>${session.title}</h3>
          <p>Instructor: ${session.instructor}</p>
          <p>Date: ${session.date}</p>
        </div>
      `;
      sessionsGrid.appendChild(sessionCard);
    });
    console.log("Sessions loaded.");
  }

  loadSessionPage() {
    console.log("Loading session page...");
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = parseInt(urlParams.get("id"));
    const session = this.getSessionsData().find((s) => s.id === sessionId);

    if (!session) {
      console.error("Session not found!");
      document.querySelector(".session-content .container").innerHTML = "<p>Session not found.</p>";
      return;
    }

    // Update Session Header
    document.getElementById("session-title").textContent = session.title;
    document.getElementById("session-instructor").textContent = session.instructor;
    document.getElementById("session-date").textContent = session.date;

    // Render PDFs
    this.renderPdf(session.presentationPdf, "presentation-viewer");
    this.renderPdf(session.summaryPdf, "summary-viewer");

    // Render Recommended Videos
    const videosContainer = document.getElementById("recommended-videos-container");
    if (videosContainer) {
      videosContainer.innerHTML = ""; // Clear existing content
      session.recommendedVideos.forEach((video) => {
        const videoItem = document.createElement("div");
        videoItem.className = "video-item";
        videoItem.innerHTML = `
          <iframe src="${video.url}" frameborder="0" allowfullscreen></iframe>
          <div class="video-info">
            <h4>${video.title}</h4>
            <p>Duration: ${video.duration}</p>
            ${video.description ? `<p>${video.description}</p>` : ""}
          </div>
        `;
        videosContainer.appendChild(videoItem);
      });
    }

    // Update Session Task
    document.getElementById("session-task-content").textContent = session.task;
    console.log("Session page loaded.");
  }

  // PDF Renderer (using PDF.js)
  renderPdf(pdfUrl, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`PDF container ${containerId} not found.`);
      return;
    }
    container.innerHTML = ""; // Clear previous content

    // Ensure PDF.js is loaded
    if (typeof pdfjsLib === "undefined") {
      console.error("PDF.js library not loaded.");
      // Fallback or show error message
      container.innerHTML = "<p>PDF viewer not available. Please try again later.</p>";
      return;
    }

    pdfjsLib.getDocument(pdfUrl).promise.then(
      (pdf) => {
        const numPages = pdf.numPages;
        for (let i = 1; i <= numPages; i++) {
          pdf.getPage(i).then((page) => {
            const scale = 1.5; // Adjust scale as needed
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = "100%"; // Make canvas responsive
            canvas.style.height = "auto";
            canvas.style.marginBottom = "10px"; // Add some spacing between pages
            canvas.style.border = "1px solid var(--border-color-light)";
            canvas.style.borderRadius = "8px";

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext);
            container.appendChild(canvas);
          });
        }
      },
      (reason) => {
        console.error(`Error loading PDF from ${pdfUrl}:`, reason);
        container.innerHTML = `<p>Error loading PDF: ${reason.message}. Please ensure the file exists and is accessible.</p>`;
      }
    );
  }

  // Utility for debouncing resize events
  debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  handleResize() {
    // Re-render PDFs on resize to adjust canvas size
    if (this.isSessionPage()) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = parseInt(urlParams.get("id"));
      const session = this.getSessionsData().find((s) => s.id === sessionId);
      if (session) {
        this.renderPdf(session.presentationPdf, "presentation-viewer");
        this.renderPdf(session.summaryPdf, "summary-viewer");
      }
    }
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded. Initializing NovaBootcamp...");
  new NovaBootcamp();
});
