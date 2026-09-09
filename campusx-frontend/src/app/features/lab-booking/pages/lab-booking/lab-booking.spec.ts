import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabBooking } from './lab-booking';

describe('LabBooking', () => {
  let component: LabBooking;
  let fixture: ComponentFixture<LabBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabBooking],
    }).compileComponents();

    fixture = TestBed.createComponent(LabBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
