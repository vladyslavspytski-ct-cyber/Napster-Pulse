package usecases

import (
	"context"
	"time"

	"interu-backend/internal/entities"
	"interu-backend/internal/repositories"

	"github.com/google/uuid"
)

type ElevenLabsClient interface {
	GenerateConnectionURL(ctx context.Context) (string, error)
}

type ConnectionUseCase struct {
	connectionRepo   repositories.ConnectionRepository
	elevenLabsClient ElevenLabsClient
}

func NewConnectionUseCase(repo repositories.ConnectionRepository, client ElevenLabsClient) *ConnectionUseCase {
	return &ConnectionUseCase{
		connectionRepo:   repo,
		elevenLabsClient: client,
	}
}

func (uc *ConnectionUseCase) GetConnectionURL(ctx context.Context, clientIP string) (*entities.ConnectionResponse, error) {
	connectionURL, err := uc.elevenLabsClient.GenerateConnectionURL(ctx)
	if err != nil {
		return nil, err
	}

	request := &entities.ConnectionRequest{
		Identifier: uuid.New(),
		CreatedAt:  time.Now().UTC(),
		ClientIP:   clientIP,
	}

	if err := uc.connectionRepo.SaveConnectionRequest(ctx, request); err != nil {
		return nil, err
	}

	return &entities.ConnectionResponse{
		ConnectionURL: connectionURL,
		Identifier:    request.Identifier,
	}, nil
}
