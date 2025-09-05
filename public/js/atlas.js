var mymap = L.map('map').setView([-26.505, -61.17], 14.5);

        var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mymap);

        var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }); 

        var ArcGis_Dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri',
                maxZoom: 19
            });

        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });       

        var baselayers = {
            'OpenStreetMap': osm,
            'DarkMap' : CartoDB_DarkMatter,
            'EsriDarkMap' : ArcGis_Dark,
            'EsriSatelital' : Esri_WorldImagery,
        };


        function getColor_usos(valor) {
            return valor == 'Vivienda' ? '#CE1717' :
                valor == 'Comercio' ? '#87D3EA' :
                valor == 'Pileta' ? '#3785EA' :
                valor == 'En Construccion' ? '#FFD175' :
                valor == 'Edificio publico' ? '#6BD935' :
                valor == 'otros equipamientos' ? '#FFFFB3' :
                                                '#FFFFFF';
        }

        function setStyle(feature) {
            return {
                fillColor: getColor_usos(feature.properties.Tipo),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.7
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            if (Restitucionpampa_geojson.hasLayer(layer)) {
                layer.setStyle({
                    weight: 3,
                    color: 'black',
                    fillOpacity: 0.9
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }
        }

        function resetHighlight(e) {
            var layer = e.target;

            if (Restitucionpampa_geojson.hasLayer(layer)) {
                Restitucionpampa_geojson.resetStyle(layer);
            }
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });

            layer.bindPopup('<b>' + feature.properties.Tipo + '</b><br>' +
                (feature.properties.sup + ' m2'));
        }

        var ManzaneroPampa_geojson = L.geoJson(ManzaneroPampa, {
            style: function(feature) {
                return {
                    weight: 1,
                    opacity: 1,
                    color: 'grey',
                    fillOpacity: 0
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup((feature.properties.MZ ? 'Manzana N° ' + feature.properties.MZ : feature.properties.MZ));
            }
        }).addTo(mymap);

        var Restitucionpampa_geojson = L.geoJson(Restitucionpampa, {
            style: setStyle,
            onEachFeature: onEachFeature
        }).addTo(mymap);

        var referencias = L.control({ position: 'bottomleft' });

        referencias.onAdd = function () {
            this._div = L.DomUtil.create('div', 'referencias');
            this._div.innerHTML = '<div class="div-title"><h3>Referencias</h3></div>' +
                '<div class="legend"><h4>Tipo de uso:</h4>' +
                '<i style="background: #CE1717"></i>Vivienda<br>' +
                '<i style="background: #87D3EA"></i>Comercio<br>' +
                '<i style="background: #3785EA"></i>Pileta<br>' +
                '<i style="background: #FFD175"></i>En Construcción<br>' +
                '<i style="background: #6BD935"></i>Edificio público<br>' +
                '<i style="background: #FFFFB3"></i>Otros equipamientos<br>' +
                '<i style="background: none; border: 1px solid black;"></i>Manzanas Pampa del Infierno<br>' +
                '</div>';
            return this._div;
        };

        // BARRA DE ESCALA

        var scaleDisplay = L.control({ position: 'bottomleft' });

        scaleDisplay.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'scale-display');
            div.style.padding = '5px';
            div.style.fontSize = '14px';
            div.innerHTML = 'Escala 1:---'; 
            return div;
        };

        scaleDisplay.addTo(mymap);
        
        function updateScale() {
            var zoom = mymap.getZoom();  
            var scaleDenominator = calculateScale(zoom);  
            document.querySelector('.scale-display').innerHTML = 'Escala 1:' + scaleDenominator;
        }
        
        function calculateScale(zoom) {
            var metersPerPixel = 40075016.686 / (256 * Math.pow(2, zoom));  
            var dpi = 96;  
            var inchesPerMeter = 39.3701;
            var scaleDenominator = Math.round((metersPerPixel * dpi * inchesPerMeter));
            return scaleDenominator;
        }

        
        mymap.on('zoomend', updateScale);
        updateScale();  

        var overlays = {
            'Relevamiento por usos': Restitucionpampa_geojson,
            'Manzanas': ManzaneroPampa_geojson,

        };
        var controls_layers = L.control.layers(baselayers, overlays, { position: 'topright' }).addTo(mymap);
        referencias.addTo(mymap);

        mymap.fitBounds(Restitucionpampa_geojson.getBounds());
