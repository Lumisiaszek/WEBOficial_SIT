function togglePanel(panel) {
  const paneles = ['busqueda', 'capas', 'referencias'];

  paneles.forEach(id => {
    const el = document.getElementById(`panel-${id}`);
    if (id === panel) {
      const yaActivo = el.classList.contains('active');
      // Cerrar todos
      paneles.forEach(p => {
        document.getElementById(`panel-${p}`).classList.remove('active');
      });
      if (!yaActivo) {
        el.classList.add('active');
      }
    } else {
      el.classList.remove('active');
    }
  });
}