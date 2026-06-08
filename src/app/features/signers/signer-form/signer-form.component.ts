import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignerService } from '../../../core/services/signer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Signer } from '../../../core/models';

@Component({
  selector: 'app-signer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signer-form.component.html',
  styleUrl: './signer-form.component.scss',
})
export class SignerFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private signerService: SignerService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<SignerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Signer | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const action$ = this.isEdit
      ? this.signerService.update(this.data!.id, this.form.value)
      : this.signerService.create(this.form.value);

    action$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Signatário atualizado!' : 'Signatário criado!');
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
