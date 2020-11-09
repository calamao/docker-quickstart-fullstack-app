import { TestBed } from '@angular/core/testing';

import { TargetVisualizerService } from './target-visualizer.service';

describe('TargetVisualizerService', () => {
  let service: TargetVisualizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetVisualizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
