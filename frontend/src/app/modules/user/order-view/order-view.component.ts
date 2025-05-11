import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { Order } from 'app/shared/models/order';

@Component({
  selector: 'app-order-view',
  standalone: false,
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  order!: Order;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const orderId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Order ID:', orderId);

    this.userService.getMyOrderById(orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Order fetch error:', err);
        this.isLoading = false;
      }
    });
  }


}
