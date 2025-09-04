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

func Urbana(c *gin.Context) {
	c.HTML(http.StatusOK, "urbana.html", gin.H{
		"title": "VisorSGM",
	})
}

func Territorial(c *gin.Context) {
	c.HTML(http.StatusOK, "territorial.html", gin.H{
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
		"title":        "PROYECTO NUEVO SUR - CAMPO DE TIRO",
		"lat_inicial":  "-27.49",
		"long_inicial": "-59.03",
		"zoom_inicial": "14",
		"proyecto_bd":  "2",
	})
}
func Visualizador_rubh(c *gin.Context) {
	c.HTML(http.StatusOK, "visualizador_base.html", gin.H{
		"title":        "REGISTROS CH 220-156-157 - RUBH",
		"lat_inicial":  "-27.50",
		"long_inicial": "-59.03",
		"zoom_inicial": "14",
		"proyecto_bd":  "3",
	})
}

func Ambiente(c *gin.Context) {
	c.HTML(http.StatusOK, "ambiente.html", gin.H{
		"title": "VisorSGM",
	})
}

		"title": "VisorSGM",
	})
}
