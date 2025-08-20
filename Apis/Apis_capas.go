package apis

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	db "github.com/sitserver/portal/Db"
)

type Capas struct {
	Id        int
	Titulo    string
	Nombre    string
	Tipo      string
	Orden     int
	Activo    string
	IdMuni    string
	UrlRemoto string
}

func GetCapas(c *gin.Context) {
	idmuni := c.Param("idmuni")
	var capas []Capas
	query := "SELECT id, titulo, nombre, tipo, orden, activo, id_muni, urlremoto "
	query += "FROM capas WHERE id_muni = '" + idmuni + "' ORDER BY orden"
	resultado, err := db.DB.Query(query)
	if err != nil {
		panic("API" + err.Error())
	}
	defer resultado.Close()
	for resultado.Next() {
		var reg Capas
		resultado.Scan(&reg.Id, &reg.Titulo, &reg.Nombre, &reg.Tipo, &reg.Orden, &reg.Activo, &reg.IdMuni, &reg.UrlRemoto)
		capas = append(capas, reg)
	}
	c.JSON(http.StatusOK, capas)
}

type CapasPublicadas struct {
	Id        int
	Titulo    string
	Nombre    string
	Tipo      string
	Orden     int
	Activo    string
	UrlRemoto string
	IdMuni    string
}

func ObtenerCapasPublicadas(c *gin.Context) {
	idmuni := c.Param("idmuni")
	consulta := "SELECT  id, titulo, nombre, tipo, orden, urlremoto "
	consulta += "FROM Capas "
	consulta += "WHERE id_muni='" + idmuni + "' "
	consulta += "ORDER BY orden"

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var capas []CapasPublicadas
	for resultado.Next() {
		var capa CapasPublicadas
		resultado.Scan(&capa.Id, &capa.Titulo, &capa.Nombre, &capa.Tipo, &capa.Orden, &capa.UrlRemoto)
		capas = append(capas, capa)
	}
	c.JSON(http.StatusOK, capas)
}

func ConsultaCapaPublicada(c *gin.Context) {
	id := c.Param("id")
	consulta := "SELECT id, titulo, nombre, tipo, orden, urlremoto, activo "
	consulta += "FROM Capas "
	consulta += "WHERE id= " + id

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var capas []CapasPublicadas
	for resultado.Next() {
		var capa CapasPublicadas
		resultado.Scan(&capa.Id, &capa.Titulo, &capa.Nombre, &capa.Tipo, &capa.Orden, &capa.UrlRemoto, &capa.Activo)
		capas = append(capas, capa)
	}
	c.JSON(http.StatusOK, capas)
}

func NuevaCapasPublicadas(c *gin.Context) {
	var capa CapasPublicadas
	c.BindJSON(&capa)

	mensaje := "La capa " + capa.Titulo + " se a creado correctamente!!"

	insertar := "INSERT INTO capas (titulo, nombre, tipo, orden, activo, urlremoto, id_muni)  "
	insertar += "VALUES ('" + capa.Titulo + "', '" + capa.Nombre + "', '" + capa.Tipo + "', " + strconv.Itoa(capa.Orden)
	insertar += ", '" + capa.Activo + "', '" + capa.UrlRemoto + "', '" + capa.IdMuni + "')"

	insertar_db, _ := db.DB.Prepare(insertar)
	_, error := insertar_db.Exec()
	if error != nil {
		mensaje = "Error en la creación de la capa"
	}

	c.JSON(http.StatusOK, gin.H{
		"Mensaje": mensaje,
	})
}

func BorrarCapasPublicadas(c *gin.Context) {
	id := c.Param("id")
	borrar_db, _ := db.DB.Prepare("DELETE FROM capas WHERE id=" + id)
	borrar_db.Exec()
	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "La Capa ha sido eliminada!!",
	})
}

func ModificarCapasPublicadas(c *gin.Context) {
	id := c.Param("id")
	var capa CapasPublicadas
	c.BindJSON(&capa)

	actualizar := "UPDATE capas SET titulo = '" + capa.Titulo + "', nombre = '" + capa.Nombre + "', tipo = '"
	actualizar += capa.Tipo + "', orden = " + strconv.Itoa(capa.Orden) + ", activo = '" + capa.Activo + "', urlremoto = '"
	actualizar += capa.UrlRemoto + "', id_muni = '" + capa.IdMuni + "' WHERE id = " + id

	actualizar_db, _ := db.DB.Prepare(actualizar)
	filas, _ := actualizar_db.Exec()
	fmt.Println(filas)

	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "La capa " + capa.Titulo + " se a Modificado correctamente!!",
	})
}
