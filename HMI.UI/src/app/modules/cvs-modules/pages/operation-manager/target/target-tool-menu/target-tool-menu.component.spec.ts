import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetToolMenuComponent } from './target-tool-menu.component';

describe('TargetToolMenuComponent', () => {
  let component: TargetToolMenuComponent;
  let fixture: ComponentFixture<TargetToolMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetToolMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetToolMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
