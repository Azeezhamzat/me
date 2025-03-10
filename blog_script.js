// Blog page
document.addEventListener('DOMContentLoaded', function () {
    // Blog posts data
    const blogPosts = [
        {
            "image": "images/collective_genius_network.webp",
            "date": "March 1, 2025",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "Forget the lone genius!",
            "excerpt": "Learn how UM6P leverages AI to transform healthcare in Africa, addressing challenges and improving access during Science Week.",
            "link": "Advancing-healthcare.html",
            "tags": ["Health", "AI", "Innovation", "Africa"]
        },
        {
            "image": "images/leaf.gif",
            "date": "February 27, 2025",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "Why Africa Must Do More on Energy Research",
            "excerpt": "Learn why Africa must prioritize energy research to address access gaps and climate challenges, with insights on the €30M EU-AU fund boosting sustainable solutions.",
            "link": "africa-energy-research.html",
            "tags": ["Energy", "Research", "Sustainability", "Climate Change"]
        },
        {
            "image": "images/networked-leaf.avif",
            "date": "February 28, 2025",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "NextAfrica: Bridging Europe and Africa Through Innovation at Station F",
            "excerpt": "Learn how UM6P’s NextAfrica program at Station F accelerates Greentech, Agritech, and Healthtech startups, connecting Europe and Africa for sustainable innovation.",
            "link": "next-africa.html",
            "tags": ["Innovation", "Entrepreneurship", "Environment", "Agriculture", "Health"]
        },
        {
            "image": "images/tree.png",
            "date": "December 15, 2024",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "Unleashing Africa’s Entrepreneurial Spirit: How UM6P is Shaping the Future Through Innovation",
            "excerpt": "Discover how UM6P is empowering Africa’s youth to tackle challenges through entrepreneurship and innovation.",
            "link": "Unleashing-Entrepreneurship.html",
            "tags": ["Entrepreneurship", "Innovation", "Startups"]
        },
        {
            "image": "images/diversity-um6p.jpg",
            "date": "January 7, 2025",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "Embracing Diversity: How UM6P is Building a Pan-African Community of Innovators",
            "excerpt": "Discover how UM6P fosters a diverse, multicultural student body to drive innovation and collaboration across Africa.",
            "link": "blog-post-diversity.html",
            "tags": ["Diversity", "Education", "Community"]
        },
        {
            "image": "images/For Africa.png",
            "date": "January 10, 2025",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "For Africa: UM6P’s Commitment to Industry, Research, and Business Innovation",
            "excerpt": "Discover how UM6P drives excellence through AAIT, AIRESS, ABS, and the Center for African Studies, fostering innovation and African perspectives.",
            "link": "For-Africa.html",
            "tags": ["Industry", "Research", "Business", "African Studies"]
        },
        {
            "image": "images/excellence-in-africa.jpg",
            "date": "January 23, 2024",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "Excellence in Africa: UM6P and EPFL’s Collaborative Push for Academic Innovation",
            "excerpt": "Explore how UM6P and EPFL are advancing academic excellence in Africa through the Excellence in Africa initiative.",
            "link": "excellence-in-africa.html",
            "tags": ["Education", "Research", "Innovation"]
        },
        {
            "image": "images/um6pv.png",
            "date": "February 16, 2025",
            "author": "Azeez Hamzat",
            "authorLink": "https://www.linkedin.com/in/azeezhamzat",
            "title": "UM6P Ventures: Investing in Africa’s Future Through Science and Innovation",
            "excerpt": "Explore how UM6P Ventures supports Digital Transformation and Deeptech startups, driving innovation in Agriculture, GreenTech, and Healthtech across Africa.",
            "link": "um6p-ventures.html",
            "tags": ["Innovation", "Startups", "Deeptech", "Digital Transformation"]
        }
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