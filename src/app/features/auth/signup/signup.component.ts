import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirmPassword');
  if (confirm && pw !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  confirm?.setErrors(null);
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { confirmPassword, ...dto } = this.form.value;
    this.authService.signup(dto).subscribe({
      next: () => {
        this.notification.success('Conta criada com sucesso!');
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: () => (this.loading = false),
    });
  }
}
