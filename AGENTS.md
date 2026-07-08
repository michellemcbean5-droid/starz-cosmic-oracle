# AGENTS.md — Starz Cosmic Oracle

## Project Overview

Starz Cosmic Oracle is a React + TypeScript web application built with Vite. It provides celestial insights and cosmic predictions through an interactive UI.

## Technology Stack

- **Framework**: React 18 (functional components + hooks)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with TypeScript support

## Development Guidelines

### Code Style

- Use functional components with hooks; avoid class components.
- Prefer `const` and `let` over `var`.
- Use explicit return types for exported functions.
- Keep components small and focused; extract reusable logic into custom hooks.
- Use the `@/` path alias for imports from `src/`.

### File Organization

- `src/components/` — Reusable UI components (PascalCase filenames)
- `src/hooks/` — Custom React hooks (camelCase, prefix with `use`)
- `src/utils/` — Pure helper functions
- `src/types/` — Shared TypeScript interfaces and type aliases
- `tests/` — Test files (co-located or mirrored structure)

### State Management

- Start with React built-in state (`useState`, `useReducer`).
- For complex global state, consider Context API or a lightweight state library.
- Keep state as close to where it's used as possible.

### Testing Requirements

- Write unit tests for all utility functions.
- Write component tests for all user-facing components.
- Aim for meaningful test coverage, not 100% coverage for its own sake.
- Mock external APIs and browser APIs in tests.

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run tests
npm run lint         # Check code style
npm run typecheck    # TypeScript type check
```

## Environment Variables

Copy `.env.example` to `.env` and fill in required values. Never commit `.env` files.

## CI/CD

The project uses GitHub Actions for CI (see `.github/workflows/ci.yml`). All PRs must pass build, test, and lint checks before merging.

## Deployment

Production builds are static files in `dist/`. Deploy to any static hosting provider.
