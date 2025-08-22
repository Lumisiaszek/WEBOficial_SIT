// CARGANDO MAPA BASE CON COORDENADAS --------------------------------------------------------------------------------------------------------
var map = L.map('map', {
    zoomControl: false, 
    preferCanvas: true
    }).setView([-27.49, -58.97], 16);

    // Mapa base de OpenStreetMap    
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Mapa base CartoDB Gris
    var cartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 22,
    });

    // Mapa  Satelite
    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);


    // Mapa NegroArcGis
    var ArcGis_Dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 22,
    });

    var esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        attribution: 'Tiles &copy; Esri'
    });

    var Rubita2023 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2023/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: ''
    });

    var Rubita2024 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2024/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: ''
    });

    var Rubita2025 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2025/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: ''
    });



    // PANEL DE MAPAS BASES 

    let currentBaseLayer = esriSatellite;

    var baseMaps = {
        "OpenStreetMap": osm,
        "Satelital": esriSatellite,
        "CartoDB Gris": cartoDB_Positron,
        "ESRI Dark": ArcGis_Dark,
        "ESRI Topo": esriTopo,
    };

        var overlayMaps = {
        "Rubita 2023": Rubita2023,    
        "Rubita 2024": Rubita2024,
        "Rubita 2025": Rubita2025,
    };


    function toggleLayerPanel() {
    const panel = document.getElementById("layerPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    }

    // Base map selector
    document.getElementById("baseMapOptions").addEventListener("change", function(e) {
    if (e.target.name === "baseMap") {
        map.removeLayer(currentBaseLayer);
        const newLayer = baseMaps[e.target.value];
        map.addLayer(newLayer);
        currentBaseLayer = newLayer;
    }
    });

    document.getElementById("overlayOptions").addEventListener("change", function(e) {
        if (e.target && e.target.type === "checkbox") {
            const layerName = e.target.value;
            const layer = overlayMaps[layerName];

            if (layer) {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
            } else {
                console.warn('Capa no encontrada para:', layerName);
            }
        }
    });



    // Actualizar coordenadas en movimiento del mouse
    map.on("mousemove", function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById("textoCoordenadas").textContent = `Lat: ${lat}, Long: ${lng}`;
    });

    L.control.scale({
    position: 'bottomright', 
    imperial: false,         
    maxWidth: 150
    }).addTo(map);
