import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let openSpy: jest.Mock;

  beforeEach(() => {
    openSpy = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: { open: openSpy } },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should open snackbar with success panel class and 4s duration', () => {
      service.success('Empresa criada!');

      expect(openSpy).toHaveBeenCalledWith('Empresa criada!', 'Fechar', {
        duration: 4000,
        panelClass: ['snack-success'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });

  describe('error', () => {
    it('should open snackbar with error panel class and 6s duration', () => {
      service.error('Algo deu errado.');

      expect(openSpy).toHaveBeenCalledWith('Algo deu errado.', 'Fechar', {
        duration: 6000,
        panelClass: ['snack-error'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });

  describe('info', () => {
    it('should open snackbar without panel class and 3s duration', () => {
      service.info('Atenção.');

      expect(openSpy).toHaveBeenCalledWith('Atenção.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  });
});
