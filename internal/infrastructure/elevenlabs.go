package infrastructure

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ElevenLabsClient struct {
	apiKey     string
	httpClient *http.Client
}

func NewElevenLabsClient(apiKey string) *ElevenLabsClient {
	return &ElevenLabsClient{
		apiKey:     apiKey,
		httpClient: &http.Client{},
	}
}

type SignedURLResponse struct {
	SignedURL string `json:"signed_url"`
}

func (c *ElevenLabsClient) GenerateConnectionURL(ctx context.Context) (string, error) {
	if c.apiKey == "" {
		return "", fmt.Errorf("ElevenLabs API key is not configured")
	}

	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=default", nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("xi-api-key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("ElevenLabs API error: status %d, body: %s", resp.StatusCode, string(body))
	}

	var signedURLResp SignedURLResponse
	if err := json.NewDecoder(resp.Body).Decode(&signedURLResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return signedURLResp.SignedURL, nil
}
