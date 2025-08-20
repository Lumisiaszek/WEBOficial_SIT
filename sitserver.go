package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	apis "github.com/sitserver/portal/Apis"
	db "github.com/sitserver/portal/Db"
)

func main() {
	var PORT_I string = "8000"
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default() //Motor del Framework Gin

	//Activa los acceso, por ahora todos los origenes y metodos
	r.Use(cors.Default())
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "DELETE"}
	r.Use(cors.New(config))

	//Modo Produccion

	//Rellena los template y Pone en public las carpetas
	r.LoadHTMLGlob("templates/*.html")
	r.Static("/public", "./public")

	//Funcion para servir los templates, estos estan fuera de public
	r.GET("/temp", func(c *gin.Context) {
		http.ServeFile(c.Writer, c.Request, "./templates/*")
	})

	db.DBConnetion()

	r.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "p404.html", gin.H{
			"title": "VisorSGM",
		})
	})

	//Enrutadores de la aplicacion
	r.GET("/", apis.Main)
	r.GET("/asesorias", apis.Asesorias)
	r.GET("/geoservicios", apis.Geoservicios)
	r.GET("/contacto", apis.Contacto)
	r.GET("/unidad", apis.UnidadEjecutora)
	r.GET("/sit", apis.QueEsSit)
	r.GET("/get_proyecto/:sector/:area", apis.GetProyectos)

	fmt.Println("PORT Servidor: " + PORT_I)
	r.Run(":" + PORT_I)
}
