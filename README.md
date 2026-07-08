# Starz Cosmic Oracle

A modern web application for celestial insights, cosmic predictions, and astrological guidance.

## Features

- Interactive cosmic oracle interface
- Celestial insights and predictions
- Responsive, modern UI built with React and TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0 (or [pnpm](https://pnpm.io/))

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Run tests**
   ```bash
   npm test
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint TypeScript/TSX files |
| `npm run lint:fix` | Lint and auto-fix issues |
| `npm run typecheck` | Run TypeScript compiler without emitting |

## Project Structure

```
starz-cosmic-oracle/
├── .github/workflows/   # CI/CD configurations
├── docs/                # Documentation
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root application component
│   └── main.tsx         # Application entry point
├── tests/               # Test files
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── vitest.config.ts     # Vitest test configuration
```

## Testing

Tests are written with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

The application is built as a static site and can be deployed to any static hosting platform:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

Build output is in the `dist/` directory after running `npm run build`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
