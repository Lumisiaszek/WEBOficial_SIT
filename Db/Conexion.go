package db

import (
	"database/sql"
	"fmt"

	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func DBConnetion() {

	// Puedes definir la contrasena como variable de entorno si prefieres
	user := "postgres"
	password := "sit2025"
	host := "10.5.6.162"
	port := 5432
	dbname := "AMGR"

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	DB, err = sql.Open("postgres", dsn)

	if err != nil {
		log.Fatal("Error al abrir conexion:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("No se pudo conectar a la base de datos:", err)
	}

	log.Println("DB Conectada a PostgreSQL.")
}
