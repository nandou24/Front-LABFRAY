import { TestBed } from '@angular/core/testing';

import { UbigeosService } from './ubigeos.service';

describe('UbigeosService', () => {
  let service: UbigeosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbigeosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
