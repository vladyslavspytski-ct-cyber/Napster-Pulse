package postgres

import (
	"context"
	"database/sql"

	"interu-backend/internal/entities"
	"interu-backend/internal/repositories"
)

type connectionRepository struct {
	db *sql.DB
}

func NewConnectionRepository(db *sql.DB) repositories.ConnectionRepository {
	return &connectionRepository{db: db}
}

func (r *connectionRepository) SaveConnectionRequest(ctx context.Context, request *entities.ConnectionRequest) error {
	query := `
		INSERT INTO connection_requests (identifier, created_at, client_ip)
		VALUES ($1, $2, $3)
	`

	_, err := r.db.ExecContext(ctx, query, request.Identifier, request.CreatedAt, request.ClientIP)
	return err
}
