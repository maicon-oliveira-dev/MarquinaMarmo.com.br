document.addEventListener('DOMContentLoaded', () => {
    // Detecta se a página atual está em /pages/ para montar caminhos relativos
    const isInsidePages = window.location.pathname.includes('/pages/');
    const basePath = isInsidePages ? '../' : './';
    const headerUrl = `${basePath}components/header.html`;
    const footerUrl = `${basePath}components/footer.html`;

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

                if (selector === '#header-placeholder') {
                    initMenuToggle();
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

    // Dispara o carregamento dos componentes globais
    loadComponent('#header-placeholder', headerUrl);
    loadComponent('#footer-placeholder', footerUrl);
});
