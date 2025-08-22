// Grupo donde se guardan las líneas de medición
const drawnItemsMedir = new L.FeatureGroup().addTo(map);

const drawMedir = new L.Draw.Polyline(map, {
  shapeOptions: {
    color: 'red',
    weight: 3
  },
  metric: true,
  feet: false,
  showLength: true
});

const drawArea = new L.Draw.Polygon(map, {
  shapeOptions: {
    color: 'blue',
    weight: 2,
    fillOpacity: 0.3
  }
});

function activarMedicion() {
  drawMedir.enable();
}

function activarMedicionArea() {
  drawArea.enable();
}

function startDelete() {
  drawnItemsMedir.clearLayers();
}

map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;

  if (e.layerType === 'polyline') {
    const latlngs = layer.getLatLngs();
    let distancia = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      distancia += latlngs[i].distanceTo(latlngs[i + 1]);
    }
    const distanciaTexto = (distancia / 1000).toFixed(2) + ' km';
    layer.bindTooltip(distanciaTexto, { permanent: true, className: 'medir-tooltip' }).openTooltip();
  }

  if (e.layerType === 'polygon') {
    const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]); // solo el primer anillo
    const areaTexto = (area / 10000).toFixed(2) + ' ha'; // hectáreas
    layer.bindTooltip(areaTexto, { permanent: true, className: 'medir-tooltip' }).openTooltip();
  }

  drawnItemsMedir.addLayer(layer);
});

function toggleHerramientaMedir() {
  const menu = document.getElementById("medirButtons");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

map.on('click', function () {
  if (map._activeDrawer) {
    map._activeDrawer.disable();
    map._activeDrawer = null;
  }

  if (editHandler) {
    editHandler.disable();
    editHandler = null;
  }
});