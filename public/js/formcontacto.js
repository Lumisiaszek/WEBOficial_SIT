document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores de los campos del formulario
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var tel = document.getElementById('tel').value.trim();
    var perfil = document.getElementById('perfil').value.trim();
    var comentario = document.getElementById('comentario').value.trim();

    // Verificar si todos los campos obligatorios están llenos
    if (name && email && tel && perfil && comentario) {
        // Envío de datos al backend
        fetch('/enviar-correo', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, tel: tel, perfil: perfil, comentario: comentario })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showModal('.form__msj--enviado');
                document.getElementById('contactForm').reset();
            } else {
                showModal('.form__msj--error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('.form__msj--error');
        });
    } else {
        // Mostrar mensaje de error si falta algún campo obligatorio
        showModal('.form__msj--error');
    }
});

function showModal(selector) {
    var modal = document.querySelector(selector);
    modal.style.display = 'flex'; // Mostrar modal

    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none'; // Ocultar modal al hacer clic en "X"
    };

    // Ocultar modal si se hace clic fuera de la ventana modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}