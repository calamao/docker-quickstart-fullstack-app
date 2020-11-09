import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolMovePanelComponent } from './tool-move-panel.component';

describe('ToolMovePanelComponent', () => {
  let component: ToolMovePanelComponent;
  let fixture: ComponentFixture<ToolMovePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolMovePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolMovePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
