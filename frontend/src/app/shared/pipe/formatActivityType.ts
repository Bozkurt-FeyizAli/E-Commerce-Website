import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatActivityType',
  standalone: false
})
export class FormatActivityTypePipe implements PipeTransform {
  transform(value: string): string {
    const formatMap: { [key: string]: string } = {
      'USER_REGISTERED': 'New User Registration',
      'ORDER_COMPLETED': 'Order Completed',
      'PRODUCT_ADDED': 'Product Added',
      'COMPLAINT_FILED': 'Complaint Filed',
      'USER_BANNED': 'User Banned'
    };
    return formatMap[value] || value.replace(/_/g, ' ');
  }
}
