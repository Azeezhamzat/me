document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Carousel, Filter, and Pagination for Certificates (Wrapped in DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    // Test and Ensure Hero CTA Functionality
    const heroCtas = document.querySelectorAll('#plant-thought, #download-cv');
    heroCtas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`Hero CTA clicked: ${cta.id}`);
            if (cta.id === 'download-cv') {
                alert('Downloading CV...');
            }
        });
        cta.addEventListener('mouseover', () => {
            console.log(`Hovering over ${cta.id}`);
        });
    });

    // Handle Visualization Card Clicks
    const visualizationCards = document.querySelectorAll('.visualization-card');
    visualizationCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const url = card.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
                console.log(`Opened ${url}`);
            } else {
                console.warn('No URL specified for this visualization card');
            }
        });

        card.addEventListener('mouseover', () => {
            if (!card.querySelector('.ci-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'ci-overlay';
                const animation = document.createElement('div');
                animation.className = 'ci-network-animation';
                overlay.appendChild(animation);
                card.appendChild(overlay);
            }
        });

        card.addEventListener('mouseout', () => {
            const overlay = card.querySelector('.ci-overlay');
            if (overlay) overlay.remove();
        });
    });

    // Carousel, Filter, and Pagination for Certificates
    const filterButtons = document.querySelectorAll('.filter-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carousel = document.querySelector('.carousel');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    let currentPage = 1;
    let currentFilter = 'all';
    let autoScrollInterval; // For automatic scrolling

    const certificates = [
        { title: "Advanced Manufacturing Process Analysis (Coursera, Aug 2019)", img: "images/Advanced Manufacturing Process Analysis.jpg", category: ["foresight", "systems"], skills: "Futures Thinking, Systems Thinking, Process Optimization, Manufacturing Analysis" },
        { title: "Advanced-Data-Cleaning-in-Python", img: "images/Advanced-Data-Cleaning-in-Python.jpg", category: ["Data", "research", "ci"], skills: "Data Analysis, Strategy, Systems Thinking, Data Cleaning, Python Programming" },
        { title: "Advanced Psychology for Stress and Leadership", img: "images/Advanced Psychology for Stress and Leadership.jpg", category: ["leadership", "systems", "ci"], skills: "Psychology, Interpersonal Skills, Strategy, Systems Thinking, Organizational Behavior and Change Management" },
        { title: "Air Pollution - a Global Threat to our Health (Coursera, Jul 2019)", img: "images/pollution.jpg", category: ["ehs"], skills: "EHS, Environmental Health, Air Quality Management" },
        { title: "Analyzing Survey Data in R", img: "images/Analyzing Survey Data in R.jpg", category: ["data"], skills: "Data Analysis, Statistical Analysis, R Programming, Survey Methodology" },
        { title: "Animal Behavior and Welfare (Coursera, Oct 2019)", img: "images/Animal Behaviour and Welfare.jpg", category: ["ehs"], skills: "Animal Welfare, Behavioral Science, Environmental Health" },
        { title: "APIs and Web Scraping with Python Path (Dataquest.io, Dec 2021)", img: "images/APIS.jpg", category: ["data"], skills: "API Integration, Web Scraping, Python Programming, Data Collection" },
        { title: "Becoming A Recruitment And Selection Specialist", img: "images/Becoming A Recruitment And Selection Specialist.jpg", category: ["leadership"], skills: "Recruitment Strategies, Candidate Selection, Talent Acquisition, Interview Techniques" },
        { title: "Chinese for Beginners (Coursera, Jul 2019)", img: "images/chinese.jpg", category: ["other"], skills: "Basic Chinese Language, Cultural Awareness, Communication Skills" },
        { title: "Climatology - Meteorology of Climate", img: "images/Climatology - Meteorology of Climate.jpg", category: ["other"], skills: "Climatology, Meteorology, Climate Analysis, Weather Forecasting" },
        { title: "Consulting Business Mastery 2022", img: "images/Consulting Business Mastery 2022.jpg", category: ["other"], skills: "Business Consulting, Strategic Planning, Client Management, Problem Solving" },
        { title: "Data Analyst with Python", img: "images/DATA_ANALYST.jpg", category: ["data"], skills: "Data Analysis, Python Programming, Data Visualization, Statistical Analysis" },
        { title: "Data Scientist with Python", img: "images/Data Scientist with Python certificate.jpg", category: ["data"], skills: "Data Science, Machine Learning, Python Programming, Statistical Modeling" },
        { title: "Diversity At Workplace", img: "images/Diversity At Workplace.jpg", category: ["leadership"], skills: "Diversity At Workplace, Inclusion Strategies, Cultural Competency" },
        { title: "Ecology: Ecosystem Dynamics and Conservation (American Museum of Natural History, Oct 2024)", img: "images/Ecology- Ecosystem Dynamics and Conservation.jpg", category: ["ehs", "systems"], skills: "Conservation, Ecosystem Ecology, Environmental Management" },
        { title: "Entrepreneurship", img: "images/Entrepreneurship.jpg", category: ["leadership", "systems"], skills: "Entrepreneurship, Business Development, Innovation, Strategic Planning" },
        { title: "EMT Foundations (Coursera, Dec 2019)", img: "images/EMT FOUNDATIONS.jpg", category: ["ehs"], skills: "EHS, Emergency Medical Techniques, Patient Care" },
        { title: "Energy Production, Distribution & Safety Specialization (Coursera, Dec 2019)", img: "images/Energy Production, Distribution & Safety.jpg", category: ["ehs", "systems"], skills: "EHS, Systems Thinking, Energy Management, Safety Protocols" },
        { title: "Food Safety and Risk Analysis (Coursera, Sep 2019)", img: "images/Food Safety＆Risk Analysis.jpg", category: ["ehs"], skills: "EHS, Food Safety, Risk Assessment" },
        { title: "Futures Thinking (Specialization) (Institute for the Future, Apr 2024)", img: "images/Futures Thinking.jpg", category: ["foresight"], skills: "Scenario Planning, Foresight, Futures Thinking, Problem Solving, Strategic Forecasting, Risk Assessment, Leadership, Critical Thinking" },
        { title: "Global Environmental Management (Coursera, Mar 2019)", img: "images/Global Environmental Management.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking, Environmental Policy" },
        { title: "Greening the Economy: Sustainable Cities (Coursera, May 2019)", img: "images/Greening the Economy_ Sustainable Cities.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking, Urban Sustainability" },
        { title: "Hiring Process- Talent Management", img: "images/Hiring Process- Talent Management.jpg", category: ["leadership", "other"], skills: "Talent Management, Recruitment Process, Employee Development" },
        { title: "How to Become a Facilitator- 7 Effective Skills", img: "images/How to Become a Facilitator- 7 Effective Skills.jpg", category: ["leadership", "other"], skills: "Facilitation Skills, Group Dynamics, Communication, Conflict Resolution" },
        { title: "Inclusion, Diversity, Equity, & Access Essentials", img: "images/Inclusion, Diversity, Equity, & Access Essentials.jpg", category: ["leadership", "other"], skills: "Inclusion Strategies, Diversity Management, Equity Planning, Accessibility" },
        { title: "Introduction to Faecal Sludge Management (Coursera, Aug 2019)", img: "images/faecal.jpg", category: ["ehs"], skills: "EHS, Waste Management, Sanitation Engineering" },
        { title: "Introduction to Public Health Engineering in Humanitarian Contexts (Coursera, Aug 2019)", img: "images/Introduction to Public Health Engineering in Humanitarian.jpg", category: ["ehs", "foresight", "systems"], skills: "EHS, Futures Thinking, Systems Thinking, Public Health Engineering" },
        { title: "Leading Sustainable Community Transformation (Coursera, Jul 2021)", img: "images/Leading Sustainable Community Transformation.jpg", category: ["leadership", "systems", "ci"], skills: "Sustainable Development, Futures Thinking, Resource Management, Systems Thinking, Collaborative Problem Solving, Interdisciplinary Collaboration, Community Engagement, Collective Intelligence" },
        { title: "Managerial Accounting: Cost Behaviors, Systems and Analysis (Coursera, Aug 2019)", img: "images/Managerial Accounting.jpg", category: ["foresight"], skills: "Futures Thinking, Cost Analysis, Financial Management, Systems Thinking" },
        { title: "Medical Emergencies: Airway, Breathing and Circulation (Coursera, Dec 2019)", img: "images/Medical Emergencies; Airway,Breathing, and Circulation.jpg", category: ["ehs"], skills: "EHS, Emergency Medicine, Respiratory Care" },
        { title: "Medical Emergencies: CPR, Toxicology and Wilderness (Coursera, Dec 2019)", img: "images/Medical Emergencies; CPR, Toxicology and Wilderness.jpg", category: ["ehs"], skills: "EHS, CPR, Toxicology, Wilderness Medicine" },
        { title: "Network Dynamics of Social Behavior (University of Pennsylvania, Oct 2024)", img: "images/Network Dynamics.jpg", category: ["foresight", "systems", "data", "ci"], skills: "Social Network Analysis, Agent-based Modeling, Behavioral Analysis, Collective Intelligence" },
        { title: "Neurohacking Tools And Techniques", img: "images/Neurohacking Tools And Techniques.jpg", category: ["foresight", "systems", "leadership", "ci"], skills: "Neurohacking Tools And Techniques, Cognitive Enhancement, Leadership Development" },
        { title: "NLP complete track", img: "images/NLP complete track certificate.jpg", category: ["data"], skills: "Natural Language Processing, Machine Learning, Data Analysis" },
        { title: "Organization Behavior: How to Manage People (Coursera, Oct 2019)", img: "images/Organizational Behavior_ How to Manage People.jpg", category: ["leadership", "foresight", "systems", "ci"], skills: "Foresight, Futures Thinking, Diversity & Inclusion, Systems Thinking, Collective Intelligence" },
        { title: "Planning for Climate Change in African Cities (Coursera, Apr 2022)", img: "images/Planning for climate change in Africa.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking, Urban Planning" },
        { title: "Process Improvement Advocate certification (Olam, Jun 2018)", img: "images/Process Improvement Advocate.jpg", category: ["foresight", "systems", "ci"], skills: "Foresight, Futures Thinking, Systems Thinking, Collective Intelligence" },
        { title: "Qualitative Research Methods (University of Amsterdam, Nov 2024)", img: "images/Qualitative Research Methods.jpg", category: ["research", "data"], skills: "Qualitative & Quantitative Research Methodologies" },
        { title: "Quantitative Research Methods (University of Amsterdam, Feb 2025)", img: "images/Quantitative Research Methods.jpg", category: ["research", "data"], skills: "Qualitative & Quantitative Research Methodologies" },
        { title: "Sustainable Food Production Through Livestock Health Management (Coursera, May 2019)", img: "images/Sustainable food production through livestock health management.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking, Livestock Management" },
        { title: "Systems Practice (Acumen Academy, Aug 2024)", img: "images/Systems_Practice-Acumen.jpg", category: ["systems"], skills: "Systems Thinking, Problem Solving, Systems Analysis" },
        { title: "The Complete Leadership Mastery", img: "images/leadershipmastery.jpg", category: ["leadership", "systems", "ci"], skills: "Futures Thinking, Interpersonal Skills, Strategy, Systems Thinking, Collaborative Problem Solving, Organizational Behavior and Change Management, Business Process Improvement, Collective Intelligence" },
        { title: "The Complete Personal Development Course - 22 Courses in 1", img: "images/The Complete Personal Development Course - 22 Courses in 1.jpg", category: ["leadership", "systems", "ci"], skills: "Personal Development, Leadership Skills, Self-Improvement, Strategic Thinking" },
        { title: "The Complete Recruiting Masterclass - HR Resources - Hiring", img: "images/The Complete Recruiting Masterclass - HR Resources - Hiring.jpg", category: ["leadership", "systems", "ci"], skills: "Recruitment Strategies, HR Management, Talent Acquisition, Systems Thinking" },
        { title: "The Sustainable Development Goals - a Global, transdisciplinary vision for the future (Coursera, Jul 2019)", img: "images/SDGs.jpg", category: ["foresight", "ehs", "systems", "ci"], skills: "Foresight, EHS, Futures Thinking, Diversity & Inclusion, Systems Thinking, Collective Intelligence" },
        { title: "Toxicology 21: Scientific Applications (Coursera, Oct 2019)", img: "images/Toxicology 21,scientific Applications .jpg", category: ["ehs", "foresight", "systems"], skills: "EHS, Futures Thinking, Systems Thinking, Toxicology Analysis" },
        { title: "Trauma Emergencies and Care (Coursera, Jan 2020)", img: "images/Trauma Emergencies and Care.jpg", category: ["ehs"], skills: "EHS, Trauma Care, Emergency Response" }
    ];

    function createCertificateItem(cert) {
        const item = document.createElement('div');
        item.className = `carousel-item ${cert.category.join(' ')}`;
        item.innerHTML = `
            <a href="${cert.img}" data-lightbox="certificates" data-title="${cert.title}" data-skills="${cert.skills || 'No skills listed'}">
                <img src="${cert.img}" loading="lazy" alt="${cert.title} certificate" class="carousel-image">
            </a>
            <p>${cert.title}</p>
            <small>Skills: ${cert.skills || 'No specific skills listed'}</small>
        `;
        const img = item.querySelector('.carousel-image');
        img.onerror = function() {
            this.style.display = 'none';
            this.parentElement.insertAdjacentHTML('afterend', '<p class="error-message">Image not found</p>');
        };
        return item;
    }

    function filterItems(category) {
        currentFilter = category;
        carousel.innerHTML = '';
        const filtered = certificates.filter(cert => category === 'all' || cert.category.includes(category));
        if (filtered.length === 0) {
            carousel.innerHTML = '<p class="error-message">No certificates found for this category.</p>';
            document.querySelector('.total-pages').textContent = 1;
            document.querySelector('.current-page').textContent = 1;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            clearInterval(autoScrollInterval); // Stop auto-scrolling if no items
            return;
        }
        filtered.forEach(cert => carousel.appendChild(createCertificateItem(cert)));
        currentPage = 1;
        updateCarousel();
        startAutoScroll(); // Restart auto-scrolling after filtering
    }

    function updateCarousel() {
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        if (items.length === 0) {
            document.querySelector('.total-pages').textContent = 1;
            document.querySelector('.current-page').textContent = 1;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            carousel.style.transform = 'translateX(0)';
            clearInterval(autoScrollInterval); // Stop auto-scrolling if no items
            return;
        }

        const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);

        // Circular page adjustment
        if (currentPage > totalPages) currentPage = 1;
        if (currentPage < 1) currentPage = totalPages;

        // Update pagination display
        document.querySelector('.total-pages').textContent = totalPages;
        document.querySelector('.current-page').textContent = currentPage;

        // Calculate container width and item width
        const containerWidth = carouselWrapper.offsetWidth - 32; // Subtract padding (2 * 16px)
        const gap = 40; // 2.5rem = 40px
        const totalGaps = itemsPerPage > 1 ? (itemsPerPage - 1) * gap : 0;
        const itemWidth = (containerWidth - totalGaps) / itemsPerPage;
        const translateX = -((currentPage - 1) * (itemWidth + gap) * itemsPerPage);

        carousel.style.transform = `translateX(${translateX}px)`;
        prevBtn.disabled = false; // Always enable for infinite loop
        nextBtn.disabled = false; // Always enable for infinite loop
    }

    // Function to start automatic scrolling
    function startAutoScroll() {
        clearInterval(autoScrollInterval); // Clear any existing interval
        autoScrollInterval = setInterval(() => {
            const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
            const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
            const totalPages = Math.ceil(items.length / itemsPerPage);

            currentPage++;
            if (currentPage > totalPages) currentPage = 1; // Loop back to first page
            updateCarousel();
        }, 3000); // Scroll every 3 seconds
    }

    // Pause auto-scroll on hover
    carouselWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    // Resume auto-scroll when mouse leaves
    carouselWrapper.addEventListener('mouseleave', () => {
        startAutoScroll();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterItems(button.getAttribute('data-filter'));
        });
    });

    prevBtn.addEventListener('click', () => {
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);

        currentPage--;
        if (currentPage < 1) currentPage = totalPages; // Loop to last page
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);

        currentPage++;
        if (currentPage > totalPages) currentPage = 1; // Loop to first page
        updateCarousel();
    });

    // Initial load
    filterItems('all');

    // Update carousel on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
});

// Blog page
document.addEventListener('DOMContentLoaded', function () {
    // Blog posts data
    const blogPosts = [
        {
            "image": "images/collective-intelligence-diagram.svg",
            "date": "March 1, 2025",
            "title": "Forget the Lone Genius: Why Intelligence Is Always Collective",
            "excerpt": "The smartest teams solve complex problems by harnessing collective intelligence, fostering diversity, creating safe spaces for ideas, balancing structure with freedom, and translating ideas into actionable outcomes—far surpassing the outdated myth of the lone genius.",
            "link": "forget_the_lone_genius.html",
            "tags": ["EvidenceBasedManagement","Research","Diversity", "Knowledge", "Innovation", "Collaboration"]
        },
        {
            "image": "images/bias-ecosystem.png",
            "date": "February 27, 2025",
            "author": "Azeez Hamzat",
            "title": "The Invisible Hand in the Room: When Great Ideas Go Unheard ",
            "excerpt": "Learn why Africa must prioritize energy research to address access gaps and climate challenges, with insights on the €30M EU-AU fund boosting sustainable solutions.",
            "link": "The_Invisible_Hand_in_the_Room.html",
            "tags": ["EvidenceBasedManagement","Research","Diversity", "Knowledge", "Innovation", "Collaboration"]
        },
    ];

    // Pagination variables
    const postsPerPage = 6;
    let currentPage = 1;
    let filteredPosts = blogPosts;

    // Sort blogPosts by date (newest to oldest)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Function to render blog posts
    function renderPosts(posts, page) {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = posts.slice(start, end);

        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '';
            postsToDisplay.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-post';
                article.innerHTML = `
                    <img src="${post.image}" alt="${post.title}" class="blog-image">
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${post.date}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.link}" class="read-more">Read More</a>
                `;
                blogGrid.appendChild(article);
            });
            updatePagination(posts);
        }
    }

    // Function to update pagination controls
    function updatePagination(posts) {
        const totalPages = Math.ceil(posts.length / postsPerPage);
        const paginationNumbers = document.getElementById('pagination-numbers');
        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `btn pagination-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => {
                    currentPage = i;
                    renderPosts(filteredPosts, currentPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
                paginationNumbers.appendChild(pageBtn);
            }

            const prevBtn = document.querySelector('.pagination-btn[onclick="changePage(\'prev\')]');
            const nextBtn = document.querySelector('.pagination-btn[onclick="changePage(\'next\')]');
            if (prevBtn) prevBtn.disabled = currentPage === 1;
            if (nextBtn) nextBtn.disabled = currentPage === totalPages;
        }
    }

    // Function to change page
    window.changePage = function(direction) {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        }
        renderPosts(filteredPosts, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to filter posts by search and tags
    window.filterPosts = function() {
        const searchQuery = document.getElementById('search-posts')?.value.toLowerCase() || '';
        const selectedTag = document.getElementById('filter-tags')?.value || '';

        filteredPosts = blogPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery) || post.excerpt.toLowerCase().includes(searchQuery);
            const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
            return matchesSearch && matchesTag;
        });

        currentPage = 1;
        renderPosts(filteredPosts, currentPage);
    };

    // Initialize blog page
    renderPosts(blogPosts, currentPage);
});

// Back to top functionality
document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});