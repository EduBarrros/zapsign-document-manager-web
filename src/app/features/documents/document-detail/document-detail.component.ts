import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../../core/services/document.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Document } from '../../../core/models';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    DatePipe,
    StatusChipComponent,
  ],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss',
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  loading = false;
  analyzeLoading = false;
  signerColumns = ['name', 'email', 'status', 'token', 'sign_url'];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private documentService: DocumentService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.documentService.getById(id).subscribe({
      next: (doc) => {
        this.document = doc;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  reanalyze(): void {
    if (!this.document) return;
    this.analyzeLoading = true;
    this.documentService.reanalyze(this.document.id).subscribe({
      next: (updated) => {
        this.document = updated;
        this.analyzeLoading = false;
        this.notification.success('Análise concluída!');
      },
      error: () => (this.analyzeLoading = false),
    });
  }

  goBack(): void {
    this.location.back();
  }
}
