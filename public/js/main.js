//
let UsuarioActivo = localStorage.getItem("usuario");
let Rol = localStorage.getItem("rol");
let NomRol = localStorage.getItem("nomrol");
let MunicipioActivo = localStorage.getItem("idmuni");
let NombreMunicipioActivo =  localStorage.getItem("municipio");

document.querySelector('.logo_muni').src="./public/img/logos/"+MunicipioActivo+".jpg";


function CompletarTitulos(municipio){
    document.querySelector('.municipio_nombre_usuario').innerHTML=municipio;
    document.querySelector('.municipio_nombre_usuario_nuevo').innerHTML=municipio;
    document.querySelector('.municipio_nombre_capa').innerHTML=municipio;
    document.querySelector('.municipio_nombre_documento').innerHTML=municipio;
}

CompletarTitulos(NombreMunicipioActivo)


if (Rol == 1  ) {
    document.querySelector(".box_municipio").style.display="block";
    document.querySelector(".box_municipio_info").style.display="none";
    document.querySelector(".tipo_rol_span").innerHTML="Administrador";
    
}else{
    document.querySelector(".box_municipio").style.display="none";
    document.querySelector(".box_municipio_info").style.display="block";
    document.querySelector(".tipo_rol_span").innerHTML="";
}

if (Rol > 2 ) {
    document.querySelector(".card_documentos").style.display="none";
    document.querySelector(".card_usuarios").style.display="none";
    document.querySelector(".card_capas").style.display="none";
}else {
    document.querySelector(".card_documentos").style.display="block";
    document.querySelector(".card_usuarios").style.display="block";
    document.querySelector(".card_capas").style.display="block";
}


//muestra en el box de Usuario
document.querySelector(".btn_usuario").innerHTML= UsuarioActivo;
document.querySelector(".municipio_info").innerHTML= NombreMunicipioActivo;
document.querySelector(".info_rol").innerHTML=NomRol;

//muestra en la confirmacion de cierre de session
document.querySelector(".span_usuario").innerHTML="<strong>"+UsuarioActivo+"</strong>";
document.querySelector(".span_rol").innerHTML="<strong>"+document.querySelector(".info_rol").innerHTML+"</strong>";


//Mostrar mostrar el Modal de Usuarios
var usuarioModal = new bootstrap.Modal(document.getElementById('usuariosModal'), {keyboard: false });
document.querySelector('.card_usuarios').addEventListener('click', function () {
    usuarioModal.show();
   
  
 });

//Mostrar mostrar el Modal de Capas
var capasModal = new bootstrap.Modal(document.getElementById('capasModal'), {keyboard: false });
document.querySelector('.card_capas').addEventListener('click', function () {capasModal.show(); });

//Mostrar mostrar el Modal de Documentaciones
var documentoModal = new bootstrap.Modal(document.getElementById('documentosModal'), {keyboard: false });
document.querySelector('.card_documentos').addEventListener('click', function () {documentoModal.show(); });

var cambioModal = new bootstrap.Modal(document.getElementById('cambioModal'), {keyboard: false });
document.querySelector('.btn_cambio').addEventListener('click', function () {cambioModal.show(); });

//Mostrar mostrar el Modal de Cerrar sessiones
var sessionModal = new bootstrap.Modal(document.getElementById('sessionModal'), {keyboard: false });
document.querySelector('.btn_cerrar_usuario').addEventListener('click', function () {sessionModal.show(); });
document.querySelector('.btn_usuario_no').addEventListener('click', function () {sessionModal.hide(); });
document.querySelector('.btn_usuario_si').addEventListener('click', function () {
    localStorage.setItem("usuario","");
    
    window.location.href = "./login"
});

document.querySelector('.card_visor').addEventListener('click', function () {
    //Al hacer click en el boton ""
    let myVisor = window.open('./visor', 'myVisor');
    if (myVisor && !myVisor.closed) {
        // La pestaña está abierta
        myVisor.focus();
    } else {
        // La pestaña no está abierta, abrir una nueva
        let myVisor = window.open('./visor', 'myVisor');
    }

 });




function subirFotoFrente() {
    var formData = new FormData();
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    formData.append('file', file);
    formData.append('muni', 'lbre');
    //'/apis/subir_foto_frente.php'
    fetch('./apis/subir_imagen_db.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



document.querySelector('.mun_activo').addEventListener('change',  function () {
    //Obtiene el nombre del municipio
    let muni_nombre = document.querySelector('.mun_activo').options[document.querySelector('.mun_activo').selectedIndex].text;
        
    //Obtiene el id del municipio
    let muni_abre =  document.querySelector('.mun_activo').value;

    localStorage.setItem("idmuni", muni_abre);
    localStorage.setItem("municipio",muni_nombre);
    Traer_UsuariosPorMunicipio(muni_abre, Rol);
    Traer_CapasPublicadas(muni_abre);
    Traer_InfoDocumentacion(muni_abre);
    CompletarTitulos(muni_nombre);

    document.querySelector('.logo_muni').src="./public/img/logos/"+muni_abre+".jpg";

});

async function Traer_InfoDocumentacion(muni) {
   const response = await fetch("./api/info_documentos/"+muni)
   const data = await response.json();
   document.querySelector(".doc_fotfre").innerHTML= data.JPGCount;
   document.querySelector(".doc_docele").innerHTML= data.DOCCount; 
   document.querySelector(".doc_digobr").innerHTML= data.RECCount;
   document.querySelector(".doc_capas").innerHTML= data.SHPCount;
   document.querySelector(".doc_simbolos").innerHTML= data.SLDCount;
  
}
Traer_InfoDocumentacion(localStorage.getItem("idmuni"));


async function Traer_CapasPublicadas(muni) {
     const response = await fetch("./api/capas_publicadas/"+muni)
    const data = await response.json(); 
    let cadena="";
    if (data) {
        cadena = " <table>"
        cadena += " <tr >"
        cadena +="  <th width='190' align='left'>Titulo</th>"
        cadena += " <th width='80' align='left'>Tipo</th>"
        cadena += " <th width='70' align='left'>Orden</th>"
        cadena += " <td></td>"
        cadena += "</tr>"
        data.forEach(item =>  {
            cadena += "<tr class='filas'>"
            cadena += " <td>"+item.Titulo+"</td>"
            cadena += " <td>"+item.Tipo+"</td>"
            cadena += " <td>"+item.Orden+"</td>"
            cadena += " <td>"
            cadena +="      <button type='button' class='btn btn-primary btn-sm' onclick=\"EditarCapa("+item.Id+")\">Editar</button>"
            cadena +="      <button type='button' class='btn btn-danger btn-sm'  onclick=\"BorrarCapa("+item.Id+")\">Eliminar</button>"
            cadena +="  </td>"
            cadena +="</tr>"
        })
        cadena += "</table>"
    }
    
    document.querySelector(".tabla_capas").innerHTML = cadena;
}
Traer_CapasPublicadas(MunicipioActivo);

var CapaOpcion="Nuevo"; var IdCapa=0
async function EditarCapa(id) {
    document.querySelector(".btn_opcion_capa").innerText = "Guardar Edición";
    document.querySelector(".datos_capas .titulo").innerHTML = "Edición de capa";
    document.querySelector(".datos_capas .titulo").style.background="#009FDE" //Celeste
    document.querySelector(".datos_capas").style.display="block";
    CapaOpcion="editar"; IdCapa = id;
    const response = await fetch("./consulta_capa/"+id)
    const data = await response.json();
    if (data) {
        document.querySelector(".inp_capa_nombre").value = data[0].Nombre
        document.querySelector(".inp_capa_titulo").value = data[0].Titulo
        document.querySelector(".inp_capa_orden").value = data[0].Orden
        document.querySelector(".inp_capa_remoto").value = data[0].UrlRemoto
        document.querySelector(".inp_capa_tipo").value = data[0].Tipo;
        document.querySelector(".inp_capa_activo").value =data[0].Activo;

    }
}

async function BorrarCapa(id) {
    document.querySelector(".datos_capas").style.display="block";
    document.querySelector(".btn_opcion_capa").innerText = "Borrar Seguro?";
    document.querySelector(".datos_capas .titulo").innerHTML = "Borrado de capa";
    document.querySelector(".datos_capas .titulo").style.background="#DC3545" //rojo
    CapaOpcion="borrar"; IdCapa = id;
    const response = await fetch("./consulta_capa/"+id)
    const data = await response.json();
    if (data) {
        document.querySelector(".inp_capa_nombre").value = data[0].Nombre
        document.querySelector(".inp_capa_titulo").value = data[0].Titulo
        document.querySelector(".inp_capa_orden").value = data[0].Orden
        document.querySelector(".inp_capa_remoto").value = data[0].UrlRemoto
        document.querySelector(".inp_capa_tipo").value = data[0].Tipo;
        document.querySelector(".inp_capa_activo").value =data[0].Activo;

    }
}

async function NuevaCapa() {
    CapaOpcion="nuevo";
    document.querySelector(".datos_capas").style.display="block";
    document.querySelector(".btn_opcion_capa").innerText = "Guardar Nuevo";
    document.querySelector(".datos_capas .titulo").innerHTML = "Agregar capa nueva";
    document.querySelector(".datos_capas .titulo").style.background="#198754" //verde
    document.querySelector(".inp_capa_nombre").value = ""
    document.querySelector(".inp_capa_titulo").value = ""
    document.querySelector(".inp_capa_orden").value =   1;
    document.querySelector(".inp_capa_remoto").value = ""
    document.querySelector(".inp_capa_tipo").value = "Local";
    document.querySelector(".inp_capa_activo").value ="Si";
}

function EjecutarCapa() {
    if (CapaOpcion == 'editar') {
        fetch('./capa/modificar/'+IdCapa, {
            method: 'POST',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                Titulo:  document.querySelector(".inp_capa_titulo").value,   
                Nombre:  document.querySelector(".inp_capa_nombre").value,   
                Tipo: document.querySelector(".inp_capa_tipo").value,   
                Orden:  parseInt(document.querySelector(".inp_capa_orden").value),   
                Activo: document.querySelector(".inp_capa_activo").value,   
                UrlRemoto: document.querySelector(".inp_capa_remoto").value,
                IdMuni: localStorage.getItem("idmuni"),
            })
        }).then(res => res.json())
        .then(res => {
            document.querySelector(".datos_capas").style.display="none";
            Traer_CapasPublicadas(localStorage.getItem("idmuni"));
            toastr.success(res.Mensaje, "Capa");
            
        }); 
    }
        //Cuando la capa es nueva
    if (CapaOpcion == 'nuevo') {
        fetch('./capa/nueva/', {
            method: 'POST',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                Titulo:  document.querySelector(".inp_capa_titulo").value,   
                Nombre:  document.querySelector(".inp_capa_nombre").value,   
                Tipo: document.querySelector(".inp_capa_tipo").value,   
                Orden:  parseInt(document.querySelector(".inp_capa_orden").value),   
                Activo: document.querySelector(".inp_capa_activo").value,   
                UrlRemoto: document.querySelector(".inp_capa_remoto").value,
                IdMuni: localStorage.getItem("idmuni"),
            })
        }).then(res => res.json())
        .then(res => {
            document.querySelector(".datos_capas").style.display="none";
            Traer_CapasPublicadas(localStorage.getItem("idmuni"));
            toastr.success(res.Mensaje, "Capa");
        }); 
    }

    if (CapaOpcion == 'borrar') {
        fetch('./capa/borrar/'+IdCapa)
        .then(res => res.json())
        .then(res => {
            document.querySelector(".datos_capas").style.display="none";
            Traer_CapasPublicadas(localStorage.getItem("idmuni"));
            toastr.danger(res.Mensaje, "Capa");
        }); 
       
    }

   
}
 
function CancelarCapa () {
    document.querySelector(".datos_capas").style.display="none";
}

async function Traer_UsuariosPorMunicipio(muni, rol) {
    const response = await fetch("./api/usuario_municipio/"+muni+"/"+rol)
    const data = await response.json(); 
    let cadena = "";
    if (data) {
        cadena = "<table>"
        cadena +="<tr>"
        cadena +="<th width='150' align='left'>Usuarios</th>"
        cadena +="<th width='200' align='left'>Nombres y Apellido</th>"
        cadena +="<td></td>"
        cadena +="</tr>"
        data.forEach(item =>  {
            cadena +="<tr  class='filas'>"
            cadena +="<td>"+item.NomUser+"</td>"
            cadena +="<td>"+item.Nombre+"</td>" 
            cadena +="<td>"
            cadena +="<button type='button' class='btn btn-primary btn-sm'>Reset</button>"
            cadena +="<button type='button' class='btn btn-danger btn-sm' onclick=BorrarUsuario('"+item.NomUser+"')>Eliminar</button>"
            cadena +="</td>"
            cadena +="</tr>"
            
        })
        cadena += "</table>"
    }
    
    document.querySelector(".tabla_usuarios").innerHTML = cadena;
}
Traer_UsuariosPorMunicipio(localStorage.getItem("idmuni"), Rol)



var UsuarioOpcion="nuevo"; var UsuarioRol=1; var UsuarioNom ="";
//Ocular el box de nuevo usuario
const NuevoUsuario = () => {
    UsuarioOpcion="nuevo"
    document.querySelector(".btn_opcion_usuario").innerText = "Guardar";
    document.querySelector(".datos_usuarios .titulo").innerHTML = "Nuevo Usuario";
    document.querySelector(".datos_usuarios .titulo").style.background="#198754"
    if (localStorage.getItem("rol") == 1) {
        document.querySelector(".fila_rol").style.display="none";
    }else {
        document.querySelector(".fila_rol").style.display="block";
    }
    document.querySelector(".datos_usuarios").style.display="block"
}

const BorrarUsuario = async (usuario) => {
    UsuarioOpcion="borrar";  UsuarioNom = usuario
    if (localStorage.getItem("rol") == 1) {
        document.querySelector(".fila_rol").style.display="none";
    }else {
        document.querySelector(".fila_rol").style.display="block";
    }
    document.querySelector(".datos_usuarios").style.display="block"

    document.querySelector(".btn_opcion_usuario").innerText = "Seguro de Borrar este Usuario?";
    document.querySelector(".datos_usuarios .titulo").innerHTML = "Borrado de Usuario";
    document.querySelector(".datos_usuarios .titulo").style.background="#DC3545" //rojo
    const response = await fetch("./consulta_usuario/"+usuario)
    const data = await response.json();
    if (data) {
        document.querySelector(".inp_tipodni").value = data[0].DNITipo
        document.querySelector(".inp_nrodni").value = data[0].DNINro
        document.querySelector(".inp_usuario").value = data[0].NomUser
        document.querySelector(".inp_nombre").value = data[0].Nombre
        UsuarioOpcion="borrar"; UsuarioNom = data[0].NomUser
    }


}



function EjecutarUsuario() {
    if (localStorage.getItem("rol") == 1) { 
        UsuarioRol=2;
    }else {
        UsuarioRol= document.querySelector(".inp_rol").value
    }
  
        //Cuando la capa es nueva
    if (UsuarioOpcion == 'nuevo') {
       
        fetch('./usuario/nuevo/', {
            method: 'POST',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                DniTipo:  document.querySelector(".inp_tipodni").value,   
                DniNro:  document.querySelector(".inp_nrodni").value,   
                NomUser: document.querySelector(".inp_usuario").value,   
                ApeyNom: document.querySelector(".inp_nombre").value,   
                Rol: parseInt(document.querySelector(".inp_rol").value),
                IdMuni: localStorage.getItem("idmuni"),
            })
        }).then(res => res.json())
        .then(res => {
            document.querySelector(".datos_usuarios").style.display="none";
            Traer_UsuariosPorMunicipio(localStorage.getItem("idmuni"), localStorage.getItem("rol"));
            toastr.success(res.Mensaje, "Usuario");
        }); 
    } 

    if (UsuarioOpcion == 'borrar') {
        fetch('./usuario/borrar/', {
            method: 'DELETE',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
            body: JSON.stringify({ NomUser: UsuarioNom,   
        })
        }).then(res => res.json())
        .then(res => {
            document.querySelector(".datos_usuarios").style.display="none";
            Traer_UsuariosPorMunicipio(localStorage.getItem("idmuni"), localStorage.getItem("rol"));
            toastr.success(res.Mensaje, "Usuario");
        }); 
    } 

   
}

function CancelarUsuario () {
    document.querySelector(".datos_ususarios").style.display="none";
}

const UsuarioCambioContrasena = async () => {
    if (document.querySelector(".pass_nuevo").value === document.querySelector(".pass_confi").value) {
        fetch('/usuarios/cambio_contrasena', {
            method: 'POST',
            headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'  },
            body: JSON.stringify({
                Usuario:    localStorage.getItem('usuario'),
                PassActual: document.querySelector(".pass_actual").value,
                PassNueva:  document.querySelector(".pass_nuevo").value,
            })
            }).then(res => res.json())
            .then(res => {
                if (res.Estado === "Ok") {
                    toastr.success('El Usuario '+ localStorage.getItem('usuario')+'modifico su contraseña con exito!!')
                    cambioModal.hide();
                }else {
                    toastr.warning('Hubo un error en la modifificacion Verifique')
                }
               
            }); 
    }else {
          toastr.error('La nueva clave y la confirmación no son iguales, verifique!!', "Verificación")
    }
    
}




