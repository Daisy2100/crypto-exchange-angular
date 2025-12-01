# CryptoExchange - Angular Frontend

A modern cryptocurrency exchange frontend built with Angular 19, PrimeNG 19, and Tailwind CSS. This is a rewrite of the [Vue reference implementation](https://github.com/Johnny1110/crypto-exchange-fe) with additional features and improvements.

## 🚀 Features

### Core Trading Features
- ✅ Real-time market data display
- ✅ K-line/candlestick charts with ECharts
- ✅ Order book visualization
- ✅ Order placement forms (limit and market orders)
- ✅ Order history and open orders tracking
- ✅ Wallet balance management

### Technical Features
- ✅ WebSocket service for real-time data updates
- ✅ Mock backend mode for development/demo
- ✅ JWT-based authentication
- ✅ Protected routes with Auth Guards
- ✅ Responsive design for desktop and mobile
- ✅ i18n internationalization support

### UI/UX
- ✅ Cyberpunk-style command window terminal
- ✅ Dark theme optimized for trading
- ✅ PrimeNG professional component library
- ✅ Tailwind CSS for utility styling

## 📋 Tech Stack

| Technology | Version |
|------------|---------|
| Angular | 19.2.0 |
| PrimeNG | 19.1.3 |
| TypeScript | 5.7.2 |
| Tailwind CSS | 3.4.x |
| ECharts | 5.6.0 |
| RxJS | 7.8.0 |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.18.0 or higher
- npm 8.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Daisy2100/crypto-exchange-angular.git
cd crypto-exchange-angular

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200/`

### Environment Configuration

Copy the sample environment file and configure:

```bash
cp src/environments/environment.sample.ts src/environments/environment.ts
```

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080',        // REST API endpoint
    wsUrl: 'ws://localhost:8081/ws',         // WebSocket endpoint
    mockBackend: true                        // Enable mock mode for demo
};
```

**Configuration options:**

| Option | Description |
|--------|-------------|
| `apiUrl` | Backend REST API URL |
| `wsUrl` | WebSocket server URL for real-time data |
| `mockBackend` | When `true`, uses mock data instead of real backend |

### Mock Mode

When `mockBackend: true`, the app will:
- Generate realistic mock market data
- Simulate real-time price updates
- Provide mock order placement and cancellation
- Simulate authentication without a real backend

This is useful for:
- Local development without a backend
- UI/UX testing
- Demonstrations

## 🚦 Available Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Watch mode build
npm run watch
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # API endpoint definitions
│   ├── auth/                 # Authentication services & guards
│   ├── components/           # Shared components
│   │   ├── navigation/       # Navigation component
│   │   ├── footer/           # Footer component
│   │   ├── command-window/   # Cyberpunk terminal component
│   │   ├── market-table/     # Market data table
│   │   ├── market-table-order/ # Order book & trading UI
│   │   └── login-modal/      # Login/Register modal
│   ├── core/                 # Core functionality
│   │   └── i18n/             # Internationalization
│   ├── models/               # TypeScript interfaces
│   ├── pages/                # Page components
│   │   ├── dashboard/        # Main dashboard
│   │   ├── markets/          # Markets overview
│   │   ├── market-order/     # Trading page
│   │   └── about/            # About page
│   ├── services/             # Core services
│   │   ├── api.service.ts    # HTTP client wrapper
│   │   ├── auth.service.ts   # Authentication service
│   │   ├── websocket.service.ts # WebSocket for real-time data
│   │   ├── order.service.ts  # Order management
│   │   ├── wallet.service.ts # Wallet/balance management
│   │   └── market.service.ts # Market data service
│   ├── store/                # State management
│   └── app.routes.ts         # Application routing
├── assets/                   # Static assets
├── environments/             # Environment configurations
└── styles.scss               # Global styles
```

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --code-coverage

# Run tests in headless mode
npm test -- --no-watch --browsers=ChromeHeadless
```

**Test coverage includes:**
- Service tests (AuthService, WebSocketService, OrderService, WalletService)
- Component tests (Dashboard, Markets, Navigation, CommandWindow)
- Integration tests for routing and guards

## 🐳 Docker Deployment

### Build and run with Docker:

```bash
# Build the Docker image
docker build -t crypto-exchange-angular .

# Run the container
docker run -p 8080:8080 crypto-exchange-angular
```

The app will be available at `http://localhost:8080/`

### Docker Compose (with backend):

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - API_URL=http://backend:8080
      - WS_URL=ws://backend:8081/ws
```

## 🔄 CI/CD

The project includes GitHub Actions workflows:

- **CI Workflow** (`ci.yml`): Runs on PRs and pushes
  - Installs dependencies
  - Builds the project
  - Runs unit tests
  - Generates coverage reports
  - Builds Docker image (on PRs)

- **Deploy Workflow** (`deploy.yml`): Deploys to GCP on main branch pushes

## 📚 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/login` | User login |
| POST | `/api/v1/users/register` | User registration |
| POST | `/api/v1/users/logout` | User logout |
| GET | `/api/v1/users/profile` | Get user profile |

### Market Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/markets` | Get all markets |
| GET | `/api/v1/orderbooks/{market}/snapshot` | Get order book |
| GET | `/api/v1/markets/{market}/ohlcv-history/{interval}` | Get K-line data |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/orders/{market}` | Place order |
| DELETE | `/api/v1/orders/{orderId}` | Cancel order |
| GET | `/api/v1/orders` | Get orders list |

### Wallet Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/balances` | Get wallet balances |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `angular.json` | Angular CLI configuration |
| `tsconfig.json` | TypeScript compiler settings |
| `tailwind.config.js` | Tailwind CSS configuration |
| `karma.conf.js` | Karma test runner configuration |
| `Dockerfile` | Docker build configuration |
| `nginx/conf.d/default.conf.template` | Nginx server configuration |

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Based on the Vue reference implementation: [Johnny1110/crypto-exchange-fe](https://github.com/Johnny1110/crypto-exchange-fe)
- Built with [Angular](https://angular.dev/)
- UI components by [PrimeNG](https://primeng.org/)
- Charts powered by [ECharts](https://echarts.apache.org/)

---

*Built with Angular CLI 19.2.15*
