import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterBlockComponent } from './parameter-block.component';

describe('ParameterBlockComponent', () => {
  let component: ParameterBlockComponent;
  let fixture: ComponentFixture<ParameterBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
