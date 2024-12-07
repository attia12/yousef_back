import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDetailDialogComponent } from './meeting-detail-dialog.component';

describe('MeetingDetailDialogComponent', () => {
  let component: MeetingDetailDialogComponent;
  let fixture: ComponentFixture<MeetingDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetingDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
