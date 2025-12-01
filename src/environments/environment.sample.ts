/**
 * Environment Configuration Sample
 * 
 * Copy this file to environment.ts and environment.prod.ts,
 * then update the values to match your backend configuration.
 * 
 * Configuration options:
 * - production: Set to true for production builds
 * - apiUrl: REST API base URL for the crypto exchange backend
 * - wsUrl: WebSocket URL for real-time market data
 * - mockBackend: Set to true to use mock data (no backend required)
 */

export const environment = {
    /**
     * Production mode flag
     * Set to true for production builds
     */
    production: false,

    /**
     * REST API base URL
     * The backend API endpoint for market data, orders, and user operations
     * Example: 'http://localhost:8080' or 'https://api.exchange.com'
     */
    apiUrl: 'http://localhost:8080',

    /**
     * WebSocket URL
     * The WebSocket endpoint for real-time market data updates
     * Example: 'ws://localhost:8081/ws' or 'wss://ws.exchange.com/ws'
     */
    wsUrl: 'ws://localhost:8081/ws',

    /**
     * Mock Backend Mode
     * When set to true, the application will use mock data instead of
     * connecting to the real backend. This is useful for:
     * - Development without a backend
     * - UI testing
     * - Demonstrations
     * 
     * Set to false when connecting to a real backend.
     */
    mockBackend: true
};
