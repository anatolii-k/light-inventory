import { Component, computed, inject, signal } from '@angular/core';
import { ProductCatalogListComponent } from '../product-catalog-list/product-catalog-list.component';
import { ProductCatalogService } from '../../services/product-catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorAlert } from '../error-alert/error-alert';


@Component({
  selector: 'app-products-catalog',
  imports: [ProductCatalogListComponent, ErrorAlert],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.css',
})
export class ProductsCatalog {

  private productCatalogService = inject(ProductCatalogService);
  protected productCatalogData = toSignal( this.productCatalogService.getProductCatalog() );
  protected productList = computed( () => this.productCatalogData()?.isOk ? this.productCatalogData()?.data : []);

}
