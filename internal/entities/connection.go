package entities

import (
	"time"

	"github.com/google/uuid"
)

type ConnectionRequest struct {
	Identifier uuid.UUID `json:"identifier"`
	CreatedAt  time.Time `json:"created_at"`
	ClientIP   string    `json:"client_ip"`
}

type ConnectionResponse struct {
	ConnectionURL string    `json:"connection_url"`
	Identifier    uuid.UUID `json:"identifier"`
}
