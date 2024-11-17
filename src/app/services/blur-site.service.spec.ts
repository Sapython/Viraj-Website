import { TestBed } from '@angular/core/testing';

import { BlurSiteService } from './blur-site.service';

describe('BlurSiteService', () => {
  let service: BlurSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlurSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
