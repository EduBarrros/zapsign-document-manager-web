import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { isAuthenticated: jest.Mock };
  let router: Router;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    authService = { isAuthenticated: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should return true when user is authenticated', () => {
    authService.isAuthenticated.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it('should return a UrlTree redirecting to /login when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false);
    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('should call isAuthenticated exactly once per guard activation', () => {
    authService.isAuthenticated.mockReturnValue(true);
    runGuard();
    expect(authService.isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
