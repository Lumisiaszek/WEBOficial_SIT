window.onload = function() {
    // Añadir la clase 'open' a la primera tarjeta al cargar la página
    const primeraTarjeta = document.querySelector('.tarjeta_desp');
    if (primeraTarjeta) {
        primeraTarjeta.classList.add('open');
    }
};

// Función para alternar el contenido de las tarjetas
function toggleContent(id) {
    const tarjeta = document.getElementById(id);
    const contenido = tarjeta.querySelector('.tarjeta_desp--contenido');

    if (tarjeta.classList.contains('open')) {
        // Colapsar el contenido
        contenido.style.maxHeight = '0';
        tarjeta.classList.remove('open');
    } else {
        // Expandir el contenido
        contenido.style.maxHeight = contenido.scrollHeight + 'px';
        tarjeta.classList.add('open');
    }
}
