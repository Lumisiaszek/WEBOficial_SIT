package Apis

import (
	"net/http"
	
	
	"github.com/gin-gonic/gin"

)

// Traer el template "main.html" y llenarlo con los datos enviados
func Main(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "VisorSGM",
	})
}

func PaginaNoEncontrada(c *gin.Context) {

}

func Login(c *gin.Context) {
	c.HTML(http.StatusOK, "login.html", gin.H{
		"title": "titulito",
	})
}

func Asesorias(c *gin.Context) {
	c.HTML(http.StatusOK, "asesorias.html", gin.H{
		"title": "VisorSGM",
	})
}

func UnidadEjecutora(c *gin.Context) {
	c.HTML(http.StatusOK, "unidad.html", gin.H{
		"title": "VisorSGM",
	})
}

func QueEsSit(c *gin.Context) {
	c.HTML(http.StatusOK, "que_es_SIT.html", gin.H{
		"title": "VisorSGM",
	})
}

func Geoservicios(c *gin.Context) {
	c.HTML(http.StatusOK, "geoservicios.html", gin.H{
		"title": "VisorSGM",
	})
}

func Contacto(c *gin.Context) {
	c.HTML(http.StatusOK, "contacto.html", gin.H{
		"title": "VisorSGM",
	})
}

func Visor(c *gin.Context) {
	c.HTML(http.StatusOK, "visor.html", gin.H{
		"title": "VisorSGM",
	})
}

func Atlas(c *gin.Context) {
	c.HTML(http.StatusOK, "atlas.html", gin.H{
		"title": "VisorSGM",
	})
}

func Visualizador_Rubita(c *gin.Context) {
	c.HTML(http.StatusOK, "visualizador_rubita.html", gin.H{
		"title": "VisorSGM",
	})
}

func Ambiente(c *gin.Context) {
	c.HTML(http.StatusOK, "ambiente.html", gin.H{
		"title": "VisorSGM",
	})
}