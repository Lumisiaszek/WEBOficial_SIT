const UrlGeoserver = "https://sit.chaco.gob.ar/geoserver/";

// Función para obtener el link de la capa GeoServer
function ObtenerLinkJsonGeoserver (espacio, capa){ //parametros espacio de trabajo y nombre de capa 
      return UrlGeoserver+espacio+"/ows?service=wfs&version=1.0.0&request=GetFeature&typeName="+espacio+":"+capa+"&srsNAME=urn:ogc:def:crs:OGC:1.3:CRS84&outputFormat=json";
}

// Función para obtener el link de la capa GeoServer con filtro por...
function ObtenerLinkJsonGeoserverFiltro (espacio, capa, campo, valor){
    const filtro = `&CQL_FILTER=${campo} ILIKE '%25${valor}%25'`;
    return UrlGeoserver+espacio+"/ows?service=wfs&version=1.0.0&request=GetFeature&typeName="+espacio+":"+capa+"&srsNAME=urn:ogc:def:crs:OGC:1.3:CRS84&outputFormat=json"+filtro;
}

//OCULTAR O MOSTRAR PANEL

function togglePanel() {
  const panel = document.getElementById("contenedorpanel");
  const toggle = document.getElementById("togglePanel");

  panel.classList.toggle("oculto");
  toggle.classList.toggle("oculto"); // ← esto es lo que te faltaba

  if (panel.classList.contains("oculto")) {
    toggle.innerHTML = "❯"; 
  } else {
    toggle.innerHTML = "❮"; 
  }
}

const capasGeoJSON = {};

// SECTORES - RUBITA
function cargarCapasSectores() {
  const url = ObtenerLinkJsonGeoserver("AMGR", "sector_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["sector_rub"] = L.geoJson(data, {
                style: {
                    color: '#e6301d',
                    opacity: 1,
                    weight: 2.5,
                    fillOpacity: document.querySelector(".valuesector_rub").value
                },
                onEachFeature: function (feature, layer) {
          // Etiqueta con nu_sector
          if (feature.properties && feature.properties.nu_sector) {
            layer.bindTooltip(
              feature.properties.nu_sector.toString(),
              {
                permanent: true,     
                direction: "center", 
                className: "etiqueta-sectores" 
              }
            );
          }
        }
      }).addTo(map);
    })
    .catch(error => console.error("Error al cargar capa GeoServer:", error)); 
}


// ESPACIOS VERDES - RUBITA
function cargarCapaEspVerde() {
  const url = ObtenerLinkJsonGeoserver("AMGR", "espVer_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["espVer_rub"] = L.geoJson(data, {
                style: {
                    color: '#9FCF7D',
                    weight: 0.5,
                    fillOpacity: document.querySelector(".valueespVer_rub").value
                },
                onEachFeature: function (feature, layer) {
                  //PopUp
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([clave, valor]) => `<b>${clave}:</b> ${valor}`)
                            .join("<br>");
                    
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error("Error al cargar capa GeoServer:", error)); 
}

// CAPA PARCELARIO - RUBITA 

function cargarCapaParcelario() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "parcelario_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["parcelario_rub"] = L.geoJson(data, {
                style: {
                    color: 'white',
                    opacity: '1',
                    weight: 0.8,
                    fillColor: '#9E9E9E',
                    fillOpacity: document.querySelector(".valueparcelario_rub").value
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }

                    layer.options.originalStyle = {
                    color: 'white',
                    weight: 0.8,
                    fillColor: '#9E9E9E',
                    fillOpacity: document.querySelector(".valueparcelario_rub").value
                    }
                }
            }).addTo(map);

        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}

// MANZANAS - RUBITA 
function cargarCapaMz() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "mz_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["mz_rub"] = L.geoJson(data, {
                style: {
                    color: '#2a2a2a',
                    weight: 1.5,
                    fillOpacity: document.querySelector(".valuemz_rub").value
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

// CAPA CAVAS - RUBITA 
function cargarCapaCavas() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "cavas_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["cavas_rub"] = L.geoJson(data, {
                style: {
                    color: '#ACC4DB',
                    weight: 0.5,
                    fillOpacity: document.querySelector(".valuecavas_rub").value
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

// CAPA EJES DE CALLE - RUBITA 
function cargarCapaEjesCalle() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "ejeCalles_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["ejeCalles_rub"] = L.geoJson(data, {
                style: {
                    color: '#c76c25',
                    weight: 2.5,
                    fillOpacity: document.querySelector(".valueejeCalles_rub").value
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

// EQUIPAMIENTO - RUBITA 
function cargarCapaEquipam() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "equipam_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["equipam_rub"] = L.geoJson(data, {
                style: {
                    color: '#6c93d7',
                    weight: 2,
                    fillOpacity: document.querySelector(".valueequipam_rub").value
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



//TABS DEL PANEL IZQUIERDA (CAPAS Y REFERENCIAS)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabId = tab.getAttribute('data-tab');
    document.getElementById('tab-' + tabId).classList.add('active');

    if (tabId === "referencias") {
      mostrarReferencias(); 
    }
    
  });

});



// PANEL DE CAPAS - Registros BD 

function mostrarPanelCapas() {
  fetch("https://sit.chaco.gob.ar/getcapas/P")
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
      case "espVer_rub": cargarCapaEspVerde(); break;
      case "parcelario_rub": cargarCapaParcelario(); break;
      case "sector_rub": cargarCapasSectores(); break;
      case "mz_rub": cargarCapaMz(); break;
      case "equipam_rub": cargarCapaEquipam(); break;
      case "cavas_rub": cargarCapaCavas(); break;
      case "ejeCalles_rub": cargarCapaEjesCalle(); break;
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
      case "espVer_rub": cargarCapaEspVerde(); break;
      case "parcelario_rub": cargarCapaParcelario(); break;
      case "sector_rub": cargarCapasSectores(); break;
      case "mz_rub": cargarCapaMz(); break;
      case "equipam_rub": cargarCapaEquipam(); break;
      case "cavas_rub": cargarCapaCavas(); break;
      case "ejeCalles_rub": cargarCapaEjesCalle(); break;
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
    "espVer_rub": "#9FCF7D",
    "parcelario_rub": "#9E9E9E",
    "sector_rub": "red",
    "mz_rub": "#2a2a2a",
    "equipam_rub": "blue",
    "cavas_rub": "#ACC4DB",
    "ejeCalles_rub": "#c76c25"
  };
  return colores[nombre] || "gray";
}

function obtenerTipoForzado(nombreCapa) {
  const tipos = {
    "espVer_rub": "poligono",
    "parcelario_rub": "poligono",
    "sector_rub": "poligono",
    "mz_rub": "poligono",
    "equipam_rub": "poligono",
    "cavas_rub": "poligono",
    "ejeCalles_rub": "linea"
  };
  return tipos[nombreCapa] || "poligono";
}

function formatearNombreCapa(nombre) {
  return nombre.replace("_rub", "").replace(/_/g, " ");
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

// CONTROL DE FILTROS

document.addEventListener('DOMContentLoaded', () => {
  const inputPrincipal = document.getElementById('inputCategoria');
  const inputMobile = document.getElementById('inputCategoriaMobile');
  const botonLimpiar = document.getElementById('btnLimpiar');

  if (inputPrincipal && inputMobile) {
    inputPrincipal.addEventListener('input', (e) => {
      inputMobile.value = e.target.value;
      filtrarPorCategoria();
    });

    inputMobile.addEventListener('input', (e) => {
      inputPrincipal.value = e.target.value;
      filtrarPorCategoria();
    });
  }

  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', () => {
      if (inputPrincipal) inputPrincipal.value = '';
      if (inputMobile) inputMobile.value = '';
      botonLimpiar.style.display = 'none';
      filtrarPorCategoria();
    });
  }
});

//PANEL DE MOVIL
function toggleMobilePanel(nombre) {
  const paneles = document.querySelectorAll(".mobile-panel");

  paneles.forEach(p => {
    if (p.id === "panel-" + nombre) {
      p.classList.toggle("active");
    } else {
      p.classList.remove("active");
    }
  });
}

// FILTRO PARCELARIO

function abrirPanelFiltro() {
  const panel = document.getElementById("filtroDinamico");

  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";
    construirFormularioFiltro(); 
  } else {
    panel.style.display = "none";
  }
}

function construirFormularioFiltro() {
  const capa = capasGeoJSON["parcelario_rub"];
  if (!capa) return;

  const container = document.getElementById("filtroDinamico");
  container.innerHTML = ""; 

  const camposFiltrables = ["nu_sector", "nu_mz", "nu_par"];
  const div = document.createElement("div");
  div.className = "filtro-parcela";

  const titulo = document.createElement("h4");
  titulo.textContent = "Filtrar Parcelario Urbano";
  div.appendChild(titulo);

  camposFiltrables.forEach(campo => {
    const grupo = document.createElement("div");
    grupo.className = "filtro-grupo";

    const label = document.createElement("label");
    label.setAttribute("for", `filtro_${campo}`);
    label.textContent = `${campo}:`;

    const input = document.createElement("input");
    input.setAttribute("id", `filtro_${campo}`);
    input.setAttribute("placeholder", `Filtrar por ${campo}`);

    grupo.appendChild(label);
    grupo.appendChild(input);
    div.appendChild(grupo);
  });

  const botones = document.createElement("div");
  botones.className = "filtro-botones";

  const btnAplicar = document.createElement("button");
  btnAplicar.textContent = "Aplicar filtro";
  btnAplicar.onclick = () => aplicarFiltroCampos(camposFiltrables);

  const btnLimpiar = document.createElement("button");
  btnLimpiar.textContent = "Limpiar";
  btnLimpiar.onclick = limpiarFiltroCampos;

  botones.appendChild(btnAplicar);
  botones.appendChild(btnLimpiar);

  div.appendChild(botones);
  container.appendChild(div);
}

function aplicarFiltroCampos(campos) {
  const capa = capasGeoJSON["parcelario_rub"];
  if (!capa) return;

  const valores = {};
  campos.forEach(campo => {
    valores[campo] = document.getElementById(`filtro_${campo}`).value.trim().toLowerCase();
  });

  capa.eachLayer(layer => {
    const props = layer.feature?.properties;
    const coincide = campos.every(campo => {
      const val = valores[campo];
      return !val || (props?.[campo]?.toString().toLowerCase().includes(val));
    });

    if (coincide) {
      layer.setStyle({
        color: "#f26df9",
        weight: 1,
        fillOpacity: 0.6,
        opacity: 1
      });
      layer.bringToFront();
    } else {
      layer.setStyle({
        color: "#9E9E9E",
        weight: 0.7,
        fillOpacity: 0,
        opacity: 0
      });
    }
  });
}

function limpiarFiltroCampos() {
  const capa = capasGeoJSON["parcelario_rub"];
  if (!capa) return;

  // Limpiar inputs
  document.querySelectorAll("#filtroDinamico input").forEach(input => input.value = "");

  capa.eachLayer(layer => {
    if (layer.options.originalStyle) {
      layer.setStyle({
        ...layer.options.originalStyle,
        opacity: 1
      });
    }
  });
}

document.addEventListener("click", function (e) {
  const panel = document.getElementById("filtroDinamico");
  const boton = document.getElementById("btnAbrirFiltro");
  if (!panel || !boton) return;
  if (!panel.contains(e.target) && !boton.contains(e.target)) {
    panel.style.display = "none";
  }
});
