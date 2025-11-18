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

    // Dispara o carregamento dos componentes globais
    loadComponent('#header-placeholder', headerUrl);
    loadComponent('#footer-placeholder', footerUrl);
});
