import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip [class]="'status-chip status-' + status.toLowerCase()">
      {{ statusLabel }}
    </mat-chip>
  `,
  styles: [`
    .status-chip { font-size: 0.75rem; font-weight: 600; }
    .status-pending { background-color: #fff3e0; color: #e65100; }
    .status-signed  { background-color: #e8f5e9; color: #2e7d32; }
    .status-refused { background-color: #fce4ec; color: #c62828; }
    .status-waiting { background-color: #e3f2fd; color: #1565c0; }
  `],
})
export class StatusChipComponent {
  @Input() status = '';

  get statusLabel(): string {
    const map: Record<string, string> = {
      pending: 'Pendente',
      signed: 'Assinado',
      refused: 'Recusado',
      waiting: 'Aguardando',
    };
    return map[this.status.toLowerCase()] ?? this.status;
  }
}
