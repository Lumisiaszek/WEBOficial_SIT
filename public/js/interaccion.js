document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menuHamburguesa = document.getElementById("menu-hamburguesa");

    menuToggle.addEventListener("click", () => {
        menuHamburguesa.classList.toggle("activo");
    });
});