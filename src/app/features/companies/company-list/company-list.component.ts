import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Company } from '../../../core/models';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns = ['name', 'created_at', 'last_updated_at', 'actions'];
  loading = false;
  totalCount = 0;
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.companyService.listPaginated(this.pageIndex, this.pageSize).subscribe({
      next: (data) => {
        this.companies = data.results;
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
    const ref = this.dialog.open(CompanyFormComponent, {
      width: '480px',
      data: null,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  openEdit(company: Company): void {
    const ref = this.dialog.open(CompanyFormComponent, {
      width: '480px',
      data: company,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.load();
    });
  }

  confirmDelete(company: Company): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { title: 'Excluir empresa', message: `Deseja excluir "${company.name}"?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.delete(company.id);
    });
  }

  private delete(id: number): void {
    this.companyService.delete(id).subscribe({
      next: () => {
        this.notification.success('Empresa excluída com sucesso.');
        this.load();
      },
    });
  }
}
