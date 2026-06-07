import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
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
  { path: '**', redirectTo: 'login' },
];
