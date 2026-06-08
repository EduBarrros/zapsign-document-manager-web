# ZapSign Document Manager

Angular 18 dashboard for managing documents, companies and signers with ZapSign integration and AI-powered content analysis.

## Tech Stack

- **Framework:** Angular 18 (standalone components, lazy-loaded routes)
- **UI:** Angular Material 18 (MDC / Material 3)
- **HTTP:** Angular HttpClient with functional interceptors
- **Auth:** DRF Token Authentication via `Authorization: Token <token>`
- **Tests:** Jest 29 + jest-preset-angular
- **Language:** TypeScript 5.5 (strict mode)

## Features

- **Companies** — CRUD completo com token de API ZapSign por empresa
- **Documents** — Criação com envio automático à ZapSign, visualização de status e link de assinatura por signatário
- **Signers** — Cadastro independente ou inline na criação de documento
- **AI Analysis** — Resumo, tópicos faltantes e insights gerados por IA, com botão de reanálise
- **Auth** — Login, cadastro e logout com persistência de sessão via localStorage

## Architecture

```
src/app/
├── core/
│   ├── interceptors/   # auth, response (envelope unwrap), error
│   ├── models/         # TypeScript interfaces: Company, Document, Signer
│   ├── services/       # AuthService, CompanyService, DocumentService, SignerService, NotificationService
│   └── guards/         # authGuard (CanActivateFn)
├── features/
│   ├── auth/           # login, signup
│   ├── companies/      # list + dialog form
│   ├── documents/      # list, detail (AI panel), dialog form
│   └── signers/        # list + dialog form
├── layout/
│   ├── shell/          # mat-sidenav container
│   └── sidebar/        # navigation + logout
└── shared/
    ├── components/     # ConfirmDialog, StatusChip
    └── styles/         # _page.scss (shared layout utilities)
```

The API returns a `{ data, error }` envelope — the `responseInterceptor` unwraps it globally so all services receive the payload directly.

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 18: `npm install -g @angular/cli`
- Backend running at `http://localhost:8000` (Django DRF)

### Installation

```bash
git clone https://github.com/EduBarrros/zapsign-document-manager-web
cd zapsign-document-manager-web
npm install
```

### Run

```bash
npm start
# → http://localhost:4200
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests cover: services (`AuthService`, `CompanyService`, `DocumentService`, `NotificationService`), interceptors (`authInterceptor`, `responseInterceptor`, `errorInterceptor`), guards (`authGuard`), and components (`LoginComponent`, `DocumentListComponent`) — 71 tests across 10 suites.

## E2E Tests

```bash
# Run E2E tests (requires dev server or starts it automatically)
npm run e2e

# Open Playwright UI for interactive test debugging
npm run e2e:ui

# View last HTML report
npm run e2e:report
```

E2E tests cover: login form validation, failed/successful login flow, navigation, document list page, dialog open/close, and pagination visibility.

## API Contract

The frontend expects a REST API at `http://localhost:8000/api/v1` with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login/` | Authenticate and receive token |
| POST | `/auth/signup/` | Register new user |
| GET / POST | `/companies/` | List or create companies |
| GET / PATCH / DELETE | `/companies/:id/` | Read, update or delete a company |
| GET / POST | `/documents/` | List or create documents |
| GET / PATCH / DELETE | `/documents/:id/` | Read, update or delete a document |
| POST | `/documents/:id/analyze/` | Trigger AI re-analysis |
| GET / POST | `/signers/` | List or create signers |
| GET / PATCH / DELETE | `/signers/:id/` | Read, update or delete a signer |

All responses follow the envelope format:
```json
{ "data": { ... }, "error": null }
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server on port 4200 |
| `npm run build` | Production build |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Coverage report in `/coverage` |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run e2e:ui` | Open Playwright interactive UI |
