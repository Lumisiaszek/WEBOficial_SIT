package apis

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	db "github.com/sitserver/portal/Db"
)

type Proyecto struct {
	IdProyecto int
	IdArea string
	IdSector string
	NoProyecto string
}

func GetProyectos(c *gin.Context) {
	area := c.Param("area")
	sector := c.Param("sector")
	var proyectos []Proyecto
	query := "SELECT id_proyecto, id_area, id_sector, no_proyecto FROM proyectos WHERE id_area = '" + area + "' AND id_sector = '" + sector + "'"
	fmt.Println("Query: ", query)
	resultado, err := db.DB.Query(query)
	if err != nil {
		panic("API" + err.Error())
	}
	defer resultado.Close()
	for resultado.Next() {
		var reg Proyecto
		resultado.Scan(&reg.IdProyecto, &reg.IdArea, &reg.IdSector, &reg.NoProyecto)
		proyectos = append(proyectos, reg)
	}
	
	c.JSON(http.StatusOK, proyectos)
}