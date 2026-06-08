import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: { login: jest.Mock };
  let notificationService: { success: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    authService = { login: jest.fn() };
    notificationService = { success: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be invalid with a malformed email', () => {
      component.form.setValue({ email: 'not-an-email', password: 'secret' });
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with correct email and non-empty password', () => {
      component.form.setValue({ email: 'user@test.com', password: 'secret' });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('submit()', () => {
    it('should not call authService when form is invalid', () => {
      component.submit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with form values on valid submit', () => {
      authService.login.mockReturnValue(of(undefined));
      component.form.setValue({ email: 'user@test.com', password: 'secret' });

      component.submit();

      expect(authService.login).toHaveBeenCalledWith({ email: 'user@test.com', password: 'secret' });
    });

    it('should navigate to /companies and show success notification on login success', () => {
      authService.login.mockReturnValue(of(undefined));
      component.form.setValue({ email: 'user@test.com', password: 'secret' });
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.submit();

      expect(notificationService.success).toHaveBeenCalledWith('Login realizado com sucesso!');
      expect(navigateSpy).toHaveBeenCalledWith(['/companies']);
    });

    it('should set authError and reset loading on login failure', () => {
      authService.login.mockReturnValue(throwError(() => new Error('401')));
      component.form.setValue({ email: 'user@test.com', password: 'wrong' });

      component.submit();

      expect(component.authError).toBe('E-mail ou senha incorretos.');
      expect(component.loading).toBe(false);
    });

    it('should display error banner in the template when authError is set', () => {
      component.authError = 'E-mail ou senha incorretos.';
      fixture.detectChanges();

      const banner: HTMLElement = fixture.nativeElement.querySelector('.auth-error-banner');
      expect(banner).toBeTruthy();
      expect(banner.textContent).toContain('E-mail ou senha incorretos.');
    });

    it('should disable submit button when form is invalid', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(btn.disabled).toBe(true);
    });

    it('should disable submit button while loading', () => {
      component.form.setValue({ email: 'user@test.com', password: 'secret' });
      component.loading = true;
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(btn.disabled).toBe(true);
    });
  });
});
