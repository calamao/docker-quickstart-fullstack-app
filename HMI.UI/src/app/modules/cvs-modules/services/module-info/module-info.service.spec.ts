import { TestBed } from '@angular/core/testing';

import { ModuleInfoService } from './module-info.service';

describe('ModuleInfoService', () => {
  let service: ModuleInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
