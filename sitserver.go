package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/sitserver/portal/Apis"
	db "github.com/sitserver/portal/Db"
)

func main() {
	var PORT_I string = "80"
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.Default())
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "DELETE"}
	r.Use(cors.New(config))

	r.LoadHTMLGlob("templates/*.html")
	r.Static("/public", "./public")

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
	r.GET("/", Apis.Main)
	r.GET("/asesorias", Apis.Asesorias)
	r.GET("/getcapas/:id_area/:proyecto", Apis.GetCapas)
	r.GET("/visualizador_rubita", Apis.Visualizador_Rubita)
	r.GET("/visualizador_cdt", Apis.Visualizador_cdt)
	r.GET("/geoservicios", Apis.Geoservicios)
	r.GET("/contacto", Apis.Contacto)
	r.GET("/unidad", Apis.UnidadEjecutora)
	r.GET("/ambiente", Apis.Ambiente)
	r.GET("/sit", Apis.QueEsSit)
	r.GET("/get_proyecto/:sector/:area", Apis.GetProyectos)

	// Proxy reverso para /geoserver/*
	r.Any("/geoserver/*proxyPath", ProxyReverso("localhost:8080"))

	fmt.Println("Iniciando servidor en puerto", PORT_I)
	err := r.Run(":" + PORT_I)
	if err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}

// ProxyReverso crea un handler que redirige las peticiones hacia targetURL
func ProxyReverso(target string) gin.HandlerFunc {
	return func(c *gin.Context) {
		remote, err := url.Parse(target)
		if err != nil {
			c.String(http.StatusInternalServerError, "Error en la URL destino: %v", err)
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(remote)

		// Opcional: modificar la request antes de enviarla
		proxy.ModifyResponse = func(resp *http.Response) error {
			// puedes inspeccionar o modificar la respuesta si es necesario
			return nil
		}

		// Redirigir el request original
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
