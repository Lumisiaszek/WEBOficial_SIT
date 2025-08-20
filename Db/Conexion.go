package db

import (
	"database/sql"

	"log"

	_ "github.com/go-sql-driver/mysql"
	
)

var DB *sql.DB

func DBConnetion() {
	var error error
  
	var DSN = "root:sit.2024@tcp(localhost:3306)/sitchaco"
	DB, error = sql.Open("mysql", DSN)

	if error != nil {
		log.Fatal(error)
	} else {
		log.Println("DB Conectada: ")
	}
}
