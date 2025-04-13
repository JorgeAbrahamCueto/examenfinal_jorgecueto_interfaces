document.addEventListener('DOMContentLoaded', () => {
    console.log('Menu script initialized');
    
    const navMenu = document.querySelector('.nav__menu');
    const navClose = document.querySelector('.nav__close');
    const navLinks = document.querySelector('.nav__link--menu');
    
    // Solo agregar eventos si los elementos existen
    if (navMenu && navLinks) {
        navMenu.addEventListener('click', () => {
            navLinks.classList.add('nav__link--show');
            console.log('Menú abierto');
        });
    }
    
    if (navClose && navLinks) {
        navClose.addEventListener('click', () => {
            navLinks.classList.remove('nav__link--show');
            console.log('Menú cerrado');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navItems = document.querySelectorAll('.nav__items');
    if (navItems.length > 0 && navLinks) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav__link--show');
            });
        });
    }
});