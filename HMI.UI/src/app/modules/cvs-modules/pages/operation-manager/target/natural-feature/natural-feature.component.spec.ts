import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalFeatureComponent } from './natural-feature.component';

describe('NaturalFeatureComponent', () => {
  let component: NaturalFeatureComponent;
  let fixture: ComponentFixture<NaturalFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaturalFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NaturalFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
