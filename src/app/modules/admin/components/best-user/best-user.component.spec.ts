import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestUserComponent } from './best-user.component';

describe('BestUserComponent', () => {
  let component: BestUserComponent;
  let fixture: ComponentFixture<BestUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BestUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BestUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
