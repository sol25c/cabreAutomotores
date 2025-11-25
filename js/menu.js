document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    // Toggle menú al hacer clic en hamburguesa
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) menuToggle.classList.remove('active');
            if (mainNav) mainNav.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (mainNav && menuToggle) {
            const isClickInsideNav = mainNav.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        }
    });

    // Cerrar menú al cambiar el tamaño de la ventana a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (menuToggle) menuToggle.classList.remove('active');
            if (mainNav) mainNav.classList.remove('active');
        }
    });
});
