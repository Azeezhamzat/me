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
                window.open(url, '_blank'); // Open in new tab
                console.log(`Opened ${url}`);
            } else {
                console.warn('No URL specified for this visualization card');
            }
        });

        // Add Hover Effect for CI Visualization
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

    const certificates = [
        { title: "Futures Thinking (Specialization) (Institute for the Future, Apr 2024)", img: "images/Futures Thinking.jpg", category: ["foresight", "data"], skills: "Futures Thinking, Horizon Scanning, Strategy" },
        { title: "Network Dynamics of Social Behavior (University of Pennsylvania, Oct 2024)", img: "images/Network Dynamics.jpg", category: ["foresight", "systems", "data", "ci"], skills: "Social Network Analysis, Agent-based Modeling, Behavioral Analysis, Collective Intelligence" },
        { title: "Qualitative Research Methods (University of Amsterdam, Nov 2024)", img: "images/Qualitative Research Methods.jpg", category: ["research", "data"], skills: "Qualitative & Quantitative Research Methodologies" },
        { title: "Quantitative Research Methods (University of Amsterdam, Feb 2025)", img: "images/Quantitative Research Methods.jpg", category: ["research", "data"], skills: "Qualitative & Quantitative Research Methodologies" },
        { title: "Leading Sustainable Community Transformation (Coursera, Jul 2021)", img: "images/Leading Sustainable Community Transformation.jpg", category: ["leadership", "systems", "ci"], skills: "Sustainable Development, Futures Thinking, Resource Management, Systems Thinking, Collaborative Problem Solving, Interdisciplinary Collaboration, Community Engagement, Collective Intelligence" },
        { title: "Ecology: Ecosystem Dynamics and Conservation (American Museum of Natural History, Oct 2024)", img: "images/Ecology-Ecosystem-Conservation.jpg", category: ["ehs", "systems"], skills: "Conservation, Ecosystem Ecology" },
        { title: "Network Dynamics of Social Behavior (University of Pennsylvania, Oct 2024)", img: "images/Network Dynamics.jpg", category: ["foresight", "systems", "data", "ci"], skills: "Social Network Analysis, Agent-based Modeling, Behavioral Analysis, Collective Intelligence" },
        { title: "Systems Practice (Acumen Academy, Aug 2024)", img: "images/Systems_Practice-Acumen.jpg", category: ["systems"], skills: "" },
        { title: "Power BI Beginner to Pro Workshop (Pragmatic Works, Jun 2024)", img: "images/3.jpg", category: ["data"], skills: "" },
        { title: "Futures Thinking (Specialization) (Institute for the Future, Apr 2024)", img: "images/Futures Thinking.jpg", category: ["foresight"], skills: "Scenario Planning, Foresight, Futures Thinking, Problem Solving, Strategic Forecasting, Risk Assessment, Leadership, Critical Thinking" },
        { title: "The Complete Leadership Mastery", img: "images/leadershipmastery.jpg", category: ["leadership", "systems", "ci"], skills: "Futures Thinking, Interpersonal Skills, Strategy, Systems Thinking, Collaborative Problem Solving, Organizational Behavior and Change Management, Business Process Improvement, Collective Intelligence" },
        { title: "Advanced Psychology for Stress and Leadership", img: "images/Advanced Psychology for Stress and Leadership.jpg", category: ["leadership", "systems", "ci"], skills: "Psychology, Interpersonal Skills, Strategy, Systems Thinking, Organizational Behavior and Change Management" },
        { title: "Planning for Climate Change in African Cities (Coursera, Apr 2022)", img: "images/Planning for Climate Change.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking" },
        { title: "APIs and Web Scraping with Python Path (Dataquest.io, Dec 2021)", img: "images/10.jpg", category: ["data"], skills: "" },
        { title: "Data Analysis and Visualization with Python Path (Dataquest.io, Dec 2021)", img: "images/11.jpg", category: ["data"], skills: "" },
        { title: "Introduction to Data Analysis in R Course (Dataquest.io, Dec 2021)", img: "images/12.jpg", category: ["data"], skills: "" },
        { title: "Storytelling Data Visualization and Information Design Course (Dataquest.io, Dec 2021)", img: "images/13.jpg", category: ["data"], skills: "Futures Thinking" },
        { title: "AWS Machine Learning Scholarship (Udacity, Oct 2021)", img: "images/14.jpg", category: ["data"], skills: "" },
        { title: "Data Cleaning Project Walkthrough Course (Dataquest.io, Aug 2021)", img: "images/15.jpg", category: ["data"], skills: "" },
        { title: "Data Cleaning and Analysis Course (Dataquest.io, Aug 2021)", img: "images/16.jpg", category: ["data"], skills: "" },
        { title: "Data Cleaning in Python: Advanced Course (Dataquest.io, Aug 2021)", img: "images/17.jpg", category: ["data"], skills: "" },
        { title: "Data Cleaning with Python Path (Dataquest.io, Aug 2021)", img: "images/18.jpg", category: ["data"], skills: "" },
        { title: "Data Visualization Fundamentals Course (Dataquest.io, Aug 2021)", img: "images/19.jpg", category: ["data"], skills: "" },
        { title: "Pandas and NumPy Fundamentals Course (Dataquest.io, Aug 2021)", img: "images/20.jpg", category: ["data"], skills: "" },
        { title: "Python Basics for Data Analysis Path (Dataquest.io, Aug 2021)", img: "images/21.jpg", category: ["data"], skills: "" },
        { title: "Python for Data Science: Fundamentals Part I Course (Dataquest.io, Aug 2021)", img: "images/22.jpg", category: ["data"], skills: "" },
        { title: "Python for Data Science: Fundamentals Part II Course (Dataquest.io, Aug 2021)", img: "images/23.jpg", category: ["data"], skills: "" },
        { title: "Python for Data Science: Intermediate Course (Dataquest.io, Aug 2021)", img: "images/24.jpg", category: ["data"], skills: "" },
        { title: "Trauma Emergencies and Care (Coursera, Jan 2020)", img: "images/25.jpg", category: ["ehs"], skills: "EHS" },
        { title: "EMT Foundations (Coursera, Dec 2019)", img: "images/47.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Electric Power Systems (Coursera, Dec 2019)", img: "images/46.jpg", category: ["ehs"], skills: "" },
        { title: "Energy Production, Distribution & Safety Specialization (Coursera, Dec 2019)", img: "images/Energy Production, Distribution & Safety.jpg", category: ["ehs", "systems"], skills: "EHS, Systems Thinking" },
        { title: "Energy: The Enterprise (Coursera, Dec 2019)", img: "images/26.jpg", category: ["ehs"], skills: "" },
        { title: "Medical Emergencies: Airway, Breathing and Circulation (Coursera, Dec 2019)", img: "images/27.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Medical Emergencies: CPR, Toxicology and Wilderness (Coursera, Dec 2019)", img: "images/28.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Natural Gas (Coursera, Dec 2019)", img: "images/45.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Open Source Leader (Common Purpose, Nov 2019)", img: "images/29.jpg", category: ["systems", "ci"], skills: "Foresight, Systems Thinking, Collective Intelligence" },
        { title: "Safety in the Utility Industry (Coursera, Nov 2019)", img: "images/30.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Animal Behavior and Welfare (Coursera, Oct 2019)", img: "images/31.jpg", category: ["ehs"], skills: "" },
        { title: "Chicken Behavior and Welfare (Coursera, Oct 2019)", img: "images/32.jpg", category: ["ehs"], skills: "" },
        { title: "Organization Behavior: How to Manage People (Coursera, Oct 2019)", img: "images/33.jpg", category: ["leadership", "foresight", "systems", "ci"], skills: "Foresight, Futures Thinking, Diversity & Inclusion, Systems Thinking, Collective Intelligence" },
        { title: "Toxicology 21: Scientific Applications (Coursera, Oct 2019)", img: "images/34.jpg", category: ["ehs", "foresight", "systems"], skills: "EHS, Futures Thinking, Systems Thinking" },
        { title: "Food Safety and Risk Analysis (Coursera, Sep 2019)", img: "images/Food Safety＆Risk Analysis.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Advanced Manufacturing Process Analysis (Coursera, Aug 2019)", img: "images/36.jpg", category: ["foresight", "systems"], skills: "Futures Thinking, Systems Thinking" },
        { title: "Introduction to Faecal Sludge Management (Coursera, Aug 2019)", img: "images/faecal.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Introduction to Public Health Engineering in Humanitarian Contexts (Coursera, Aug 2019)", img: "images/publichealth.jpg", category: ["ehs", "foresight", "systems"], skills: "EHS, Futures Thinking, Systems Thinking" },
        { title: "Managerial Accounting: Cost Behaviors, Systems and Analysis (Coursera, Aug 2019)", img: "images/accounting.jpg", category: ["foresight"], skills: "Futures Thinking" },
        { title: "Air Pollution - a Global Threat to our Health (Coursera, Jul 2019)", img: "images/pollution.jpg", category: ["ehs"], skills: "EHS" },
        { title: "Chinese for Beginners (Coursera, Jul 2019)", img: "images/chinese.jpg", category: ["other"], skills: "" },
        { title: "The Sustainable Development Goals - a Global, transdisciplinary vision for the future (Coursera, Jul 2019)", img: "images/SDGs.jpg", category: ["foresight", "ehs", "systems", "ci"], skills: "Foresight, EHS, Futures Thinking, Diversity & Inclusion, Systems Thinking, Collective Intelligence" },
        { title: "Greening the Economy: Sustainable Cities (Coursera, May 2019)", img: "images/Greening the Economy.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking" },
        { title: "Sustainable Food Production Through Livestock Health Management (Coursera, May 2019)", img: "images/Sustainable food production through livestock health management.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking" },
        { title: "Global Environmental Management (Coursera, Mar 2019)", img: "images/Global Environmental Management.jpg", category: ["foresight", "ehs", "systems"], skills: "Foresight, EHS, Futures Thinking, Systems Thinking" },
        { title: "Process Improvement Advocate certification (Olam, Jun 2018)", img: "images/Process Improvement Advocate.jpg", category: ["foresight", "systems", "ci"], skills: "Foresight, Futures Thinking, Systems Thinking, Collective Intelligence" }
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
            return;
        }
        filtered.forEach(cert => carousel.appendChild(createCertificateItem(cert)));
        currentPage = 1;
        updateCarousel();
    }

    function updateCarousel() {
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        if (items.length === 0) {
            document.querySelector('.total-pages').textContent = 1;
            document.querySelector('.current-page').textContent = 1;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            carousel.style.transform = 'translateX(0)';
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
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterItems(button.getAttribute('data-filter'));
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateCarousel();
        }
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