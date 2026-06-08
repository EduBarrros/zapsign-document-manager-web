import { test, expect } from '@playwright/test';

const AUTH_TOKEN = 'fake-e2e-token';

const mockCompanies = {
  data: { count: 1, next: null, previous: null, results: [{ id: 1, name: 'Empresa Teste', created_at: '2024-01-01T00:00:00Z', last_updated_at: '2024-01-01T00:00:00Z' }] },
  error: null,
};

const mockDocuments = {
  data: { count: 0, next: null, previous: null, results: [] },
  error: null,
};

const mockCreatedDocument = {
  data: {
    id: 99,
    name: 'Contrato E2E',
    status: 'pending',
    open_id: null,
    token: null,
    url_pdf: null,
    external_id: null,
    created_at: '2024-06-01T00:00:00Z',
    last_updated_at: '2024-06-01T00:00:00Z',
    created_by: 'user@example.com',
    company: 1,
    signers: [],
    ai_summary: null,
    ai_missing_topics: null,
    ai_insights: null,
  },
  error: null,
};

test.describe('Document creation flow', () => {
  test.beforeEach(async ({ page }) => {
    // Seed auth token so guard passes
    await page.goto('/login');
    await page.evaluate((token) => localStorage.setItem('auth_token', token), AUTH_TOKEN);

    // Mock all API calls
    await page.route('**/api/v1/companies/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockCompanies) })
    );
    await page.route('**/api/v1/documents/**', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(mockCreatedDocument) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockDocuments) });
    });

    await page.goto('/documents');
  });

  test('should show the documents list page', async ({ page }) => {
    await expect(page.locator('h1.page-title')).toContainText('Documentos');
  });

  test('should show empty state when there are no documents', async ({ page }) => {
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should open create dialog when clicking "Novo Documento"', async ({ page }) => {
    await page.click('button:has-text("Novo Documento")');
    await expect(page.locator('mat-dialog-container')).toBeVisible();
  });

  test('should close dialog when cancelled', async ({ page }) => {
    await page.click('button:has-text("Novo Documento")');
    await expect(page.locator('mat-dialog-container')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });
});

test.describe('Document list with data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate((token) => localStorage.setItem('auth_token', token), AUTH_TOKEN);

    const mockWithData = {
      data: { count: 1, next: null, previous: null, results: [mockCreatedDocument.data] },
      error: null,
    };

    await page.route('**/api/v1/companies/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockCompanies) })
    );
    await page.route('**/api/v1/documents/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockWithData) })
    );

    await page.goto('/documents');
  });

  test('should render document rows in the table', async ({ page }) => {
    const rows = page.locator('tr[mat-row]');
    await expect(rows).toHaveCount(1);
  });

  test('should display the paginator', async ({ page }) => {
    await expect(page.locator('mat-paginator')).toBeVisible();
  });

  test('should display document name in the table', async ({ page }) => {
    await expect(page.locator('td[mat-cell]').first()).toContainText('Contrato E2E');
  });
});
