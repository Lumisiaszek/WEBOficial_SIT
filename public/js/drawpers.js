document.getElementById('drawButtons').style.display = 'none';

document.getElementById('toggleDrawMenu').addEventListener('click', function () {
  const drawButtons = document.getElementById('drawButtons');
  drawButtons.style.display = drawButtons.style.display === 'none' ? 'block' : 'none';
});

// Grupo donde se almacenan las geometrías
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Variable global para controlar el dibujo activo
let currentDrawer = null;
let currentDrawType = null;

function startDraw(type) {
  // Detener herramienta anterior si existe
  if (currentDrawer) {
    currentDrawer.disable();
    currentDrawer = null;
  }

  currentDrawType = type;

  const shapeOptions = {
    color: '#f573e3',
    weight: 2,
    fillColor: '#fb2cde',
    fillOpacity: 0.3
  };

  switch (type) {
    case 'marker':
      currentDrawer = new L.Draw.Marker(map);
      break;
    case 'polygon':
      currentDrawer = new L.Draw.Polygon(map, { shapeOptions });
      break;
    case 'polyline':
      currentDrawer = new L.Draw.Polyline(map, { shapeOptions });
      break;
    case 'rectangle':
      currentDrawer = new L.Draw.Rectangle(map, { shapeOptions });
      break;
    case 'circle':
      currentDrawer = new L.Draw.Circle(map, { shapeOptions });
      break;
  }

  if (currentDrawer) {
    currentDrawer.enable();
  }
}

// Evento cuando se crea una geometría
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);

  if (e.layerType === 'marker') {
    const { lat, lng } = layer.getLatLng();
    const textoCoord = `Lat: ${lat.toFixed(6)}, Long: ${lng.toFixed(6)}`;
    layer.bindPopup(textoCoord).openPopup();
  }

  layer.on('click', function () {
    drawnItems.removeLayer(layer);
  });

  // Reiniciar herramienta SOLO para marker, polygon y polyline
  if (['marker', 'polygon', 'polyline'].includes(currentDrawType)) {
    startDraw(currentDrawType); // ← esto es seguro ahora
  } else {
    currentDrawer = null; // círculos y rectángulos no se reinician
  }
});

let editHandler = null;

function startEdit() {
  if (editHandler) {
    editHandler.disable();
    editHandler = null;
  }

  editHandler = new L.EditToolbar.Edit(map, {
    featureGroup: drawnItems
  });

  editHandler.enable();
}

function startDelete() {
  drawnItems.clearLayers();
}
