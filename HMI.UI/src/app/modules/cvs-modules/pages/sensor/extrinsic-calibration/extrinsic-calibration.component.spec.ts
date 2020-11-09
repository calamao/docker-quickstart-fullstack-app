import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrinsicCalibrationComponent } from './extrinsic-calibration.component';

describe('ExtrinsicCalibrationComponent', () => {
  let component: ExtrinsicCalibrationComponent;
  let fixture: ComponentFixture<ExtrinsicCalibrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtrinsicCalibrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrinsicCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
