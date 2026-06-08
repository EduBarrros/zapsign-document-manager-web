import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentService } from '../../../core/services/document.service';
import { CompanyService } from '../../../core/services/company.service';
import { SignerService } from '../../../core/services/signer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Document, Company, Signer } from '../../../core/models';

function atLeastOneSigner(group: AbstractControl): ValidationErrors | null {
  const existing: Signer[] = group.get('existingSigners')?.value ?? [];
  const newSigners: unknown[] = (group.get('newSigners') as FormArray)?.controls ?? [];
  return existing.length > 0 || newSigners.length > 0 ? null : { noSigners: true };
}

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
    MatTooltipModule,
  ],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss',
})
export class DocumentFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  companies: Company[] = [];
  availableSigners: Signer[] = [];
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private companyService: CompanyService,
    private signerService: SignerService,
    private notification: NotificationService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DocumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Document | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
        url_pdf: [this.data?.url_pdf ?? '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
        company: [this.data?.company ?? null, Validators.required],
        created_by: [this.data?.created_by ?? this.authService.getEmail() ?? '', Validators.required],
        existingSigners: [[]],
        newSigners: this.fb.array([]),
      },
      { validators: this.isEdit ? [] : atLeastOneSigner }
    );

    this.companyService.list().subscribe((c) => (this.companies = c));

    if (!this.isEdit) {
      this.signerService.list().subscribe((s) => (this.availableSigners = s));
    }
  }

  get newSignersArray(): FormArray {
    return this.form.get('newSigners') as FormArray;
  }

  addNewSigner(): void {
    this.newSignersArray.push(
      this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      })
    );
  }

  removeNewSigner(index: number): void {
    this.newSignersArray.removeAt(index);
  }

  compareSigner(a: Signer, b: Signer): boolean {
    return a?.id === b?.id;
  }

  get hasNoSigners(): boolean {
    return this.form.hasError('noSigners') &&
      (this.form.get('existingSigners')?.touched || this.newSignersArray.touched);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const { existingSigners, newSigners, ...rest } = this.form.value;

    const signerPayload = [
      ...(existingSigners as Signer[]).map((s) => ({ name: s.name, email: s.email })),
      ...newSigners,
    ];

    const payload = this.isEdit
      ? { name: rest.name }
      : { ...rest, signers: signerPayload };

    const action$ = this.isEdit
      ? this.documentService.update(this.data!.id, payload)
      : this.documentService.create(payload);

    action$.subscribe({
      next: () => {
        this.notification.success(
          this.isEdit ? 'Documento atualizado!' : 'Documento criado e enviado para a ZapSign!'
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
