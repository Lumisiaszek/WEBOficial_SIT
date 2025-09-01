package Apis

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/sitserver/portal/Db"
)

type Capas struct {
	IdShape     int
	IdArea      string
	IdProyecto  int
	TpShape     string
	NoShape     string
	AcShape     bool
	OpShape     int
	OrShape     int
	IdUsuario   int
	NoGeoserver string
}

func GetCapas(c *gin.Context) {
	area := c.Param("id_area")
	proyect := c.Param("proyecto")
	fmt.Print(proyect)
	var capas []Capas

	query := "SELECT id_shape, id_area, id_proyecto, tp_shape, no_shape, ac_shape, op_shape, or_shape, id_usuario, no_geoserver "
	query += "FROM public.\"Shapes\" WHERE id_area = '" + area + "' AND id_proyecto = " + proyect
	resultado, err := db.DB.Query(query)
	if err != nil {
		panic("API" + err.Error())
	}
	defer resultado.Close()
	for resultado.Next() {
		var reg Capas
		resultado.Scan(&reg.IdShape, &reg.IdArea, &reg.IdProyecto, &reg.TpShape, &reg.NoShape, &reg.AcShape, &reg.OpShape, &reg.OrShape, &reg.IdUsuario, &reg.NoGeoserver)
		capas = append(capas, reg)
	}
	c.JSON(http.StatusOK, capas)
}
