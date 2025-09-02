(() => {

const UrlGeoserver = "https://sit.chaco.gob.ar/geoserver/";

// Función para obtener el link de la capa GeoServer
function ObtenerLinkJsonGeoserver (espacio, capa){ //parametros espacio de trabajo y nombre de capa 
      return UrlGeoserver+espacio+"/ows?service=wfs&version=1.0.0&request=GetFeature&typeName="+espacio+":"+capa+"&srsNAME=urn:ogc:def:crs:OGC:1.3:CRS84&outputFormat=json";
}


//OCULTAR O MOSTRAR PANEL

function togglePanel() {
  const panel = document.getElementById("contenedorpanel");
  const toggle = document.getElementById("togglePanel");

  panel.classList.toggle("oculto");
  toggle.classList.toggle("oculto"); 

  if (panel.classList.contains("oculto")) {
    toggle.innerHTML = "❯"; 
  } else {
    toggle.innerHTML = "❮"; 
  }
}

const capasGeoJSON = {};

// Espacios Verdes 
function cargarCapaEspVerdes() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "espVerdes_cdt");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["espVerdes_cdt"] = L.geoJson(data, {
                style: {
                    color: '#6a8f13ff',
                    weight: 0.5,
                    fillOpacity: document.querySelector(".valueespVerdes_cdt").value
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}


// Manzanas
function cargarCapaManzanas() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "manzanas_cdt");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["manzanas_cdt"] = L.geoJson(data, {
                style: {
                    color: '#2a2a2a',
                    fill: false,
                    weight: 1.5,
                    fillOpacity: document.querySelector(".valuemanzanas_cdt").value
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}

// Calles
function cargarCapaCalles() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "calles_cdt");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["calles_cdt"] = L.geoJson(data, {
                style: {
                    color: '#f87801ff',
                    fill: false,
                    weight: 1.5,
                    fillOpacity: document.querySelector(".valuecalles_cdt").value
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}

// Viviendas
function cargarCapaViviendas() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "viviendas_cdt");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["viviendas_cdt"] = L.geoJson(data, {
                style: {
                    color: '#d6d6d6ff',
                    weight: 1.5,
                    fillOpacity: document.querySelector(".valueviviendas_cdt").value
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}



// PANEL DE CAPAS - Registros BD 

var proyecto_bd = document.querySelector(".proyecto_bd").innerHTML;


function mostrarPanelCapas() {
  fetch("http://localhost/getcapas/P/"+proyecto_bd)
    .then(response => response.json())
    .then(registros => {


      let cadenaEscritorio = "";
      let cadenaMobile = "";

      registros.forEach(capa => {

        cadenaEscritorio += `
          <div class='item-capa'>
              <input type='checkbox' id='${capa.NoGeoserver}' ${capa.AcShape ? 'checked' : ''} onchange='activarCapa("${capa.NoGeoserver}")'>
              <label for='${capa.NoGeoserver}'>${capa.NoShape}</label><br>

              <div>
                <p class='TextOp'>Opacidad</p>
                <div class='OpBarr'>
                  <input type='range' min='0' max='1' step='0.1' value='${capa.OpShape/100}' class='slider-opacidad value${capa.NoGeoserver}' 
                    onchange='cambiarOpacidad("${capa.NoGeoserver}", this.value, this)'>
                  <span id='porcentaje_${capa.NoGeoserver}' class='porcentaje-opacidad'>${capa.OpShape}%</span>
                </div>
              </div>  
          </div>
        `;

        cadenaMobile += `
          <div class='item-capa'>
              <input type='checkbox' id='${capa.NoGeoserver}_m' ${capa.AcShape ? 'checked' : ''} onchange='activarCapaMobile("${capa.NoGeoserver}")'>
              <label for='${capa.NoGeoserver}_m'>${capa.NoShape}</label>
          </div>
        `;
      if (capa.AcShape){ //si ya viene activar de la BD - mostrarla
        activarCapa(capa.NoGeoserver)
      }
      });

      // Panel de escritorio
      const contenedorEscritorio = document.querySelector("#capasCheckboxContainer");
      if (contenedorEscritorio) contenedorEscritorio.innerHTML = cadenaEscritorio;
      // Panel movil
      const contenedorMobile = document.querySelector("#capasCheckboxContainerMobile");
      if (contenedorMobile) contenedorMobile.innerHTML = cadenaMobile;
      })
      


    .catch(error => console.error("Error al cargar panel de capas:", error));
}

mostrarPanelCapas();


function activarCapa(nombreCapa) {
  const checkboxDesktop = document.getElementById(nombreCapa);

  // Evaluamos si alguno está activado
  const isChecked = (
    (checkboxDesktop && checkboxDesktop.checked)
  );

  // Si no existe aún la capa, cargarla

  if (!capasGeoJSON[nombreCapa]) {
    switch (nombreCapa) {
      case "espVerdes_cdt": cargarCapaEspVerdes(); break;
      case "manzanas_cdt": cargarCapaManzanas(); break;
      case "calles_cdt": cargarCapaCalles(); break;
      case "viviendas_cdt": cargarCapaViviendas(); break;      
    }

    setTimeout(() => {
      if (capasGeoJSON[nombreCapa]) {
        if (isChecked) {
          capasGeoJSON[nombreCapa].addTo(map);
        }
        mostrarReferencias();
      }
    }, 500);
    return;
  }

  if (isChecked) {
    capasGeoJSON[nombreCapa].addTo(map);
  } else {
    map.removeLayer(capasGeoJSON[nombreCapa]);
  }

  mostrarReferencias();
}

//CELU

function activarCapaMobile(nombreCapa) {
  const checkboxMobile = document.getElementById(nombreCapa+'_m');

  // Evaluamos si alguno está activado
  const isChecked = (
    (checkboxMobile && checkboxMobile.checked)
  );

  // Si no existe aún la capa, cargarla

  if (!capasGeoJSON[nombreCapa]) {
    switch (nombreCapa) {
      case "espVerdes_cdt": cargarCapaEspVerdes(); break;
      case "manzanas_cdt": cargarCapaManzanas(); break;
      case "calles_cdt": cargarCapaCalles(); break;
      case "viviendas_cdt": cargarCapaViviendas(); break;  
    }

    setTimeout(() => {
      if (capasGeoJSON[nombreCapa]) {
        if (isChecked) {
          capasGeoJSON[nombreCapa].addTo(map);
        }
        mostrarReferencias();
      }
    }, 500);
    return;
  }

  if (isChecked) {
    capasGeoJSON[nombreCapa].addTo(map);
  } else {
    map.removeLayer(capasGeoJSON[nombreCapa]);
  }

  mostrarReferencias();
}


// REFERENCIAS DEL MAPA

function mostrarReferencias() {
  let html = '<ul class="leyenda-lista">';

  for (let nombreCapa in capasGeoJSON) {
    const layer = capasGeoJSON[nombreCapa];

    if (map.hasLayer(layer)) {
      const color = obtenerColorCapa(nombreCapa);
      const tipo = obtenerTipoForzado(nombreCapa);
      const nombreBonito = formatearNombreCapa(nombreCapa);

      html += `
        <li class="leyenda-item">
          <span class="simbolo tipo-${tipo}" style="background-color: ${color};"></span>
          ${nombreBonito}
        </li>
      `;
    }
  }

  html += '</ul>';
    // Escritorio
    const panelEscritorio = document.getElementById("tab-referencias");
    if (panelEscritorio) panelEscritorio.innerHTML = html;

    // Móvil
    const panelMobile = document.getElementById("panel-referencias");
    if (panelMobile) panelMobile.innerHTML = html;
}

function obtenerColorCapa(nombre) {
  const colores = {
    "espVerdes_cdt": "#9FCF7D",
    "manzanas_cdt": "#92978fff",
  };
  return colores[nombre] || "gray";
}

function obtenerTipoForzado(nombreCapa) {
  const tipos = {
    "espVerdes_cdt": "poligono",
    "manzanas_cdt": "poligono",
  };
  return tipos[nombreCapa] || "poligono";
}

function formatearNombreCapa(nombre) {
  return nombre.replace("_cdt", "").replace(/_/g, " ");
}

// CONTROL DE OPACIDAD CAPA EN PANEL DE CAPAS
function cambiarOpacidad(nombreCapa, valorOpacidad, input = null) {
  const capa = capasGeoJSON[nombreCapa];
  if (capa) {
    const opacidad = parseFloat(valorOpacidad);
    capa.setStyle({
      fillOpacity: opacidad,
      opacity: opacidad
    });
    const span = document.getElementById(`porcentaje_${nombreCapa}`);
    if (span) {
      span.textContent = `${Math.round(opacidad * 100)}%`;
    }
  }
}

})();