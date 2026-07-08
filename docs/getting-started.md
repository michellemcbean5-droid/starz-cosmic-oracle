# Getting Started

Welcome to the Starz Cosmic Oracle project! This guide will help you get up and running quickly.

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd starz-cosmic-oracle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173) to see the app.

## Environment Setup

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` to add any required API keys or configuration values.

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Code Quality

Before committing, ensure your code passes all checks:

```bash
npm run lint
npm run typecheck
npm test
```

## Troubleshooting

### Port already in use
If port 5173 is in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Node version issues
Ensure you are using Node.js >= 18.0.0. Use a version manager like [nvm](https://github.com/nvm-sh/nvm) if needed.

## Next Steps

- Read the [architecture documentation](./architecture.md) to understand the project structure
- Review [AGENTS.md](../AGENTS.md) for development guidelines
- Explore the `src/` directory to start building features
