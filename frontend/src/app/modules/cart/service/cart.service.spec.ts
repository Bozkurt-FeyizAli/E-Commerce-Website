import { CartService } from 'app/modules/cart/service/cart.service';
import { TestBed } from '@angular/core/testing';


describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
