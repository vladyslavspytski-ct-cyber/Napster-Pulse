package repositories

import (
	"context"

	"interu-backend/internal/entities"
)

type ConnectionRepository interface {
	SaveConnectionRequest(ctx context.Context, request *entities.ConnectionRequest) error
}
