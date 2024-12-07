import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMeetingComponent } from './calendar-meeting.component';

describe('CalendarMeetingComponent', () => {
  let component: CalendarMeetingComponent;
  let fixture: ComponentFixture<CalendarMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
