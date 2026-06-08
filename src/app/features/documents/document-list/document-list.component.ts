import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../../core/services/document.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Document } from '../../../core/models';
import { DocumentFormComponent } from '../document-form/document-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatPaginatorModule,
    DatePipe,
    StatusChipComponent,
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss',
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns = ['name', 'status', 'created_by', 'created_at', 'signers', 'actions'];
  loading = false;
  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private documentService: DocumentService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.documentService.listPaginated(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.documents = data.results;
        this.totalCount = data.count;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(DocumentFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: null,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  openEdit(doc: Document): void {
    const ref = this.dialog.open(DocumentFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: doc,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  confirmDelete(doc: Document): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { title: 'Excluir documento', message: `Deseja excluir "${doc.name}"?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.delete(doc.id);
    });
  }

  private delete(id: number): void {
    this.documentService.delete(id).subscribe({
      next: () => {
        this.notification.success('Documento excluído com sucesso.');
        this.load();
      },
    });
  }
}
