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
	c.HTML(http.StatusOK, "visualizador_base.html", gin.H{
		"title":        "LA RUBITA - CH 284 | PROYECTO EJECUTIVO",
		"lat_inicial":  "-27.49",
		"long_inicial": "-58.97",
		"zoom_inicial": "16",
		"proyecto_bd":  "1",
	})
}

func Visualizador_cdt(c *gin.Context) {
	c.HTML(http.StatusOK, "visualizador_base.html", gin.H{
		"title":        "PROYECTO NUEVO SUR",
		"lat_inicial":  "-27.48",
		"long_inicial": "-59.00",
		"zoom_inicial": "14",
		"proyecto_bd":  "2",
	})
}

func Ambiente(c *gin.Context) {
	c.HTML(http.StatusOK, "ambiente.html", gin.H{
		"title": "VisorSGM",
	})
}
