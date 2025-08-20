function showCustomAlert(message, targetElement) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    alertMessage.textContent = message;

    // Obtén la posición del elemento que se clickeó
    const rect = targetElement.getBoundingClientRect();

    // Ajusta la posición del custom alert en base a la posición del target
    alertBox.style.top = `${rect.top + window.scrollY}px`;
    alertBox.style.left = `${rect.left + rect.width + 10}px`; // 10px a la derecha del icono
    alertBox.style.right = 'auto'; // Resetea la posición a la derecha si es necesario

    alertBox.classList.remove('hidden');
    alertBox.classList.add('show');
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.classList.add('hidden');
    }, 1500);
}

document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        
        const urlText = this.closest('.conten_der--enlace').querySelector('.url-text').textContent;
        
        const tempInput = document.createElement('input');
        tempInput.value = urlText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        showCustomAlert('URL copiada', this);
    });
});