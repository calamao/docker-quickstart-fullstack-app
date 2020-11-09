import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselActionsComponent } from './carousel-actions.component';

describe('CarouselActionsComponent', () => {
  let component: CarouselActionsComponent;
  let fixture: ComponentFixture<CarouselActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
