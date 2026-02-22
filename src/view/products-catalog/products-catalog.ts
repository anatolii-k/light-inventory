import { Component } from '@angular/core';
import { ProductCatalogListComponent } from '../product-catalog-list/product-catalog-list.component';


@Component({
  selector: 'app-products-catalog',
  imports: [ProductCatalogListComponent],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.css',
})
export class ProductsCatalog {

}
