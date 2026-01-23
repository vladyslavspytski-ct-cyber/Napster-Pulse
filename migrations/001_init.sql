-- Migration: Create connection_requests table
-- This table stores logs of connection requests without storing API keys

CREATE TABLE IF NOT EXISTS connection_requests (
    identifier UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    client_ip TEXT NOT NULL
);

-- Index for faster queries by creation time
CREATE INDEX IF NOT EXISTS idx_connection_requests_created_at ON connection_requests(created_at);
