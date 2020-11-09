import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainConfigComponent } from './main-config.component';

describe('MainConfigComponent', () => {
  let component: MainConfigComponent;
  let fixture: ComponentFixture<MainConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
