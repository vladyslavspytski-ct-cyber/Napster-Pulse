package http

import (
        "interu-backend/internal/usecases"

        "github.com/gin-contrib/cors"
        "github.com/gin-gonic/gin"
)

func NewRouter(connectionUseCase *usecases.ConnectionUseCase) *gin.Engine {
        router := gin.Default()

        router.Use(cors.New(cors.Config{
                AllowAllOrigins: true,
                AllowMethods:    []string{"GET", "POST", "OPTIONS"},
                AllowHeaders:    []string{"Origin", "Content-Type", "Accept"},
        }))

        handler := NewHandler(connectionUseCase)

        router.GET("/health", handler.HealthCheck)

        v1 := router.Group("/api/v1")
        {
                v1.POST("/connection", handler.GetConnectionURL)
        }

        return router
}
