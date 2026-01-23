package main

import (
	"fmt"
	"log"
	"os"

	"interu-backend/internal/delivery/http"
	"interu-backend/internal/infrastructure"
	"interu-backend/internal/repositories/postgres"
	"interu-backend/internal/usecases"
)

func main() {
	dbHost := getEnv("PGHOST", "localhost")
	dbPort := getEnv("PGPORT", "5432")
	dbUser := getEnv("PGUSER", "postgres")
	dbPassword := getEnv("PGPASSWORD", "")
	dbName := getEnv("PGDATABASE", "postgres")
	serverPort := getEnv("SERVER_PORT", "8080")
	elevenLabsAPIKey := os.Getenv("ELEVENLABS_API_KEY")

	if elevenLabsAPIKey == "" {
		log.Println("Warning: ELEVENLABS_API_KEY is not set")
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	db, err := infrastructure.NewPostgresDB(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := infrastructure.RunMigrations(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	connectionRepo := postgres.NewConnectionRepository(db)

	elevenLabsClient := infrastructure.NewElevenLabsClient(elevenLabsAPIKey)

	connectionUseCase := usecases.NewConnectionUseCase(connectionRepo, elevenLabsClient)

	router := http.NewRouter(connectionUseCase)

	addr := fmt.Sprintf(":%s", serverPort)
	log.Printf("Starting server on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
