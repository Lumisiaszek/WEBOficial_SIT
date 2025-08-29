package Apis

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	db "github.com/sitserver/portal/Db"
)

var bytes = []byte{35, 46, 57, 24, 85, 35, 24, 74, 87, 35, 88, 98, 66, 32, 14, 05}

// This should be in an env file in production
const MySecret string = "the-key-has-to-be-32-bytes-long!"

func Encode(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func Decode(s string) []byte {
	data, _ := base64.StdEncoding.DecodeString(s)
	return data
}

func Incriptar(text, Secret string) (string, error) {
	block, err := aes.NewCipher([]byte(Secret))
	if err != nil {
		return "", err
	}
	plainText := []byte(text)
	cfb := cipher.NewCFBEncrypter(block, bytes)
	cipherText := make([]byte, len(plainText))
	cfb.XORKeyStream(cipherText, plainText)
	return Encode(cipherText), nil
}

func Desincriptar(text, MySecret string) (string, error) {
	block, err := aes.NewCipher([]byte(MySecret))
	if err != nil {
		return "", err
	}
	cipherText := Decode(text)
	cfb := cipher.NewCFBDecrypter(block, bytes)
	plainText := make([]byte, len(cipherText))
	cfb.XORKeyStream(plainText, cipherText)
	return string(plainText), nil
}

type Usuarios struct {
	NomUser string
	Rol     int
	NomRol  string
	IdMuni  string
	NomMuni string
}

func GetUsuario(c *gin.Context) {
	usuario_nom := c.Param("usuario")
	usuario_pas := c.Param("pass")
	pas_encriptado, err := Incriptar(usuario_pas, MySecret)
	if err != nil {
		fmt.Println(err)
	}
	consulta := "SELECT u.nomuser, u.rol, r.nombre,  u.id_muni, m.nom_muni "
	consulta += "FROM usuarios as u, roles as r, municipios as m "
	consulta += "WHERE u.nomuser='" + usuario_nom + "' AND u.passuser='" + pas_encriptado + "'  AND u.rol = r.id AND u.id_muni = m.id_muni "

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var usuarios []Usuarios
	for resultado.Next() {
		var user Usuarios
		resultado.Scan(&user.NomUser, &user.Rol, &user.NomRol, &user.IdMuni, &user.NomMuni)
		usuarios = append(usuarios, user)
	}
	c.JSON(http.StatusOK, usuarios)
}

type Usuario struct {
	DNITipo string
	DNINro  string
	NomUser string
	Rol     int
	Nombre  string
}

func GetUsuarioUno(c *gin.Context) {
	usuario_nom := c.Param("usuario")

	consulta := "SELECT dnitipo, dninro, nomuser, rol, apeynom "
	consulta += "FROM usuarios "
	consulta += "WHERE nomuser='" + usuario_nom + "' "

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var usuarios []Usuario
	for resultado.Next() {
		var user Usuario
		resultado.Scan(&user.DNITipo, &user.DNINro, &user.NomUser, &user.Rol, &user.Nombre)
		usuarios = append(usuarios, user)
	}
	c.JSON(http.StatusOK, usuarios)
}

type UsuariosMunicipio struct {
	DniTipo string
	DniNro  string
	NomUser string
	Nombre  string
	Rol     int
}

func GetUsuarioMunicipio(c *gin.Context) {
	idmuni := c.Param("idmuni")
	rol := c.Param("rol")

	consulta := "SELECT dnitipo, dninro, nomuser, apeynom, rol "
	consulta += "FROM Usuarios "
	if rol == "1" {
		consulta += "WHERE id_muni= '" + idmuni + "' AND rol = 2"
	} else {
		consulta += "WHERE id_muni = '" + idmuni + "' AND rol > 2"
	}

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var usuarios []UsuariosMunicipio
	for resultado.Next() {
		var user UsuariosMunicipio
		resultado.Scan(&user.DniTipo, &user.DniNro, &user.NomUser, &user.Nombre, &user.Rol)
		usuarios = append(usuarios, user)
	}
	c.JSON(http.StatusOK, usuarios)

}

func ResetearUsuario(c *gin.Context) {
	usuario_nom := c.Param("usuario")
	pass, _ := Incriptar("123123", MySecret)
	borrar_db, _ := db.DB.Prepare("UPDATE usuarios SET passuser='" + pass + "' WHERE nomuser='" + usuario_nom + "'")
	borrar_db.Exec()
	c.JSON(http.StatusOK, gin.H{
		"Estado": "Correcto",
	})
}

type UsuariosBorrar struct {
	NomUser string
}

func BorrarUsuario(c *gin.Context) {
	var user UsuariosBorrar
	c.BindJSON(&user)
	borrar_db, _ := db.DB.Prepare("DELETE FROM usuarios WHERE nomuser='" + user.NomUser + "'")
	borrar_db.Exec()
	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "El Usuario " + user.NomUser + " ha sido eliminado!!",
	})
}

type UsuariosAlta struct {
	DniTipo string
	DniNro  string
	NomUser string
	ApeyNom string
	Rol     int
	IdMuni  string
}

func NuevoUsuario(c *gin.Context) {
	var user UsuariosAlta
	pass, _ := Incriptar("123123", MySecret)
	c.BindJSON(&user)

	insertar := "INSERT INTO usuarios (dnitipo, dninro, nomuser, passuser, apeynom, rol, id_muni)  "
	insertar += "VALUES ('" + user.DniTipo + "', '" + user.DniNro + "', '" + user.NomUser + "', '" + pass + "', "
	insertar += "'" + user.ApeyNom + "', " + strconv.Itoa(user.Rol) + ", '" + user.IdMuni + "')"

	insertar_db, _ := db.DB.Prepare(insertar)
	insertar_db.Exec()

	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "El Usuario " + user.NomUser + " se a creado correctamente!!",
	})
}

type Usuarios_P struct {
	Usuario    string
	PassActual string
	PassNueva  string
}

func PostCambioContrasena(c *gin.Context) {
	var user Usuarios_P
	c.BindJSON(&user)
	estado := "Ok"
	ActualEncriptada, _ := Incriptar(user.PassActual, MySecret)
	NuevaEncriptada, _ := Incriptar(user.PassNueva, MySecret)
	fmt.Println("Actual " + ActualEncriptada)
	fmt.Println("Nuevo " + NuevaEncriptada)
	actualizar := "UPDATE usuarios SET passuser= ? "
	actualizar += "WHERE nomuser= ? AND passuser= ?"
	actualizar_db, err := db.DB.Prepare(actualizar)
	if err != nil {
		estado = "mal"
	}
	actualizar_db.Exec(NuevaEncriptada, user.Usuario, ActualEncriptada)
	c.JSON(http.StatusOK, gin.H{
		"Estado": estado,
	})
}
