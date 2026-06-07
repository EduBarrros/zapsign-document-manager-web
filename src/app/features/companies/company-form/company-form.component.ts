import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Company } from '../../../core/models';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<CompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      api_token: ['', this.isEdit ? [] : [Validators.required]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const action$ = this.isEdit
      ? this.companyService.update(this.data!.id, this.form.value)
      : this.companyService.create(this.form.value);

    action$.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Empresa atualizada!' : 'Empresa criada!');
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
