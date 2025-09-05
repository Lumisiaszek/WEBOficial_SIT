// --- Ir a la ubicación actual del usuario ---
function goToMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por este navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Centrar el mapa
      map.setView([lat, lon], 16);

      // Agregar un marcador (opcional)
      L.marker([lat, lon]).addTo(map)
        .bindPopup("¡Estás acá!").openPopup();
    },
    function (error) {
      alert("No se pudo obtener la ubicación: " + error.message);
    }
  );
}