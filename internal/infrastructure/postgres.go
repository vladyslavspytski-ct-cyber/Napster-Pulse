package infrastructure

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func NewPostgresDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func RunMigrations(db *sql.DB) error {
	query := `
		CREATE TABLE IF NOT EXISTS connection_requests (
			identifier UUID PRIMARY KEY,
			created_at TIMESTAMP NOT NULL,
			client_ip TEXT NOT NULL
		)
	`

	_, err := db.Exec(query)
	return err
}
