import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { maslGuard } from './masl.guard';

describe('maslGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => maslGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
