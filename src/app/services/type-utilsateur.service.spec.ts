import { TestBed } from '@angular/core/testing';

import { TypeUtilsateurService } from './type-utilsateur.service';

describe('TypeUtilsateurService', () => {
  let service: TypeUtilsateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeUtilsateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
