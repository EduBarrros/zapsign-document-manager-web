import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DocumentListComponent } from './document-list.component';
import { DocumentService } from '../../../core/services/document.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Document } from '../../../core/models';

const mockDoc: Document = {
  id: 1,
  name: 'Contrato de Serviço',
  status: 'pending',
  open_id: null,
  token: null,
  url_pdf: null,
  external_id: null,
  created_at: '2024-01-01T00:00:00Z',
  last_updated_at: '2024-01-01T00:00:00Z',
  created_by: 'user@test.com',
  company: 1,
  signers: [],
  ai_summary: null,
  ai_missing_topics: null,
  ai_insights: null,
};

const paginatedResponse = { count: 1, next: null, previous: null, results: [mockDoc] };

describe('DocumentListComponent', () => {
  let fixture: ComponentFixture<DocumentListComponent>;
  let component: DocumentListComponent;
  let documentService: { listPaginated: jest.Mock; delete: jest.Mock };
  let dialog: { open: jest.Mock };

  beforeEach(async () => {
    documentService = {
      listPaginated: jest.fn().mockReturnValue(of(paginatedResponse)),
      delete: jest.fn().mockReturnValue(of(void 0)),
    };
    dialog = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of(false) }),
    };

    await TestBed.configureTestingModule({
      imports: [DocumentListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([{ path: 'documents/:id', component: DocumentListComponent }]),
        { provide: DocumentService, useValue: documentService },
        { provide: MatDialog, useValue: dialog },
        { provide: NotificationService, useValue: { success: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listPaginated on init and populate documents', () => {
    expect(documentService.listPaginated).toHaveBeenCalledWith(0, 10);
    expect(component.documents).toEqual([mockDoc]);
    expect(component.totalCount).toBe(1);
  });

  it('should render one table row per document', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(1);
  });

  it('should open a dialog when openCreate() is called', () => {
    component.openCreate();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should reload documents when dialog closes with a truthy result', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(true) });
    const loadSpy = jest.spyOn(component, 'load');

    component.openCreate();

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should update pageIndex and pageSize on page change and reload', () => {
    const loadSpy = jest.spyOn(component, 'load');

    component.onPageChange({ pageIndex: 1, pageSize: 25, length: 50 });

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(25);
    expect(loadSpy).toHaveBeenCalled();
  });
});
