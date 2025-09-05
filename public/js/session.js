if (localStorage.getItem("usuario") == "" || localStorage.getItem("usuario") == null ) {
    window.location.href = "./login"
}


//Cierra Seccion despues de 10 min de inactividad
let inactivityTime = function () {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function logout() {
        localStorage.clear();
        window.location.href = "./login"
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 600000);  // 600000 ms = 6 minutos
    }
};
//inactivityTime();
