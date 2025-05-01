import { Injectable } from '@angular/core';
import { ProductService } from 'app/modules/products/services/product.service';
import { CategoryService } from 'app/modules/category/service/category.service';
//import { BannerService } from 'app/modules/banner/service/banner.service'; // Eğer yoksa dummy yap

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    //private bannerService: BannerService // Eğer yoksa comment'le başlat
  ) {}

  getFeaturedProducts() {
    return this.productService.getFeaturedProducts();
  }

  getNewArrivals() {
    return this.productService.getNewArrivals(); // bunu ProductService’e eklemelisin
  }

  getCategories() {
    return this.categoryService.getMainCategories();
  }

  // getBanners() {
  //   return this.bannerService.getBanners(); // BannerService yoksa statik başlatırsın
  // }
}
