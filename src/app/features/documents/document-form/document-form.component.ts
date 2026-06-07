import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { DocumentService } from '../../../core/services/document.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Document, Company } from '../../../core/models';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss',
})
export class DocumentFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  companies: Company[] = [];
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<DocumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Document | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      pdf_url: [this.data?.pdf_url ?? '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      company_id: [this.data?.company_id ?? null, Validators.required],
      signers: this.fb.array(
        this.data?.signers?.map((s) =>
          this.fb.group({
            name: [s.name, Validators.required],
            email: [s.email, [Validators.required, Validators.email]],
          })
        ) ?? [this.createSignerGroup()]
      ),
    });

    this.companyService.list().subscribe((companies) => (this.companies = companies));
  }

  get signersArray(): FormArray {
    return this.form.get('signers') as FormArray;
  }

  createSignerGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addSigner(): void {
    this.signersArray.push(this.createSignerGroup());
  }

  removeSigner(index: number): void {
    if (this.signersArray.length > 1) {
      this.signersArray.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const action$ = this.isEdit
      ? this.documentService.update(this.data!.id, { name: this.form.value.name })
      : this.documentService.create(this.form.value);

    action$.subscribe({
      next: () => {
        this.notification.success(
          this.isEdit
            ? 'Documento atualizado!'
            : 'Documento criado e enviado para a ZapSign!'
        );
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
