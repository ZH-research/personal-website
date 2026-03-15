// ========================================
// 贺泽亚个人学术网站 - 共享JavaScript
// 多页面网站架构
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 移动端导航菜单
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 移动端下拉菜单处理
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    });

    // ========================================
    // 导航栏滚动效果
    // ========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    });

    // ========================================
    // 数字滚动动画
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const animateNumbers = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(stat);
        });
    };

    animateNumbers();

    // ========================================
    // 时间线筛选功能 (timeline.html)
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const yearMarkers = document.querySelectorAll('.timeline-year-marker');

    // 检查URL参数进行筛选
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam && filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filterParam) {
                btn.classList.add('active');
                filterTimeline(filterParam);
            }
        });
    }

    // 筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterTimeline(filter);
            
            // 更新URL（不刷新页面）
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.pushState({}, '', url);
        });
    });

    function filterTimeline(filter) {
        timelineItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'flex';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // 隐藏没有项目的年份标记
        yearMarkers.forEach(marker => {
            let hasVisibleItems = false;
            let nextElement = marker.nextElementSibling;
            
            while (nextElement && !nextElement.classList.contains('timeline-year-marker')) {
                if (nextElement.classList.contains('timeline-item') && 
                    nextElement.style.display !== 'none') {
                    hasVisibleItems = true;
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }
            
            if (filter === 'all' || hasVisibleItems) {
                marker.style.display = 'block';
            } else {
                marker.style.display = 'none';
            }
        });
    }

    // ========================================
    // 滚动显示动画
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealElements = document.querySelectorAll(
        '.research-card, .publication-card, .service-category, .info-card, ' +
        '.stat-box, .experience-card, .project-item, .method-card, ' +
        '.collab-card, .editorial-card, .quick-nav-card, .news-card, ' +
        '.article-card, .timeline-card'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
    });

    // ========================================
    // 平滑滚动到锚点
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 当前页面导航高亮
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ========================================
    // 键盘导航支持
    // ========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // ========================================
    // 页面加载完成后的初始化
    // ========================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    console.log('贺泽亚个人学术网站已加载完成');
});
