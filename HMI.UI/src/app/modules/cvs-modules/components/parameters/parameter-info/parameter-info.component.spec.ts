import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterInfoComponent } from './parameter-info.component';

describe('ParameterInfoComponent', () => {
  let component: ParameterInfoComponent;
  let fixture: ComponentFixture<ParameterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
