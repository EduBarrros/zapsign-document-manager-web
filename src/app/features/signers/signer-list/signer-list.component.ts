import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SignerService } from '../../../core/services/signer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Signer } from '../../../core/models';
import { SignerFormComponent } from '../signer-form/signer-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-signer-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    StatusChipComponent,
  ],
  templateUrl: './signer-list.component.html',
  styleUrl: './signer-list.component.scss',
})
export class SignerListComponent implements OnInit {
  signers: Signer[] = [];
  displayedColumns = ['name', 'email', 'status', 'document_id', 'actions'];
  loading = false;

  constructor(
    private signerService: SignerService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.signerService.list().subscribe({
      next: (data) => {
        this.signers = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openEdit(signer: Signer): void {
    const ref = this.dialog.open(SignerFormComponent, {
      width: '480px',
      data: signer,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  confirmDelete(signer: Signer): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { title: 'Excluir signatário', message: `Deseja excluir "${signer.name}"?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.delete(signer.id);
    });
  }

  private delete(id: number): void {
    this.signerService.delete(id).subscribe({
      next: () => {
        this.notification.success('Signatário excluído com sucesso.');
        this.load();
      },
    });
  }
}
