document.addEventListener('DOMContentLoaded', () => {
    // Detecta se a página atual está em /pages/ para montar caminhos relativos
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : '';
    const headerUrl = `${basePath}components/header.html`;
    const footerUrl = `${basePath}components/footer.html`;

    /**
     * Garante que atributos data-relative-* recebam o prefixo correto.
     * @param {Element} container
     */
    const applyRelativeAssetPaths = (container) => {
        if (!container) {
            return;
        }

        container.querySelectorAll('[data-relative-href]').forEach((node) => {
            const relativeHref = node.getAttribute('data-relative-href');

            if (relativeHref) {
                node.setAttribute('href', `${basePath}${relativeHref}`);
            }
        });

        container.querySelectorAll('[data-relative-src]').forEach((node) => {
            const relativeSrc = node.getAttribute('data-relative-src');

            if (relativeSrc) {
                node.setAttribute('src', `${basePath}${relativeSrc}`);
            }
        });
    };

    const initGalleryLightbox = () => {
        const lightbox = document.getElementById('galeria-lightbox');
        const galleryImages = document.querySelectorAll('.galeria-grid img');

        if (!lightbox || !galleryImages.length) {
            return;
        }

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        if (!lightboxImg || !lightboxCaption || !closeBtn || !backdrop) {
            return;
        }

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImg.removeAttribute('src');
            lightboxImg.removeAttribute('alt');
            lightboxCaption.textContent = '';
        };

        const openLightbox = (img) => {
            const figure = img.closest('.galeria-item');
            const figureCaption = figure?.querySelector('figcaption');
            const captionText = figureCaption?.textContent?.trim() || img.alt || '';

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Imagem ampliada da galeria';
            lightboxCaption.textContent = captionText;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        galleryImages.forEach((image) => {
            image.addEventListener('click', () => openLightbox(image));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    };

    /**
     * Carrega fragmentos HTML (header/footer) dinamicamente.
     * @param {string} selector - seletor do placeholder.
     * @param {string} url - caminho do componente.
     */
    const loadComponent = (selector, url) => {
        const target = document.querySelector(selector);

        if (!target) {
            return;
        }

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            })
            .then((html) => {
                target.innerHTML = html;
                applyRelativeAssetPaths(target);

                if (selector === '#header-placeholder') {
                    initMenuToggle();
                    initHeaderShrink();
                    initActiveMenu();
                }
            })
            .catch((error) => {
                console.error('Erro ao carregar componente:', url, error);
            });
    };

    /**
     * Responsável por abrir/fechar o menu mobile.
     */
    const initMenuToggle = () => {
        const toggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (toggle && navList) {
            toggle.addEventListener('click', () => {
                navList.classList.toggle('is-open');
            });
        }
    };

    let headerShrinkListenerAttached = false;

    /**
     * Ativa o comportamento de shrink do header conforme o scroll.
     */
    const initHeaderShrink = () => {
        const header = document.querySelector('.site-header');
        const shrinkThreshold = 80;

        if (!header) {
            return;
        }

        const toggleShrinkState = () => {
            if (window.scrollY > shrinkThreshold) {
                header.classList.add('header--shrink');
            } else {
                header.classList.remove('header--shrink');
            }
        };

        toggleShrinkState();

        if (!headerShrinkListenerAttached) {
            window.addEventListener('scroll', toggleShrinkState, { passive: true });
            headerShrinkListenerAttached = true;
        }
    };

    /**
     * Identifica o link do menu referente a pagina atual e aplica o estado ativo.
     */
    const initActiveMenu = () => {
        const navLinks = document.querySelectorAll('.site-header .nav-link');
        const currentPath = window.location.pathname.replace(/\\/g, '/');
        const normalizedPath = currentPath.endsWith('/') ? `${currentPath}index.html` : currentPath;
        const pathForComparison = normalizedPath.toLowerCase();

        if (!navLinks.length) {
            return;
        }

        navLinks.forEach((link) => {
            const linkPath =
                (link.getAttribute('data-relative-href') || link.getAttribute('href') || '').toLowerCase();

            if (linkPath && pathForComparison.endsWith(linkPath)) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    };

    // Dispara o carregamento dos componentes globais
    loadComponent('#header-placeholder', headerUrl);
    loadComponent('#footer-placeholder', footerUrl);

    if (document.querySelector('.galeria-page')) {
        initGalleryLightbox();
    }
});
