let ipservidor = "http://"+window.location.host; //document.querySelector(".ip").innerHTML;
let ipgeoserver = ipservidor.split(':')[0]+":"+ipservidor.split(':')[1];
let geoserverwms = ipgeoserver+":8080/geoserver/wms?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&FORMAT=image%2Fpng&LAYER=";
let pararemoto = "?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&FORMAT=image%2Fpng&LAYER=";
let idmuni = localStorage.getItem("idmuni");

//Arma los logo dependiendo el municipio activo
document.querySelector(".logo_imagen").src="./public/img/logos/"+idmuni+".jpg";
document.querySelector(".logo_imagen_grande").src="./public/img/logos/"+idmuni+".jpg";
document.querySelector(".nom_municipio").innerHTML=localStorage.getItem("municipio");

//Asignan imagen src para acceder remotamente
document.querySelector(".foto_imagen").src="./public/img/sinimagen.jpg"

if (localStorage.getItem("rol") == 4) {
  document.querySelector(".botones2").style.display="none"
  document.querySelector(".box_estado").style.display="none";
} 

if (localStorage.getItem("rol") == 5) {
     document.querySelector(".foto_frente").style.display="none"
}

if (localStorage.getItem("rol") == 6) {
  document.querySelector(".botones2").style.display="none"
  document.querySelector(".box_estado").style.display="none";
  document.querySelector(".documentos_escaneados").style.display="none";
  
}



//Año Actual
const fechaActual = new Date();
let AnioActual = fechaActual.getFullYear();

function BuscarParcela() {
    consultarPoligono(document.querySelector('.inp_buscar').value)
}

let estado_vista = true
function Boton_Estados() {
  if (estado_vista) {
    document.querySelector(".estados").style.display="block";
    Traer_Parcelas_Cobradas()
    document.querySelector(".cuotas").style.display="none";
  }else {
    document.querySelector(".estados").style.display="none";
  }
  estado_vista = !estado_vista;
}

let cuota_vista = true
function Boton_Cuotas() {
  if (cuota_vista) {
    document.querySelector(".estados").style.display="none";
    Traer_Parcelas_Pendientes();
    document.querySelector(".cuotas").style.display="block";
  }else {
    document.querySelector(".cuotas").style.display="none";
  }
  cuota_vista = !cuota_vista;
}

function Quitar_Estados() {
  geojsonLayer.eachLayer(function(layer) {
      layer.setStyle({ color: 'black', fillColor: 'transparent', weight: 0.5 });
  });
}

var map = L.map('map').setView([-27.887594, -59.2829], 15); 
L.tileLayer('', { attribution: 'xx', maxZoom: 26}).addTo(map);

async function Traer_UbicacionMunicio() {
  const response = await fetch(ipservidor+"/api/municipio_ubicacion/"+idmuni)
  const data = await response.json(); 
  map.setView([data[0].LatMuni, data[0].LogMuni], 15);
 // map.flyTo([data[0].LatMuni, data[0].LogMuni], 15);
}
Traer_UbicacionMunicio();


var ParcDiaII = null; var ParcVenII = [] 
var ParcDiaTS = [];var ParcVenTS = []
async function Traer_Parcelas_Cobradas() {
  let TotalCantTS = 0; let TotalCantII = 0;
  let TotalImpII =0.00;  let TotalImpTS = 0.00;
  const response = await fetch(ipservidor+"/parcelas_cobradas/"+localStorage.getItem("idmuni"));
  const data = await response.json(); 

  ParcDiaII = data.ParcDiaII; ParcVenII = data.ParcVenII;
  ParcDiaTS = data.ParcDiaTS; ParcVenTS = data.ParcVenTS;
  
  document.querySelector(".verde_ii").innerHTML=data.CantDiaII;
  document.querySelector(".verde_ii_imp").innerHTML="$ "+formatearNumero(data.TotalDiaII);
  document.querySelector(".amarillo_ii").innerHTML=data.CantVenII;
  document.querySelector(".amarillo_ii_imp").innerHTML="$ "+formatearNumero(data.TotalVenII);

  document.querySelector(".verde_ts").innerHTML=data.CantDiaTS;
  document.querySelector(".verde_ts_imp").innerHTML="$ "+formatearNumero(data.TotalDiaTS);
  document.querySelector(".amarillo_ts").innerHTML=data.CantVenTS;
  document.querySelector(".amarillo_ts_imp").innerHTML="$ "+formatearNumero(data.TotalVenTS);
  
  TotalCantII = data.CantVenII + data.CantDiaII; TotalImpII = data.TotalDiaII + data.TotalVenII;
  document.querySelector(".cant_ii_total").innerHTML = TotalCantII;
  document.querySelector(".imp_ii_total").innerHTML="$ "+formatearNumero(TotalImpII);

  TotalCantTS = data.CantVenTS + data.CantDiaTS; TotalImpTS = data.TotalDiaTS + data.TotalVenTS;
  document.querySelector(".cant_ts_total").innerHTML=TotalCantTS;
  document.querySelector(".imp_ts_total").innerHTML="$ "+formatearNumero(TotalImpTS);

}

function DibujarPacelasCobradas(vect) {
  let poligonoDeseado; let contar=0
  Quitar_Estados();
   geojsonLayer.eachLayer(function(layer) {
    let properties = layer.feature.properties;
    if (vect === 'ALDIAII') {
      if (ParcDiaII.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'green', fillOpacity: 1 });
      }
    }
    if (vect === 'VENCII') {
      if (ParcVenII.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'yellow', fillOpacity: 1 });
      }
    }
    if (vect === 'ALDIATS') {
      if (ParcDiaTS.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'green', fillOpacity: 1 });
      }
    }
    if (vect === 'VENCTS') {
      if (ParcVenTS.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'yellow', fillOpacity: 1 });
      }
    }
  });
}

var ParcVenIIC = []; var ParcNoVenIIC = [] 
var ParcVenTSC = []; var ParcNoVenTSC = []
async function Traer_Parcelas_Pendientes() {
  let TotalCantTS = 0; let TotalCantII = 0;
  let TotalImpII =0.00;  let TotalImpTS = 0.00;
  const response = await fetch(ipservidor+"/parcelas_pendientes/"+localStorage.getItem("idmuni"));
  const data = await response.json(); 

  ParcNoVenIIC = data.ParcNoVenIIC; ParcVenIIC = data.ParcVenIIC;
  ParcNoVenTSC = data.ParcNoVenTSC; ParcVenTSC = data.ParcVenTSC;
  
  document.querySelector(".azul_ii").innerHTML=data.CantNoVenIIC;
  document.querySelector(".azul_ii_imp").innerHTML="$ "+formatearNumero(data.TotalNoVenIIC);
  document.querySelector(".rojo_ii").innerHTML=data.CantVenIIC;
  document.querySelector(".rojo_ii_imp").innerHTML="$ "+formatearNumero(data.TotalVenIIC);

  document.querySelector(".azul_ts").innerHTML=data.CantNoVenTSC;
  document.querySelector(".azul_ts_imp").innerHTML="$ "+formatearNumero(data.TotalNoVenTSC);
  document.querySelector(".rojo_ts").innerHTML=data.CantVenTSC;
  document.querySelector(".rojo_ts_imp").innerHTML="$ "+formatearNumero(data.TotalVenTSC);
  
  TotalCantII = data.CantVenIIC + data.CantNoVenIIC; TotalImpII = data.TotalVenIIC + data.TotalVenIIC;
  document.querySelector(".cant_ii_total_2").innerHTML = TotalCantII;
  document.querySelector(".imp_ii_total_2").innerHTML="$ "+formatearNumero(TotalImpII);

  TotalCantTS = data.CantVenTSC + data.CantVenTSC; TotalImpTS = data.TotalNoVenTSC + data.TotalVenTSC;
  document.querySelector(".cant_ts_total_2").innerHTML=TotalCantTS;
  document.querySelector(".imp_ts_total_2").innerHTML="$ "+formatearNumero(TotalImpTS);

}

function DibujarParcelasPendientes(vect) {
  let poligonoDeseado; let contar=0
   geojsonLayer.eachLayer(function(layer) {
    let properties = layer.feature.properties;
    if (vect === 'NOVENCII') {
      if (ParcNoVenIIC.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'blue', fillOpacity: 1 });
      }
    }
    if (vect === 'VENCII') {
      if (ParcVenIIC.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'red', fillOpacity: 1 });
      }
    }
    if (vect === 'NOVENCTS') {
      if (ParcNoVenTSC.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'blue', fillOpacity: 1 });
      }
    }
    if (vect === 'VENCTS') {
      if (ParcVenTSC.includes(properties.ID_NOMENCL)) {
        contar++;
        poligonoDeseado = layer; 
        poligonoDeseado.setStyle({ fillColor: 'red', fillOpacity: 1 });
      }
    }
  });
}


function FechaInglesa() {
  const fechaActual = new Date();
  const año = fechaActual.getFullYear();
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); 
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

var tipo_c = "ii"
function Boton_II_C(accion = 0) {
  tipo_c='ii'
  document.querySelector(".btn_II_c").style.background="green"
  document.querySelector(".btn_TS_c").style.background="grey"
  if (accion === 1){
    Quitar_Estados();
  }
}

function Boton_TS_C(accion = 1) {
  tipo_c='ts'
  document.querySelector(".btn_II_c").style.background="grey"
  document.querySelector(".btn_TS_c").style.background="green"
  if (accion === 1){
    Quitar_Estados();
  }
}

function Mostrar_Estados() {
  var poligonoDeseado;
  geojsonLayer.eachLayer(function(layer) {
    var properties = layer.feature.properties;
    if (tipo === 'ii') {
      if (verde_ii.some(objeto => Object.values(objeto).some(valor => typeof valor === 'string' && valor.includes(properties.ID_NOMENCL)))) { 
        if (properties.ID_NOMENCL) {
          poligonoDeseado = layer; 
          poligonoDeseado.setStyle({ fillColor: 'green', fillOpacity: 1 });
        }
       
      }

      if (amarillo_ii.some(objeto => Object.values(objeto).some(valor => typeof valor === 'string' && valor.includes(properties.ID_NOMENCL)  ))) { 
        if (properties.ID_NOMENCL) {
          poligonoDeseado = layer; 
          poligonoDeseado.setStyle({ fillColor: 'tomato', fillOpacity: 1 });
        };

     
      }
    }else {
          if (verde_ts.some(objeto => Object.values(objeto).some(valor => typeof valor === 'string' && valor.includes(properties.ID_NOMENCL)))) { 
            poligonoDeseado = layer; 
            poligonoDeseado.setStyle({ fillColor: 'green', fillOpacity: 1 });
          }
         
    }

  });
}

let info_vista = true
function Boton_Info() {
  if ( info_vista) {
    document.querySelector(".box_info").style.bottom="0px";
  }else {
    document.querySelector(".box_info").style.bottom="-138px";
  }
  info_vista = !info_vista;
}

let resti_vista = true
function Boton_Resti() {
  if ( resti_vista) {
    document.querySelector(".box_resti").style.bottom="0px";
  }else {
    document.querySelector(".box_resti").style.bottom="-186px";
  }
  resti_vista = !resti_vista;
}

let estado_vistax = true
function Boton_Estado() {
  if ( estado_vistax) {
    document.querySelector(".box_estado").style.bottom="0px";
  }else {
    document.querySelector(".box_estado").style.bottom="-286px";
  }
  estado_vistax = !estado_vistax;
}

let leyenda_vista = true
function Boton_Leyenda() {
    if ( leyenda_vista)  {
        document.querySelector(".leyendas").style.display="None";
        document.querySelector(".btn_ley").src='./public/img/leyenda.png'
      }else {
        document.querySelector(".leyendas").style.display="block";
        document.querySelector(".btn_ley").src='./public/img/leyenda_2.png'
      }
      leyenda_vista = !leyenda_vista;
}

let foto_vista = true
function Boton_foto() {
    if (foto_vista) {
      document.querySelector(".foto_frente").style.top="-215px";
    }else {
      document.querySelector(".foto_frente").style.top="-28px";
    }
    foto_vista = !foto_vista;
}


let buscar_vista = true
function Boton_Buscar() {
  if ( buscar_vista ) {
    document.querySelector(".box_busqueda").style.display="none";
  }else {
    document.querySelector(".box_busqueda").style.display="block";
    }
    buscar_vista = !buscar_vista; 
}

function Escribiendo () {
  valor = document.querySelector(".inp_buscar").value;
  valorActual = valor.replace(/[^0-9a-zA-Z]/g, '');
  document.querySelector(".inp_buscar").value=valorActual;
  if (valorActual.length == 28) {
      document.querySelector(".btn_buscar").disabled = false;
  }else {  document.querySelector(".btn_buscar").disabled = true;};
}


async function TraerCapas() {
  var overlayLayers = {};
  const response = await fetch(ipservidor+ "/obtener_capas/"+idmuni);
  const layerInfo = await response.json();
  document.querySelector(".leyenda_cont").innerHTML="";
  let leyenda ="";
  if (layerInfo) {
    layerInfo.forEach(layer => {
        if (layer.Activo == "Si"){ // Solo se mostraran los activos
          if (layer.Tipo == "Local"){
            if (layer.Titulo !="Pirámide"){
              leyenda +="<div><strong>"+layer.Titulo+"</strong></div>";
              leyenda +="<img class='ley_imagen' src='"+geoserverwms+layer.Nombre+"' alt =''>";
            }
            var wmsLayer = L.tileLayer.wms(ipgeoserver + ':8080/geoserver/wms', {
              layers: layer.Nombre,
              format: 'image/png',
              transparent: true,
              opacity: 1,
              maxZoom: 22
            });
          overlayLayers[layer.Titulo] = wmsLayer;
          }else { 
              if (layer.Titulo !="Pirámide"){
                leyenda +="<div><strong>"+layer.Titulo+"</strong></div>";
                leyenda +="<img class='ley_imagen' src='"+layer.UrlRemoto+"/"+pararemoto+layer.Nombre+"' alt =''>"
              }// Si es remoto
              var wmsLayer = L.tileLayer.wms(layer.UrlRemoto, {
              layers: layer.Nombre,
              format: 'image/png',
              transparent: true, 
              opacity: 1,
              maxZoom: 22
              });
              
            overlayLayers[layer.Titulo+" (R)"] = wmsLayer;
          
          }
            
        }
    });
  }

  var sinbase = L.tileLayer('', {maxZoom: 18,  attribution: 'xx'});
  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,  attribution: 'xx'});
  var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'xx'});
  var baseMaps = { "Sin Base": sinbase, "OpenStreetMap": osm, "OpenStreetMap.HOT": osmHOT };

  L.control.layers(baseMaps, overlayLayers).addTo(map); 
  document.querySelector(".leyenda_cont").innerHTML=leyenda;
}

// Agrega el control de capas al mapa
TraerCapas();

var titulo = "cualquier titulo"
let selectedPolygon ="";
var geojsonLayer = null; 
var g_idpar="";
var SumaTotal=0.00;

async function CompletarCampos (campo){
  
  plca_url=""; plme_url=""; otdo_url=""; blcv_url=""; fdni_url=""; fdom_url=""; frel_url=""; escr_url="";

   //Inicializa todos los botones al color Rojo
   document.querySelector(".plca").style.background="red"; document.querySelector(".plme").style.background="red";
   document.querySelector(".otdo").style.background="red"; document.querySelector(".fdni").style.background="red";
   document.querySelector(".fdom").style.background="red"; document.querySelector(".blcv").style.background="red";
   document.querySelector(".escr").style.background="red"; document.querySelector(".frel").style.background="blue";

   document.querySelector(".foto_imagen").src = ipservidor+"./public/img/sinimagen.jpg";

   document.querySelector(".info_contribuyente").innerHTML="NO SE REGISTRAN DATOS";
   document.querySelector(".info_sup_terreno").innerHTML="";
   document.querySelector(".info_val_terreno").innerHTML="";
   document.querySelector(".info_anio").innerHTML="";
      
    document.querySelector(".info_parcela span").innerHTML=guionenparcela(campo.ID_NOMENCL);
    /*
    const response_uf = await fetch(ipservidor+"/traer_uf/"+campo.ID_NOMENCL);
    const data_uf = await response_uf.json(); 

    //Inicializa el select para poner a cargar
    const selectElement = document.querySelector('.info_uf');
    while (selectElement.options.length > 0) {
      selectElement.remove(0);
    }

    data_uf.forEach((option) => { 
      const optionElement = document.createElement('option');
      optionElement.value = option.UF;
      optionElement.text = option.UF;
      selectElement.appendChild(optionElement);
   });
  */
    g_idpar=campo.ID_NOMENCL;
    traer_datos_inmueble(document.querySelector('.info_uf').value);
    //traer_datos_inmueble(document.querySelector('.info_uf').value);

    //Traer_estado_parcela_uf(g_idpar, document.querySelector('.info_uf').value)
}

function Cambio_uf() {
    traer_datos_inmueble(document.querySelector('.info_uf').value);
    Traer_estado_parcela_uf(document.querySelector('.idpar_deuda').innerHTML, document.querySelector('.info_uf').value)
  
}

async function traer_datos_inmueble(uf) {
    const response = await fetch(ipservidor+ "/info_parcela/" + g_idpar+"/"+localStorage.getItem('idmuni'));
    const data = await response.json();
    if (data) {
        document.querySelector(".info_contribuyente").innerHTML=data[0].NomContr.substring(0, 44);
        document.querySelector(".info_sup_terreno").innerHTML=formatearNumero(data[0].SupTerreno)+ " m2";
        document.querySelector(".info_val_terreno").innerHTML="$ "+formatearNumero(data[0].ValInm);
        document.querySelector(".info_anio").innerHTML=data[0].AnnioVali;
        document.querySelector(".info_sup_edificio").innerHTML=formatearNumero(data[0].SupEdif)+ " m2";
        document.querySelector(".info_val_edificio").innerHTML="$ "+formatearNumero(data[0].ValEdi);
    }       
}

var id_temp;
var uf_temp;


//Cuando se hace click en el boton verde llama a la Funcion VerDocuemtos 
document.querySelector(".plca").addEventListener("click", function() { VerDocumentoPdf("plca", g_idpar )});
document.querySelector(".plme").addEventListener("click", function() { VerDocumentoPdf("plme", g_idpar)});
document.querySelector(".otdo").addEventListener("click", function() { VerDocumentoPdf("otdo", g_idpar)});
document.querySelector(".blcv").addEventListener("click", function() { VerDocumentoPdf("blcv", g_idpar)});
document.querySelector(".fdni").addEventListener("click", function() { VerDocumentoPdf("fdni", g_idpar)});
document.querySelector(".fdom").addEventListener("click", function() { VerDocumentoPdf("fdom", g_idpar)});
document.querySelector(".escr").addEventListener("click", function() { VerDocumentoPdf("escr", g_idpar)});
document.querySelector(".frel").addEventListener("click", function() { VerDocumentoPdf("frel", g_idpar, "000")});

//Muestra el PDF en otra perstaña
async function VerDocumentoPdf(tipo, idpar, uf){ 
   
  if (tipo == "frel" ) { 
    let parce = document.querySelector(".info_parcela span").innerHTML
    fetch('./crear_ficha/', {
      method: 'POST',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        IdMuni:  localStorage.getItem("idmuni"),
        NomMuni: localStorage.getItem("municipio"),
        IdParc: parce.replace(/-/g, ""),
        Uf: uf,
        Propietario: document.querySelector(".info_contribuyente").innerHTML,
        DNI:        "-",
        Domicilio:  "-",
        SupParc : parseFloat(document.querySelector(".info_sup_terreno").innerHTML),
        SupDec :  parseFloat(document.querySelector(".info_sup_edificio").innerHTML),
        SupDet : parseFloat(SumaTotal)  
      })
  }).then(res => res.json())
  .then(res => {
       window.open(res.Url)
  }); 


  

  }
  if (document.querySelector("."+tipo).style.backgroundColor === 'green') {
     window.open("./public/Municipios/"+localStorage.getItem("idmuni")+"/BDDig/DocEle/"+idpar+"/"+idpar+"_"+tipo+".pdf")
  }else {
    //alert("no posee esta doc");
  }
}

async function TraerUnaRestitucion(id) {
  const response3 = await fetch(ObtenerLinkJsonGeoserverFiltro("Municipios", localStorage.getItem("idmuni")+"_restitucion", id)); 
  const data3 = await response3.json();
  SumaTotal = 0.00;
  let html=""
  let cont=document.querySelector(".box_resti_cont");

  for (let c=0; c < data3.features.length; c++ ){
    let tipo="";
    tipo = TraerTipoContruccion(data3.features[c].properties.Codigo);
    
    html+="<div><strong>"+tipo+":</strong><span class='sp_sup'>"+data3.features[c].properties.Sup_m2.toFixed(2)+" m2</span><div>"
      SumaTotal += data3.features[c].properties.Sup_m2;
  }
  html+="<hr/>";
  html+="<div><strong>Total Construido:</strong><span class='sp_sup'>"+SumaTotal.toFixed(2)+" m2</span><div>"
  cont.innerHTML = html;
}

async function Documentacion(id, uf) {
  id_temp = id;
  uf_temp= uf;
  let directorio=ipservidor+"public/Municipios/"+localStorage.getItem("idmuni")+"/BDDig/DocEle/"

  const response = await fetch(ipservidor+"/enviar_documentos/"+id+"/"+uf+"/"+localStorage.getItem("idmuni"));
  const data = await response.json();
   
  if (data.Plca == "S" ) {
      document.querySelector(".plca").style.background="green";
      plca_url = directorio+id+"/"+id+"_PLCA.pdf";
    }else {
      plca_url = "";
      document.querySelector(".plca").style.background="red";
  }
  
  if (data.Plme == "S" ) {
      document.querySelector(".plme").style.background="green";
      plme_url=directorio+id+"/"+id+"_PLME.pdf";
    }else {
      plme_url="";
      document.querySelector(".plme").style.background="red";
  }

  if (data.Otdo == "S" ) {
      document.querySelector(".otdo").style.background="green";
      otdo_url = directorio+id+"/"+id+"_OTDO.pdf";
    }else {
      otdo_url="" 
      document.querySelector(".otdo").style.background="red";
  }

  if (data.Blcv == "S" ) {
    document.querySelector(".blcv").style.background="green";
    if (uf == "000") {
      blcv_url=directorio+id+"/"+id+"_BLCV.pdf";
    }else {  
      blcv_url=directorio+id+"/"+id+uf+"/"+id+uf+"_BLCV.pdf";}
    }else{
      blcv_url="";document.querySelector(".blcv").style.background="red";
  }

  if (data.Fdni == "S" ) {
    document.querySelector(".fdni").style.background="green";
    if (uf == "000") {
      fdni_url=directorio+id+"/"+id+"_FDNI.pdf";
    }else{
      fdni_url=directorio+id+"/"+id+uf+"/"+id+uf+"_FDNI.pdf";
    }
    }else{
      fdni_url=""; document.querySelector(".fdni").style.background="red";
  }

  if (data.Fdom == "S" ) {
    document.querySelector(".fdom").style.background="green";
    if (uf == "000") {
      fdom_url=directorio+id+"/"+id+"_FDOM.pdf";
    }else {
      fdom_url=directorio+id+"/"+id+uf+"/"+id+uf+"_FDOM.pdf";
    }
    }else {
    fdom_url=""; document.querySelector(".fdom").style.background="red";
  }

  if (data.Escr == "S" ) {
    document.querySelector(".escr").style.background="green";
    if (uf == "000") {
      escr_url=directorio+id+"/"+id+"_ESCR.pdf";
    }else {
      escr_url=directorio+id+"/"+id+uf+"/"+id+uf+"_ESCR.pdf";
    }
    }else {
    escr_url=""; document.querySelector(".escr").style.background="red";
  }
  
  if (data.Imagen == "S"){
     document.querySelector(".foto_imagen").src = "./public/Municipios/"+localStorage.getItem("idmuni")+"/BDDig/FotFre/"+id+".jpg";
     document.querySelector(".foto_frente_grande").src = "./public/Municipios/"+localStorage.getItem("idmuni")+"/BDDig/FotFre/"+id+".jpg";
  }else {
     document.querySelector(".foto_imagen").src = "./public/img/sinimagen.jpg";
     document.querySelector(".foto_frente_grande").src = "./public/img/sinimagen.jpg";
  }
  
 
  /*
  const response2 = await fetch(ipservidor+"/crear_ficha/"+id+"/"+uf+"/"+"VILLA RIO BERMEJITO/"+SumaTotal);
  const data2 = await response2.json();
  if (data2.estado != "falta") {
    document.querySelector(".frel").style.background="green";
  }else {
    document.querySelector(".frel").style.background="blue";
  }
  frel_url=data2.url;*/
}

function Cerrar_foto_grande() {
  document.querySelector(".foto_grande").style.display="none";
}

function Abrir_foto_grande()  {
  document.querySelector(".foto_grande").style.display="block";
}


function TraerJsonParcelario() {
   //fetch(ipservidor+'/api/parcelario')

  fetch(ObtenerLinkJsonGeoserver('Municipios', idmuni+"_parcelario"))
  .then(function(response) { return response.json(); })
  .then(function(data) {
    geojsonLayer = L.geoJSON(data , {
          style: function(feature) { return { color: 'black', fillColor: 'transparent', weight: 0.5,  zIndex: 1 };
    },
    onEachFeature: function(feature, layer) {
         layer.on('click', function(e) {
        
          var campo = feature.properties;
          document.querySelector(".box_info").style.display="block"; 
          document.querySelector(".idpar_deuda").innerHTML = campo.ID_NOMENCL;
          Documentacion(campo.ID_NOMENCL, "000")
          CompletarCampos(campo) ;
          TraerUnaRestitucion(campo.ID_NOMENCL)
          Traer_estado_parcela(localStorage.getItem("idmuni"),campo.ID_NOMENCL, AnioActual)


          // Si hay un polígono seleccionado actualmente, lo restaura a su estilo original
          if (selectedPolygon) { geojsonLayer.resetStyle(selectedPolygon);}

          // Almacena el polígono seleccionado actualmente
          selectedPolygon = layer;

          // Pinta el polígono seleccionado con un nuevo estilo
          layer.setStyle({ color: 'green',  fillColor: 'yellow' });
        });
        
    }
  })
  geojsonLayer.addTo(map);  
  })
}
TraerJsonParcelario();

var geojsonresti;
function TraerJsonRestitucion() {
   fetch(ObtenerLinkJsonGeoserver('Municipios',idmuni+"_restitucion"))
  .then(function(response) { return response.json(); })
  .then(function(data) {
    geojsonresti = L.geoJSON(data , {
          style: function(feature) { return { color: 'red', fillColor: 'transparent', weight: 0.5, zIndex: 2 };
        },
        onEachFeature: function(feature, layer) {
          var tooltipContent = TraerTipoContruccion(feature.properties.Codigo) + " - " +  feature.properties.Sup_m2.toString()+" m2"; 
          layer.bindTooltip(tooltipContent).openTooltip();

          layer.on('click', function(e) {
            
          })
        }
    });
    geojsonresti.addTo(map);  
  })
}



var VistaResti=false
function QuitarJsonParcelario() {
  if (!VistaResti) {
    TraerJsonRestitucion()
    document.querySelector(".btn_info").src='./public/img/info_2.jpg'
  }else {
    map.removeLayer(geojsonresti);
    document.querySelector(".btn_info").src='./public/img/info.jpg'
  }
  VistaResti = !VistaResti
}




function consultarPoligono(idNomenclatura) {
  Quitar_Estados();
  // Realizar tu lógica de consulta aquí para buscar el polígono según el ID_NOMENCL
  var poligonoDeseado;
  var VectorPoligono=[]
  // Supongamos que encontramos el polígono deseado según el ID_NOMENCL
  geojsonLayer.eachLayer(function(layer) {
    var properties = layer.feature.properties;
    if (properties.ID_NOMENCL === idNomenclatura) {
      poligonoDeseado = layer;
      VectorPoligono = layer.feature.geometry.coordinates[0][0];
      return;
    }
  });

  // Verificar si se encontró el polígono
  if (poligonoDeseado) {
    // Navegar hacia el polígono
    map.fitBounds(poligonoDeseado.getBounds(), { maxZoom: 19 });
    
    // Realizar otras acciones según sea necesario, como resaltar el polígono, mostrar información, etc.
    poligonoDeseado.setStyle({ color: 'red', fillOpacity: 0, weight: 2});
  } else {
    // Si no se encuentra el polígono, puedes mostrar un mensaje o realizar otra acción adecuada
    toastr.error('No se encontró la parcela: ' + idNomenclatura, 'Error');
    
  }
}
 


async function Traer_estado_parcela_uf(idpar, uf) {
  document.querySelector(".detalle_uf").innerHTML = "Detalle por Unidad Funcional ("+uf+")";
  const fecha = new Date();
  const añoActual = fecha.getFullYear();
  const response = await fetch(ipservidor+"/obtener_estado_parcela_uf/"+idpar+"/"+uf+"/"+añoActual);
  const data = await response.json();
  if (data) {
    //Año en curso
    document.querySelector(".est_curso_pag_ii").innerHTML = data.PagActII.toFixed(2) 
    document.querySelector(".est_curso_mor_ii").innerHTML = data.MorActII.toFixed(2) 
    document.querySelector(".est_curso_deu_ii").innerHTML = data.DeuActII.toFixed(2) 
    document.querySelector(".est_curso_pag_ts").innerHTML = data.PagActTS.toFixed(2) 
    document.querySelector(".est_curso_mor_ts").innerHTML = data.MorActTS.toFixed(2) 
    document.querySelector(".est_curso_deu_ts").innerHTML = data.DeuActTS.toFixed(2) 
    //Año anterior
    document.querySelector(".est_anterior_pag_ii").innerHTML = data.PagAntII.toFixed(2) 
    document.querySelector(".est_anterior_mor_ii").innerHTML = data.MorAntII.toFixed(2) 
    document.querySelector(".est_anterior_deu_ii").innerHTML = data.DeuAntII.toFixed(2) 
    document.querySelector(".est_anterior_pag_ts").innerHTML = data.PagAntTS.toFixed(2) 
    document.querySelector(".est_anterior_mor_ts").innerHTML = data.MorAntTS.toFixed(2) 
    document.querySelector(".est_anterior_deu_ts").innerHTML = data.DeuAntTS.toFixed(2) 
    //Total
    document.querySelector(".est_total_pag_ii").innerHTML = (data.PagActII+data.PagAntII).toFixed(2) 
    document.querySelector(".est_total_mor_ii").innerHTML = (data.MorActII+data.MorAntII).toFixed(2) 
    document.querySelector(".est_total_deu_ii").innerHTML = (data.DeuActII+data.DeuAntII).toFixed(2) 
    document.querySelector(".est_total_pag_ts").innerHTML = (data.PagActTS+data.PagAntTS).toFixed(2) 
    document.querySelector(".est_total_mor_ts").innerHTML = (data.MorActTS+data.MorAntTS).toFixed(2) 
    document.querySelector(".est_total_deu_ts").innerHTML = (data.DeuActTS+data.DeuAntTS).toFixed(2)
 }
}

async function Traer_estado_parcela(idmuni, idpar, anio) {
  const response2 = await fetch(ipservidor+"/estado_cuentas_parcela/"+idmuni+"/"+idpar+"/"+anio);
  const data2 = await response2.json(); 
  if (data2) {
      document.querySelector(".est_parcela_pag_ii").innerHTML = data2[0].ImpTotPagadoII.toFixed(2) 
      document.querySelector(".est_parcela_mor_ii").innerHTML = data2[0].ImpTotalMoraII.toFixed(2) 
      document.querySelector(".est_parcela_deu_ii").innerHTML = data2[0].ImpTotalPagarII.toFixed(2) 
      document.querySelector(".est_parcela_pag_ts").innerHTML = data2[0].ImpTotPagadoTS.toFixed(2) 
      document.querySelector(".est_parcela_mor_ts").innerHTML = data2[0].ImpTotalMoraTS.toFixed(2) 
      document.querySelector(".est_parcela_deu_ts").innerHTML = data2[0].ImpTotalPagarTS.toFixed(2) 
  }

  
}


function VerPoligoParcela() {
   consultarPoligono(document.querySelector(".titulo_parcela").textContent)
}



function TraerTipoContruccion(tipo) {
  if (tipo == 1) { return "Vivienda Familiar"}
  if (tipo == 2) { return "Edificios Comerciales"}
  if (tipo == 3) { return "Piletas"}
  if (tipo == 4) { return "En Construción"}
  if (tipo == 5) { return "Edificios Especiales"}
  if (tipo == 10){ return "Indeterminado"}
}


// Manejar eventos de movimiento del ratón para actualizar las coordenadas
map.on('mousemove', function(e) {
  document.querySelector(".latlong").innerHTML = 'Lat: ' + e.latlng.lat.toFixed(6) + ' - Lon: ' + e.latlng.lng.toFixed(6);
   
});

map.on('dblclick', function(e) {
   //window.open('https://www.google.com.ar/maps/@'+e.latlng.lat.toFixed(6)+','+ e.latlng.lng.toFixed(6)+',20z', '_blank');
});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}




// Añadir un control de escala
//L.control.scale({imperial: false,  metric: true,}).addTo(map);