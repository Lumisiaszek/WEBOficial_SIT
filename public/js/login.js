//let dominio = "http://"+window.location.host;


const PassVisible = () => {
    const pass = document.querySelector(".login_inp_pass");
    const ojo =  document.querySelector(".box_img_ojos");
    if (pass.type == 'password') {
        pass.setAttribute('type', 'text');
        ojo.setAttribute("src", "./public/img/24x/eyes_close.png");
       }else {
        pass.setAttribute('type', 'password');
        ojo.setAttribute("src", "./public/img/24x/eyes_open.png");
       }
}


// Agrega un evento de clic al botón
document.querySelector(".box_btn").addEventListener("click", function() {
    let usuario = document.querySelector(".login_inp_usuario").value;
    let pass =  document.querySelector(".login_inp_pass").value;
    TraerUsuarios(usuario, pass)
});


const TraerUsuarios = async (nombre, pass) => { 
    if (!document.querySelector(".login_inp_usuario").value || !document.querySelector(".login_inp_pass").value ){
        toastr.warning("Complete ambos campos!!", "Requerido")
    }else {
        document.querySelector(".btn_loading").style.display="inline-block";
        let  url = "./usuarios/"+nombre+"/"+pass;
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
            localStorage.setItem("usuario", data[0].NomUser);
            localStorage.setItem("rol", data[0].Rol);
            localStorage.setItem("nomrol", data[0].NomRol);
            localStorage.setItem("idmuni", data[0].IdMuni);
            localStorage.setItem("municipio", data[0].NomMuni);
            window.location.href = "./"
        }else {
            toastr.error("El usuario o contraseña es incorrecto","Error")
        }
       document.querySelector(".btn_loading").style.display="none";
       
    }
   
}


toastr.options = {
    "closeButton": true, "debug": false, "newestOnTop": false, "progressBar": true, "positionClass": "toast-bottom-right",
    "preventDuplicates": false, "onclick": null, "showDuration": "300", "hideDuration": "1000", "timeOut": "3000",
    "extendedTimeOut": "1000", "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut"
  }
