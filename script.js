// Enhanced JavaScript with Modern Features and Animations
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
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
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
          loadingScreen.classList.add('hidden');
          this.isLoading = false;
          this.triggerEntranceAnimations();
        }, 500);
      }
    }, 150);
  }

  // Entrance Animations
  triggerEntranceAnimations() {
    const elements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeInRight');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animationPlayState = 'running';
      }, index * 100);
    });

    // Start counter animations
    this.startCounterAnimations();
  }

  // Theme Management
  initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check saved theme or system preference
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  getSavedTheme() {
    // Use in-memory storage instead of localStorage for artifacts
    if (window.novaSavedTheme) return window.novaSavedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark-mode';
    }
    return 'light-mode';
  }

  applyTheme(theme) {
    document.body.className = theme;
    window.novaSavedTheme = theme; // Use in-memory storage
    
    if (theme === 'dark-mode') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    
    this.applyTheme(newTheme);
    this.animateThemeTransition();
  }

  animateThemeTransition() {
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  // Navigation
  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (navbar) {
        if (scrollTop > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.smoothScrollTo(target);
            if (navMenu && navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              hamburger.classList.remove('active');
              document.body.classList.remove('menu-open');
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
      rootMargin: '0px 0px -50px 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
      .instructor-card, .session-card, .stat-item, .section-header,
      .hero-badge, .cta-content, .footer-content, .youtube-channel-card
    `);

    animatableElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  animateElement(element) {
    if (element.classList.contains('animated')) return;
    
    element.classList.add('animated');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  }

  // Counter Animations
  initializeCounters() {
    this.counters = document.querySelectorAll('.stat-item');
    this.counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.animateCounter(entry.target);
        }
      });
    }, { threshold: 0.7 });

    this.counters.forEach(counter => {
      this.counterObserver.observe(counter);
    });
  }

  startCounterAnimations() {
    // Delay counter animations until after loading
    setTimeout(() => {
      this.counters.forEach(counter => {
        if (this.isElementInViewport(counter)) {
          this.animateCounter(counter);
        }
      });
    }, 1000);
  }

  animateCounter(counterElement) {
    if (counterElement.classList.contains('counted')) return;
    
    counterElement.classList.add('counted');
    const target = parseFloat(counterElement.dataset.counter);
    const numberElement = counterElement.querySelector('.stat-number');
    
    if (!numberElement || !target) return;

    let current = 0;
    const increment = target / 60; // 60 frames for 1 second
    
    const updateCounter = () => {
      current += increment;
      
      if (current >= target) {
        if (target === 4.9) {
          numberElement.textContent = '4.9';
        } else if (target === 24) {
          numberElement.textContent = '24/7';
        } else {
          numberElement.textContent = Math.ceil(target) + (target >= 95 ? '%' : '+');
        }
        return;
      }
      
      if (target === 4.9) {
        numberElement.textContent = current.toFixed(1);
      } else if (target === 24) {
        numberElement.textContent = Math.floor(current) + '/7';
      } else {
        numberElement.textContent = Math.floor(current) + (target >= 95 ? '%' : '+');
      }
      
      requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
  }

  // Parallax Effects
  setupParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
      if (this.isLoading) return;
      
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Animate floating shapes
      shapes.forEach((shape, index) => {
        const speed = 0.2 + (index * 0.1);
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
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        this.smoothScrollTo(document.body);
      });
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Play video button
    const playButton = document.getElementById('play-video');
    if (playButton) {
      playButton.addEventListener('click', () => {
        this.showVideoModal();
      });
    }

    // Setup back to top
    this.setupBackToTop();

    // Window resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  }

  // Video Modal
  showVideoModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
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

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Animate modal in
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);

    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      this.closeVideoModal(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeVideoModal(modal);
      }
    });
  }

  closeVideoModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open');
    }, 300);
  }

  closeModals() {
    const modals = document.querySelectorAll('.video-modal');
    modals.forEach(modal => {
      this.closeVideoModal(modal);
    });
  }

  // Content Loading
  loadContent() {
    if (this.isHomePage()) {
      this.loadInstructors();
      this.loadSessions();
      this.loadYouTubeChannels();
    } else if (this.isSessionPage()) {
      this.loadSessionPage();
    }
  }

  isHomePage() {
    return window.location.pathname.includes('index.html') || 
           window.location.pathname === '/' ||
           window.location.pathname === '';
  }

  isSessionPage() {
    return window.location.pathname.includes('session.html');
  }

  // Instructors Data
  getInstructorsData() {
    return [
      {
        id: 1,
        name: "Abdallah Altaqawy",
        bio: "A Business graduate from Mansoura University. Currently the Head of the Business Committee at Breakin Point and Founder of Cuppy startup. I've participated in various local and international competitions. Passionate about innovation and building impactful startups.",
        image: "./assets/images/abdallah.jpg",
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
        image: "./assets/images/hunter1.jpg",
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
        image: "./assets/images/hoda.jpg",
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
        image: "./assets/images/manar.jpeg",
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
        image: "./assets/images/basant.jpg",
        skills: ["Accounting", "Entrepreneurship", "Brand Development"],
        social: {
          facebook: "https://www.facebook.com/share/19DRp9Byii/",
          linkedin: "https://www.linkedin.com/in/basant-adel-48254530b",
        },
      },
    ];
  }

  // Sessions Data
  getSessionsData() {
    return [
      {
        id: 1,
        title: "Introduction to Entrepreneurship",
        instructor: "Abdallah Altaqawy",
        date: "August 5, 2025",
        duration: "3 hours",
        level: "Beginner",
        description: "A beginner-friendly session that introduces the key concepts of starting a business. You'll learn about the entrepreneurial mindset, how to spot opportunities, and what it takes to turn an idea into a real project.",
        coverImage: "./assets/images/intro .png",
        presentationPdf: "./assets/files/01- Intro to Business.pdf",
        summaryPdf: "./assets/files/Intro to Business Summary.pdf",
        recommendedVideos: [
          {
            title: "What is Entrepreneurship?",
            url: "https://youtu.be/83M-lcIPIoI?si=ictpgx8GnW03-4ry",
            duration: "12:15",
            description: "Understanding the fundamentals of entrepreneurship and business creation."
          },
          {
            title: "Intro to entrepreneurship",
            url: "https://youtu.be/gGzxpIfEUc8?si=AXgqsteGrWHujHwT",
            duration: "12:45",
            description: "Developing the right mindset for successful entrepreneurship."
          },
        ],
        task: "No Task Required.",
        resources: [
          { name: "What is entrepreneurship", url: "https://ar.wikipedia.org/wiki/%D8%B1%D9%8A%D8%A7%D8%AF%D8%A9_%D8%A3%D8%B9%D9%85%D8%A7%D9%84", icon: "fas fa-toolbox" },
          { name: "10 Differences Between Entrepreneurship and Business Management", url: "https://businessbelarabi.com/%D8%B1%D9%8A%D8%A7%D8%AF%D8%A9-%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84/%D9%85%D8%A7-%D9%87%D9%8A-%D8%B1%D9%8A%D8%A7%D8%AF%D8%A9-%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84/", icon: "fas fa-chart-bar" },
          { name: "What are the types of entrepreneurship and what type of entrepreneur are you?", url: "https://www.for9a.com/learn/%D9%85%D8%A7-%D9%87%D9%8A-%D8%A3%D9%86%D9%88%D8%A7%D8%B9-%D8%B1%D9%8A%D8%A7%D8%AF%D8%A9-%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84-%D9%88%D8%A3%D9%8A-%D9%86%D9%88%D8%B9-%D9%85%D9%86-%D8%B1%D9%88%D8%A7%D8%AF-%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84-%D8%A3%D9%86%D8%AA", icon: "fas fa-search" }
        ]
      },
      {
        id: 2,
        title: "Design thinking - Define the problem",
        instructor: "Ahmed M Elsayyad",
        date: "August 10, 2025",
        duration: "3 hours",
        level: "Intermediate",
        description: "Learn a human-centered approach to turn your startup idea into a viable business by defining real-world problems, creating empathy maps, and validating your concept.",
        coverImage: "./assets/images/def.png",
        presentationPdf: "./assets/files/Define the problem.pdf",
        summaryPdf: "./assets/files/marketing-summary.pdf",
        recommendedVideos: [
          {
            title: "What is Design Thinking",
            url: "https://youtu.be/tmMNaZGPZT4?si=mLv8C-PqusSr5x6c",
            duration: "10:15",
            description: "Discover what Design Thinking is and how it helps solve problems creatively. In just a few steps, we’ll break down the process — from understanding users to generating ideas and testing solutions. Perfect for designers, entrepreneurs, and anyone looking to innovate."
          },
          {
            title: "What is Design Thinking",
            url: "https://www.youtube.com/embed/tRHds9dmPuc?si=_fB8nWGfAjXN992U",
            thumbnail: "https://img.youtube.com/vi/tRHds9dmPuc/maxresdefault.jpg",
            duration: "10:15",
            description: "Learn the basics of Design Thinking — a simple, creative approach to solving problems. We’ll guide you through its key stages and show how it can spark innovation in any field."
          },
          {
            title: "What is Design Thinking",
            url: "https://www.youtube.com/embed/videoseries?si=edtdaJDWybRoIJga&amp;list=PL0d7SmgddCPkEyEBXPcjOXT9HRuRYzHCI",
            duration: "10:15",
            description: "A step-by-step journey into Design Thinking. From the core principles to real-world examples, this playlist will help you master the process and apply it to spark innovation in any project."
          }
        ],
        task: "S00N.",
        resources: [
          { name: "Marketing Calendar Template", url: "https://ar.wikipedia.org/wiki/%D8%AA%D9%81%D9%83%D9%8A%D8%B1_%D8%AA%D8%B5%D9%85%D9%8A%D9%85%D9%8A", icon: "fas fa-calendar" },
          { name: "Analytics Dashboard", url: "https://www.interaction-design.org/literature/topics/design-thinking", icon: "fas fa-chart-line" },
          { name: "Analytics Dashboard", url: "https://spskills.com/articles/design-thinking/", icon: "fas fa-chart-line" },
          { name: "Analytics Dashboard", url: "https://www.adobe.com/sa_ar/creativecloud/design/discover/design-thinking.html", icon: "fas fa-chart-line" }
        ]
      }
    ];
  }

  // YouTube Channels Data
  getYouTubeChannelsData() {
    return [
      {
        id: 1,
        name: "خضر و بزنس",
        description: "Amazing business content that will help you grow your entrepreneurial skills and knowledge.",
        avatar: "./assets/images/khedr.jpg",
        url: "https://www.youtube.com/@khedrwb"
      },
      {
        id: 2,
        name: "Ehab Mesallum",
        description: "Learn digital marketing strategies and techniques from industry experts and professionals.",
        avatar: "./assets/images/ehab.jpg",
        url: "https://www.youtube.com/@ehabmes"
      },
   {
        id: 3,
        name: "Business Bel Arabi",
        description: "Business in Arabic aims to help people develop themselves and their businesses while avoiding common mistakes, based on well-known management and entrepreneurship models. We expanded our focus from just business to the whole life of every individual, launching a project with the slogan: You are the CEO of your life. Our goal is to develop all aspects of life—financial, business, and mindset.",
        avatar: "./assets/images/businessarabic.jpg",
        url: "https://www.youtube.com/@Businessbelarabi"
      },
 {
        id: 4,
        name: "المال الحلال - El Mal El Halal",
        description: "The Halal Money Podcast discusses a different angle of business, one where ethics and principles are the real winner. Join Mohamed Abu El-Naga Nagaty and his guests from various fields to get to know them personally, beyond the numbers, and learn how they succeeded through halal means.",
        avatar: "./assets/images/elmalelhalal.jpg",
        url: "https://www.youtube.com/@elmaal.elhalal"
      },
      
    ];
  }

  // Load Instructors
  loadInstructors() {
    const instructorsGrid = document.getElementById('instructors-grid');
    if (!instructorsGrid) return;

    const instructors = this.getInstructorsData();
    
    instructorsGrid.innerHTML = instructors.map((instructor, index) => `
      <div class="instructor-card" style="animation-delay: ${index * 0.1}s">
        <img src="${instructor.image}" alt="${instructor.name}" loading="lazy">
        <h3>${instructor.name}</h3>
        <p>${instructor.bio}</p>
        ${instructor.skills ? `
          <div class="skills">
            ${instructor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        ` : ''}
        <div class="social-links">
          <a href="${instructor.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="${instructor.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    `).join('');

    // Add stagger animation
    this.staggerAnimation('.instructor-card', 200);
  }

  // Load Sessions
  loadSessions() {
    const sessionsGrid = document.getElementById('sessions-grid');
    if (!sessionsGrid) return;

    const sessions = this.getSessionsData();
    
    sessionsGrid.innerHTML = sessions.map((session, index) => `
      <a href="session.html?id=${session.id}" class="session-card" style="animation-delay: ${index * 0.1}s">
        <img src="${session.coverImage}" alt="${session.title}" loading="lazy">
        <div class="session-card-content">
          <div class="session-meta">
            <span class="level-badge ${session.level.toLowerCase()}">${session.level}</span>
            <span class="duration">${session.duration}</span>
          </div>
          <h3>${session.title}</h3>
          <p class="instructor">${session.instructor}</p>
          <p class="date">${session.date}</p>
        </div>
      </a>
    `).join('');

    // Add stagger animation
    this.staggerAnimation('.session-card', 200);
  }

  // Load YouTube Channels
  loadYouTubeChannels() {
    const youtubeChannelsGrid = document.getElementById('youtube-channels-grid');
    if (!youtubeChannelsGrid) return;

    const channels = this.getYouTubeChannelsData();
    
    youtubeChannelsGrid.innerHTML = channels.map((channel, index) => `
      <a href="${channel.url}" target="_blank" rel="noopener" class="youtube-channel-card" style="animation-delay: ${index * 0.1}s">
        <div class="youtube-channel-icon">
          <i class="fab fa-youtube"></i>
        </div>
        <div class="youtube-channel-avatar">
          <img src="${channel.avatar}" alt="${channel.name}" loading="lazy">
        </div>
        <div class="youtube-channel-info">
          <h3 class="youtube-channel-name">${channel.name}</h3>
          <p class="youtube-channel-description">${channel.description}</p>
        </div>
      </a>
    `).join('');

    // Add stagger animation
    this.staggerAnimation('.youtube-channel-card', 200);
  }

  // Session Page
  loadSessionPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = parseInt(urlParams.get('id'));
    const sessions = this.getSessionsData();
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
      window.location.href = 'index.html';
      return;
    }

    // Update page content
    this.updateElement('session-title', session.title);
    this.updateElement('session-instructor', session.instructor);
    this.updateElement('session-date', session.date);
    this.updateElement('session-description', session.description);

    // Update PDFs
    this.updatePDF('presentation-iframe', session.presentationPdf);
    this.updatePDF('summary-iframe', session.summaryPdf);

    // Setup download button
    const downloadBtn = document.getElementById('download-summary');
    if (downloadBtn) {
      downloadBtn.onclick = () => window.open(session.summaryPdf, '_blank');
    }

    // Load videos
    this.loadVideos(session.recommendedVideos);
    
    // Load task
    this.loadTask(session.task);
    
    // Load resources
    this.loadResources(session.resources);

    // Update page title
    document.title = `${session.title} - NOVABusiness Bootcamp`;
  }

  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
  }

  updatePDF(id, src) {
    const iframe = document.getElementById(id);
    if (iframe) iframe.src = src;
  }

  loadVideos(videos) {
    const container = document.getElementById('videos-container');
    if (!container || !videos) return;

    container.innerHTML = videos.map(video => `
      <div class="video-item">
        <div class="video-thumbnail" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
          <img src="https://img.youtube.com/vi/${this.extractVideoId(video.url)}/maxresdefault.jpg" alt="${video.title}">
          <div class="play-overlay">
            <i class="fas fa-play"></i>
          </div>
        </div>
        <div class="video-embed" style="display: none;">
          <iframe src="${this.convertToEmbedUrl(video.url)}?rel=0" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        </div>
        <div class="video-info">
          <h4>${video.title}</h4>
          <p>${video.description}</p>
          <span class="duration">${video.duration}</span>
        </div>
      </div>
    `).join('');
  }

  loadTask(task) {
    const taskContent = document.getElementById('task-content');
    if (taskContent && task) {
      taskContent.innerHTML = `<p>${task}</p>`;
    }
  }

  loadResources(resources) {
    const resourcesList = document.querySelector('.resources-list');
    if (!resourcesList || !resources) return;

    resourcesList.innerHTML = resources.map(resource => `
      <a href="${resource.url}" class="resource-item" target="_blank" rel="noopener">
        <i class="${resource.icon}"></i>
        <span>${resource.name}</span>
      </a>
    `).join('');
  }

  // Utility Functions
  extractVideoId(url) {
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      return url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }
    return '';
  }

  convertToEmbedUrl(youtubeUrl) {
    const videoId = this.extractVideoId(youtubeUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : youtubeUrl;
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  staggerAnimation(selector, delay) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * (delay / 1000)}s`;
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleResize() {
    // Handle responsive changes
    this.adjustLayoutForScreenSize();
  }

  adjustLayoutForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    const navMenu = document.getElementById('nav-menu');
    
    if (!isMobile && navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      document.getElementById('hamburger').classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }
}

// CSS for Video Modal (inject into head)
const modalStyles = `
<style>
.video-modal {
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-modal.active {
  opacity: 1;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 800px;
  background: #000;
  border-radius: 15px;
  overflow: hidden;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.video-modal.active .modal-content {
  transform: scale(1);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-thumbnail {
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-thumbnail:hover img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(102, 126, 234, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
  background: rgba(102, 126, 234, 1);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-embed {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  border-radius: 10px;
  overflow: hidden;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0;
  justify-content: center;
}

.skill-tag {
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.session-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.level-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.level-badge.beginner {
  background: #10b981;
  color: white;
}

.level-badge.intermediate {
  background: #f59e0b;
  color: white;
}

.level-badge.advanced {
  background: #ef4444;
  color: white;
}

.duration {
  background: var(--bg-secondary-light);
  color: var(--text-secondary-light);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

body.dark-mode .duration {
  background: var(--bg-secondary-dark);
  color: var(--text-secondary-dark);
}

body.modal-open {
  overflow: hidden;
}

.keyboard-focused {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: var(--gradient-primary);
  z-index: 9999;
  transition: width 0.1s ease;
}

.offline-message {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: #ef4444;
  color: white;
  padding: 15px;
  text-align: center;
  z-index: 10000;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .video-thumbnail img {
    height: 150px;
  }
  
  .play-overlay {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>`;

// Inject styles into head
if (!document.querySelector('#nova-modal-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'nova-modal-styles';
  styleElement.innerHTML = modalStyles;
  document.head.appendChild(styleElement);
}

// Advanced Features Class
class NovaAdvancedFeatures {
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    this.setupKeyboardShortcuts();
    this.setupAccessibility();
    this.setupPerformanceOptimizations();
    this.setupAnalytics();
    this.setupProgressTracking();
  }

  // Keyboard Shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }

      // T for theme toggle
      if (e.key === 't' || e.key === 'T') {
        if (!this.isInputFocused()) {
          this.app.toggleTheme();
        }
      }

      // Home key to go to top
      if (e.key === 'Home') {
        e.preventDefault();
        this.app.smoothScrollTo(document.body);
      }

      // End key to go to bottom
      if (e.key === 'End') {
        e.preventDefault();
        const footer = document.querySelector('footer');
        if (footer) this.app.smoothScrollTo(footer);
      }
    });
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  openSearch() {
    // Future implementation for search functionality
    console.log('Search feature coming soon!');
  }

  // Accessibility Enhancements
  setupAccessibility() {
    // Add focus indicators for keyboard navigation
    this.addFocusIndicators();
    
    // Setup ARIA labels
    this.setupAriaLabels();
    
    // Add skip links
    this.addSkipLinks();
    
    // Setup reduced motion preferences
    this.setupReducedMotion();
  }

  addFocusIndicators() {
    const focusableElements = document.querySelectorAll(`
      a, button, input, textarea, select, 
      [tabindex]:not([tabindex="-1"]), 
      .instructor-card, .session-card, .youtube-channel-card
    `);

    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('keyboard-focused');
      });

      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focused');
      });
    });
  }

  setupAriaLabels() {
    // Add ARIA labels to interactive elements without text
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && !themeToggle.getAttribute('aria-label')) {
      themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
    }

    const hamburger = document.getElementById('hamburger');
    if (hamburger && !hamburger.getAttribute('aria-label')) {
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    }
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-medium', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    }
  }

  // Performance Optimizations
  setupPerformanceOptimizations() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
    this.optimizeScrollPerformance();
  }

  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
  }

  optimizeScrollPerformance() {
    let ticking = false;

    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-dependent operations here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }

  // Analytics (Privacy-friendly)
  setupAnalytics() {
    this.trackPageView();
    this.trackUserInteractions();
    this.trackPerformanceMetrics();
  }

  trackPageView() {
    // Simple page view tracking without external services
    const pageData = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Store locally for privacy (using in-memory storage for artifacts)
    this.storeAnalyticsData('pageview', pageData);
  }

  trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn-primary, .btn-secondary');
      if (button) {
        this.storeAnalyticsData('click', {
          element: button.className,
          text: button.textContent.trim(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.storeAnalyticsData('form_submit', {
        form: e.target.className,
        timestamp: new Date().toISOString()
      });
    });
  }

  trackPerformanceMetrics() {
    // Track loading performance
    window.addEventListener('load', () => {
      if (performance && performance.getEntriesByType) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          this.storeAnalyticsData('performance', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  }

  storeAnalyticsData(event, data) {
    // Store analytics data in memory (privacy-friendly for artifacts)
    if (!window.novaAnalyticsData) {
      window.novaAnalyticsData = [];
    }
    window.novaAnalyticsData.push({ event, data });
    
    // Keep only last 100 entries
    if (window.novaAnalyticsData.length > 100) {
      window.novaAnalyticsData.splice(0, window.novaAnalyticsData.length - 100);
    }
  }

  // Progress Tracking
  setupProgressTracking() {
    this.trackScrollProgress();
    this.trackReadingTime();
    this.trackSessionProgress();
  }

  trackScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  trackReadingTime() {
    const startTime = Date.now();
    let activeTime = 0;
    let isActive = true;

    // Track when user is active/inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
      } else {
        isActive = true;
      }
    });

    // Update reading time every second
    const readingInterval = setInterval(() => {
      if (isActive) {
        activeTime += 1000;
      }
    }, 1000);

    // Store reading time when user leaves
    window.addEventListener('beforeunload', () => {
      clearInterval(readingInterval);
      this.storeAnalyticsData('reading_time', {
        totalTime: Date.now() - startTime,
        activeTime: activeTime,
        page: window.location.pathname
      });
    });
  }

  trackSessionProgress() {
    // Track which sessions user has viewed
    if (this.app.isSessionPage()) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('id');
      
      if (sessionId) {
        // Use in-memory storage for artifacts
        if (!window.novaViewedSessions) {
          window.novaViewedSessions = [];
        }
        
        if (!window.novaViewedSessions.includes(sessionId)) {
          window.novaViewedSessions.push(sessionId);
        }

        // Track progress through session content
        this.trackSessionContentProgress(sessionId);
      }
    }
  }

  trackSessionContentProgress(sessionId) {
    const progressKey = `nova-session-${sessionId}-progress`;
    const sections = ['pdf', 'videos', 'task', 'resources'];
    
    if (!window.novaSessionProgress) {
      window.novaSessionProgress = {};
    }
    
    const progress = window.novaSessionProgress[progressKey] || {};

    sections.forEach(section => {
      const element = document.querySelector(`#${section}-section, .${section}-section`);
      if (element) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              progress[section] = true;
              window.novaSessionProgress[progressKey] = progress;
            }
          });
        }, { threshold: 0.5 });

        observer.observe(element);
      }
    });
  }
}

// Error Handling and Fallbacks
class NovaErrorHandler {
  constructor() {
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      this.logError('JavaScript Error', e.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      this.logError('Unhandled Promise Rejection', e.reason);
    });

    // Network error handler
    window.addEventListener('offline', () => {
      this.showOfflineMessage();
    });

    window.addEventListener('online', () => {
      this.hideOfflineMessage();
    });
  }

  logError(type, error) {
    const errorData = {
      type: type,
      message: error?.message || error,
      stack: error?.stack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Store error in memory for artifacts
    if (!window.novaErrors) {
      window.novaErrors = [];
    }
    window.novaErrors.push(errorData);
    
    // Keep only last 10 errors
    if (window.novaErrors.length > 10) {
      window.novaErrors.splice(0, window.novaErrors.length - 10);
    }
    
    console.error('Nova Error:', errorData);
  }

  showOfflineMessage() {
    const offlineMsg = document.createElement('div');
    offlineMsg.id = 'offline-message';
    offlineMsg.className = 'offline-message';
    offlineMsg.innerHTML = `
      <i class="fas fa-wifi"></i>
      <span>You're currently offline. Some features may not work.</span>
    `;

    document.body.appendChild(offlineMsg);
    setTimeout(() => {
      offlineMsg.style.transform = 'translateY(0)';
    }, 100);
  }

  hideOfflineMessage() {
    const offlineMsg = document.getElementById('offline-message');
    if (offlineMsg) {
      offlineMsg.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (document.body.contains(offlineMsg)) {
          document.body.removeChild(offlineMsg);
        }
      }, 300);
    }
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Check for modern browser features
  if (!window.IntersectionObserver || !window.requestAnimationFrame) {
    console.warn('Some features may not work in older browsers');
  }

  // Initialize main application
  const app = new NovaBootcamp();
  
  // Initialize advanced features
  const advancedFeatures = new NovaAdvancedFeatures(app);
  
  // Initialize error handling
  const errorHandler = new NovaErrorHandler();
  
  // Add global reference for debugging
  window.NovaApp = {
    app,
    advancedFeatures,
    errorHandler
  };

  console.log('🚀 NOVA Business Bootcamp loaded successfully!');
});












