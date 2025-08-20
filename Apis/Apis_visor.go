package apis

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	db "github.com/sitserver/portal/Db"
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

func SubirPdf(c *gin.Context) {
	c.HTML(http.StatusOK, "subir.html", gin.H{
		"title": "Subir PDF",
	})
}

var Nombre string

func VerPdfFrame(c *gin.Context) {
	c.HTML(http.StatusOK, "verpdf.html", gin.H{
		"nombre": Nombre,
	})
}

func CargarPdf(c *gin.Context) {
	file, _ := c.FormFile("file")

	// Obtiene la extensión del archivo
	fileName := filepath.Base(file.Filename)
	ext := filepath.Ext(fileName)

	// Obtiene el nombre del archivo sin la extensión
	name := fileName[0 : len(fileName)-len(ext)]

	// Lee el archivo
	f, _ := file.Open()
	content, _ := io.ReadAll(f)

	var tipo string
	if ext == "pdf" {
		tipo = "DocEle"
	} else {
		tipo = "Imagen"
	}

	db.DB.Exec("INSERT INTO bddig (nombre, tipo, extencion, contenido) VALUES (?, ?, ?, ?)", name, tipo, ext, content)
	c.String(200, "Archivo subido con éxito")
}

func VerPdf(c *gin.Context) {
	nombre := c.Param("nombre")
	Nombre = nombre
	var content []byte
	db.DB.QueryRow("SELECT contenido FROM bddig WHERE nombre = '" + nombre + "'").Scan(&content)
	// Envía el archivo PDF como respuesta
	c.Data(200, "application/pdf", content)
}

func VerImagen(c *gin.Context) {
	nombre := c.Param("nombre")
	var content []byte
	var extencion string
	db.DB.QueryRow("SELECT extencion, contenido FROM bddig WHERE nombre = '"+nombre+"'").Scan(&extencion, &content)
	// Envía el archivo PDF como respuesta
	c.Data(200, "image/"+extencion, content)
}

type Ubicacion struct {
	LatMuni float64
	LogMuni float64
}

func ObtenerUbicacionMunicipio(c *gin.Context) {
	idmuni := c.Param("idmuni")

	consulta := "SELECT  lat_muni, log_muni FROM Municipios WHERE id_muni='" + idmuni + "'"

	resultado, _ := db.DB.Query(consulta)
	defer resultado.Close()

	var ubicaciones []Ubicacion
	for resultado.Next() {
		var ubi Ubicacion
		resultado.Scan(&ubi.LatMuni, &ubi.LogMuni)
		ubicaciones = append(ubicaciones, ubi)
	}
	c.JSON(http.StatusOK, ubicaciones)
}

func Traer_InfoParcela(c *gin.Context) {
	idpar := c.Param("idpar")
	idmuni := c.Param("idmuni")

	resultado, _ := db.DB.Query("SELECT url FROM Municipios WHERE id_muni ='" + idmuni + "'")
	defer resultado.Close()
	url := ""
	if resultado.Next() {
		resultado.Scan(&url)
	}
	resp, _ := http.Get(url + "/info_parcela/" + idpar)
	body, _ := io.ReadAll(resp.Body)
	// Enviar los datos a la petición de JavaScript
	c.Data(http.StatusOK, "application/json", body)
}

type ParcelaCobradas struct {
	IdParc        string
	MontoCuoAlDia float64
	MontoCuoVenc  float64
	Tipo          string
}

type ParcelaCobradasAC struct {
	IdParc        string
	MontoCuoAlDia float64
	MontoCuoVenc  float64
}

func Actualizar_CuotasCobradas(c *gin.Context) {
	idmuni := c.Param("idmuni")
	fecha := c.Param("fecha")
	resultado, _ := db.DB.Query("SELECT url FROM Municipios WHERE id_muni ='" + idmuni + "'")
	defer resultado.Close()
	url := ""
	if resultado.Next() {
		resultado.Scan(&url)
	}

	// Borra la cuotas cobradas del Municipio X
	borrar_db, _ := db.DB.Prepare("DELETE FROM cuotas_cobradas WHERE idmuni='" + idmuni + "'")
	borrar_db.Exec()

	fmt.Println("Extrayendo los datos de la API EXTERNA para II")
	//Parcela Cobradas de Tasa de Servicios
	resp_ii, _ := http.Get(url + "/parcelas_cobradas/II/" + fecha)
	body_ii, _ := io.ReadAll(resp_ii.Body)

	var dataii []ParcelaCobradasAC
	json.Unmarshal(body_ii, &dataii)

	for _, item := range dataii {
		insertar := "INSERT INTO cuotas_cobradas (idparc, montocuoaldia, montocuovenc, tipo, idmuni, fecha)  "
		insertar += "VALUES ('" + item.IdParc + "', " + strconv.FormatFloat(item.MontoCuoAlDia, 'f', 2, 64) + ", " + strconv.FormatFloat(item.MontoCuoVenc, 'f', 2, 64) + ", 'II', '" + idmuni + "', '" + fecha + "') "
		insertar_db, _ := db.DB.Prepare(insertar)
		insertar_db.Exec()
	}

	fmt.Println("Extrayendo los datos de la API EXTERNA para TS")
	//Parcela Cobradas de Tasa de Servicios
	resp_ts, _ := http.Get(url + "/parcelas_cobradas/TS/" + fecha)
	body_ts, _ := io.ReadAll(resp_ts.Body)
	var datats []ParcelaCobradasAC
	json.Unmarshal(body_ts, &datats)

	for _, item := range datats {
		insertar := "INSERT INTO cuotas_cobradas (idparc, montocuoaldia, montocuovenc, tipo, idmuni, fecha) "
		insertar += "VALUES ('" + item.IdParc + "', " + strconv.FormatFloat(item.MontoCuoAlDia, 'f', 2, 64) + ", " + strconv.FormatFloat(item.MontoCuoVenc, 'f', 2, 64) + ", 'TS', '" + idmuni + "', '" + fecha + "') "
		insertar_db, _ := db.DB.Prepare(insertar)
		insertar_db.Exec()

	}

	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "Todo OK",
	})
}

func Traer_ParcelasCobradasDB(c *gin.Context) {
	idmuni := c.Param("idmuni")

	var ParcDiaII, ParcDiaTS, ParcVenII, ParcVenTS []string
	var TotalDiaII, TotalVenII, TotalDiaTS, TotalVenTS float64
	var CantDiaII, CantVenII, CantDiaTS, CantVenTS int

	resultado, _ := db.DB.Query("SELECT idparc, montocuoaldia, montocuovenc, tipo FROM cuotas_cobradas WHERE idmuni ='" + idmuni + "'")
	defer resultado.Close()

	var reg ParcelaCobradas
	for resultado.Next() {
		resultado.Scan(&reg.IdParc, &reg.MontoCuoAlDia, &reg.MontoCuoVenc, &reg.Tipo)
		if reg.Tipo == "II" {
			if reg.MontoCuoAlDia >= 1.00 {
				ParcDiaII = append(ParcDiaII, reg.IdParc)
				CantDiaII++
				TotalDiaII += reg.MontoCuoAlDia
			}
			if reg.MontoCuoVenc >= 1.00 {
				ParcVenII = append(ParcVenII, reg.IdParc)
				CantVenII++
				TotalVenII += reg.MontoCuoVenc
			}
		}
		if reg.Tipo == "TS" {
			if reg.MontoCuoAlDia >= 1.00 {
				ParcDiaTS = append(ParcDiaTS, reg.IdParc)
				CantDiaTS++
				TotalDiaTS += reg.MontoCuoAlDia
			}
			if reg.MontoCuoVenc >= 1.00 {
				ParcVenTS = append(ParcVenTS, reg.IdParc)
				CantVenTS++
				TotalVenTS += reg.MontoCuoVenc
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"ParcDiaII": ParcDiaII, "CantDiaII": CantDiaII, "TotalDiaII": TotalDiaII,
		"ParcVenII": ParcVenII, "CantVenII": CantVenII, "TotalVenII": TotalVenII,
		"ParcDiaTS": ParcDiaTS, "CantDiaTS": CantDiaTS, "TotalDiaTS": TotalDiaTS,
		"ParcVenTS": ParcVenTS, "CantVenTS": CantVenTS, "TotalVenTS": TotalVenTS,
	})
}

type ParcelaPendientes struct {
	IdParc            string
	MontoComPendCobro float64
	MontoComVencCobro float64
	Tipo              string
}

type ParcelaPendientesAC struct {
	IdParc            string
	MontoComPendCobro float64
	MontoComVencCobro float64
}

func Actualizar_CuotasPendientes(c *gin.Context) {
	idmuni := c.Param("idmuni")
	fecha := c.Param("fecha")
	resultado, _ := db.DB.Query("SELECT url FROM Municipios WHERE id_muni ='" + idmuni + "'")
	defer resultado.Close()
	url := ""
	if resultado.Next() {
		resultado.Scan(&url)
	}

	// Borra la cuotas cobradas del Municipio X
	borrar_db, _ := db.DB.Prepare("DELETE FROM cuotas_pendientes WHERE idmuni='" + idmuni + "'")
	borrar_db.Exec()

	fmt.Println("Extrayendo los datos de la API EXTERNA para II")
	//Parcela Cobradas de Tasa de Servicios
	resp_ii, _ := http.Get(url + "/cuotas_pendientes_cobros/II/" + fecha)
	body_ii, _ := io.ReadAll(resp_ii.Body)
	var dataii []ParcelaPendientesAC
	json.Unmarshal(body_ii, &dataii)

	for _, item := range dataii {
		insertar := "INSERT INTO cuotas_pendientes (idparc, montoconpendcobro, montoconvenccobro, tipo, idmuni, fecha) "
		insertar += "VALUES ('" + item.IdParc + "', " + strconv.FormatFloat(item.MontoComPendCobro, 'f', 2, 64) + ", " + strconv.FormatFloat(item.MontoComVencCobro, 'f', 2, 64) + ", 'II', '" + idmuni + "', '" + fecha + "') "
		insertar_db, _ := db.DB.Prepare(insertar)
		insertar_db.Exec()
	}

	fmt.Println("Extrayendo los datos de la API EXTERNA para TS")
	//Parcela Cobradas de Tasa de Servicios
	resp_ts, _ := http.Get(url + "/cuotas_pendientes_cobros/TS/" + fecha)
	body_ts, _ := io.ReadAll(resp_ts.Body)
	var datats []ParcelaPendientesAC
	json.Unmarshal(body_ts, &datats)

	for _, item := range datats {
		insertar := "INSERT INTO cuotas_pendientes (idparc, montoconpendcobro, montoconvenccobro, tipo, idmuni, fecha) "
		insertar += "VALUES ('" + item.IdParc + "', " + strconv.FormatFloat(item.MontoComPendCobro, 'f', 2, 64) + ", " + strconv.FormatFloat(item.MontoComVencCobro, 'f', 2, 64) + ", 'TS', '" + idmuni + "', '" + fecha + "') "
		insertar_db, _ := db.DB.Prepare(insertar)
		insertar_db.Exec()
	}

	c.JSON(http.StatusOK, gin.H{
		"Mensaje": "Todo OK",
	})

}

func Traer_ParcelasPendientesDB(c *gin.Context) {
	idmuni := c.Param("idmuni")

	var ParcVenIIC, ParcVenTSC, ParcNoVenIIC, ParcNoVenTSC []string
	var TotalVenIIC, TotalNoVenIIC, TotalVenTSC, TotalNoVenTSC float64
	var CantVenIIC, CantNoVenIIC, CantVenTSC, CantNoVenTSC int

	resultado, _ := db.DB.Query("SELECT idparc, montoconpendcobro, montoconvenccobro, tipo FROM cuotas_pendientes WHERE idmuni ='" + idmuni + "'")
	defer resultado.Close()

	var reg ParcelaPendientes
	for resultado.Next() {
		resultado.Scan(&reg.IdParc, &reg.MontoComPendCobro, &reg.MontoComVencCobro, &reg.Tipo)
		if reg.Tipo == "II" {
			if reg.MontoComPendCobro >= 1.00 {
				ParcNoVenIIC = append(ParcNoVenIIC, reg.IdParc)
				CantNoVenIIC++
				TotalNoVenIIC += reg.MontoComPendCobro
			}
			if reg.MontoComVencCobro >= 1.00 {
				ParcVenIIC = append(ParcVenIIC, reg.IdParc)
				CantVenIIC++
				TotalVenIIC += reg.MontoComVencCobro
			}
		}
		if reg.Tipo == "TS" {
			if reg.MontoComPendCobro >= 1.00 {
				ParcNoVenTSC = append(ParcNoVenTSC, reg.IdParc)
				CantNoVenTSC++
				TotalNoVenTSC += reg.MontoComPendCobro
			}
			if reg.MontoComVencCobro >= 1.00 {
				ParcVenTSC = append(ParcVenTSC, reg.IdParc)
				CantVenTSC++
				TotalVenTSC += reg.MontoComVencCobro
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"ParcNoVenIIC": ParcNoVenIIC, "CantNoVenIIC": CantNoVenIIC, "TotalNoVenIIC": TotalNoVenIIC,
		"ParcVenIIC": ParcVenIIC, "CantVenIIC": CantVenIIC, "TotalVenIIC": TotalVenIIC,
		"ParcNoVenTSC": ParcNoVenTSC, "CantNoVenTSC": CantNoVenTSC, "TotalNoVenTSC": TotalNoVenTSC,
		"ParcVenTSC": ParcVenTSC, "CantVenTSC": CantVenTSC, "TotalVenTSC": TotalVenTSC,
	})

}

func Enviar_documentos(c *gin.Context) {
	id := c.Param("idpar")
	uf := c.Param("uf")
	idmuni := c.Param("idmuni")
	directorio := "./public/Municipios/" + idmuni + "/BDDig/DocEle/" + id + "/"
	directorio_imagen := "./public/Municipios/" + idmuni + "/BDDig/FotFre/"

	eEscr, ePlme, ePlca, eOtdo, eBlcv, eFdni, eFdom, imagen := "N", "N", "N", "N", "N", "N", "N", "N"

	if uf == "000" { //Cuando no tiene UF
		if existe(directorio + id + "_BLCV.pdf") {
			eBlcv = "S"
		}
		if existe(directorio + id + "_FDNI.pdf") {
			eFdni = "S"
		}
		if existe(directorio + id + "_FDOM.pdf") {
			eFdom = "S"
		}
		if existe(directorio + id + "_ESCR.pdf") {
			eEscr = "S"
		}
	} else { //Cuando tiene UF
		if existe(directorio + id + uf + "/" + id + uf + "_BLCV.pdf") {
			eBlcv = "S"
		}
		if existe(directorio + id + uf + "/" + id + uf + "_FDNI.pdf") {
			eFdni = "S"
		}
		if existe(directorio + id + uf + "/" + id + uf + "_FDOM.pdf") {
			eFdom = "S"
		}
		if existe(directorio + id + uf + "/" + id + uf + "_ESCR.pdf") {
			eEscr = "S"
		}
	}

	//No dependen de la UF
	if existe(directorio + id + "_PLME.pdf") {
		ePlme = "S"
	}
	if existe(directorio + id + "_PLCA.pdf") {
		ePlca = "S"
	}
	if existe(directorio + id + "_OTDO.pdf") {
		eOtdo = "S"
	}
	if existe(directorio_imagen + id + ".jpg") {
		imagen = "S"
	}

	c.JSON(http.StatusOK, gin.H{"Plme": ePlme, "Plca": ePlca, "Otdo": eOtdo, "Blcv": eBlcv, "Fdni": eFdni, "Fdom": eFdom, "Escr": eEscr, "Imagen": imagen})
}

func Traer_EstadoCuenta(c *gin.Context) {
	idpar := c.Param("idpar")
	anio := c.Param("anio")
	idmuni := c.Param("idmuni")

	resultado, _ := db.DB.Query("SELECT url FROM Municipios WHERE id_muni ='" + idmuni + "'")
	defer resultado.Close()
	url := ""
	if resultado.Next() {
		resultado.Scan(&url)
	}
	resp, _ := http.Get(url + "/estado_cuentas_parcela/" + idpar + "/" + anio)
	body, _ := io.ReadAll(resp.Body)
	// Enviar los datos a la petición de JavaScript
	c.Data(http.StatusOK, "application/json", body)
}

func existe(archivo string) bool {
	info, err := os.Stat(archivo)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
