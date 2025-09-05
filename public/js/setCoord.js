function toggleCoordMenu() {
    const coordMenu = document.getElementById('coordMenu');
    if (coordMenu.style.display === 'none') {
        coordMenu.style.display = 'block';
    } else {
        coordMenu.style.display = 'none';
    }
}

function setCoord() {
    const latInput = document.getElementById('latitud');
    const lonInput = document.getElementById('longitud');

    latInput.style.border = '';
    lonInput.style.border = '';

    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);

    let hasError = false;

    // Validación de latitud
    if (isNaN(lat) || lat < -90 || lat > 90) {
        latInput.style.border = '1px solid red';
        latInput.placeholder = 'Latitud inválida';
        hasError = true;
    }

    // Validación de longitud
    if (isNaN(lon) || lon < -180 || lon > 180) {
        lonInput.style.border = '1px solid red';
        lonInput.placeholder = 'Longitud inválida';
        hasError = true;
    }

    if (hasError) {
        return; 
    }

    map.setView([lat, lon], 15);


    if (window.currentMarker) {
        map.removeLayer(window.currentMarker);
    }
    window.currentMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`Coordenadas: ${lat}, ${lon}`).openPopup();

    document.getElementById('coordMenu').style.display = 'none';
}