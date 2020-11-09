import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationComponent } from './create-operation.component';

describe('CreateOperationComponent', () => {
  let component: CreateOperationComponent;
  let fixture: ComponentFixture<CreateOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
