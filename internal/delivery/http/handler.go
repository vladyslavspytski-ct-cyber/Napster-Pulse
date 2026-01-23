package http

import (
	"net/http"

	"interu-backend/internal/usecases"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	connectionUseCase *usecases.ConnectionUseCase
}

func NewHandler(connectionUseCase *usecases.ConnectionUseCase) *Handler {
	return &Handler{
		connectionUseCase: connectionUseCase,
	}
}

func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
	})
}

func (h *Handler) GetConnectionURL(c *gin.Context) {
	clientIP := c.ClientIP()

	response, err := h.connectionUseCase.GetConnectionURL(c.Request.Context(), clientIP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate connection URL",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}
