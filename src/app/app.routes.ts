import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'documents', pathMatch: 'full' },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/companies/company-list/company-list.component').then(
            (m) => m.CompanyListComponent
          ),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/document-list/document-list.component').then(
            (m) => m.DocumentListComponent
          ),
      },
      {
        path: 'documents/:id',
        loadComponent: () =>
          import('./features/documents/document-detail/document-detail.component').then(
            (m) => m.DocumentDetailComponent
          ),
      },
      {
        path: 'signers',
        loadComponent: () =>
          import('./features/signers/signer-list/signer-list.component').then(
            (m) => m.SignerListComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
