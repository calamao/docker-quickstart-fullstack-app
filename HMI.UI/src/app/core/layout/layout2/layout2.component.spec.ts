import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layout2Component } from './layout2.component';

describe('Layout2Component', () => {
  let component: Layout2Component;
  let fixture: ComponentFixture<Layout2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
