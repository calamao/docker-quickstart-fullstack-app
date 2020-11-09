import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPoseMenuComponent } from './target-pose-menu.component';

describe('TargetPoseMenuComponent', () => {
  let component: TargetPoseMenuComponent;
  let fixture: ComponentFixture<TargetPoseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetPoseMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetPoseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
