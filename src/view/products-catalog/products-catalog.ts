import { Component, computed, inject, signal } from '@angular/core';
import { ProductCatalogListComponent } from '../product-catalog-list/product-catalog-list.component';
import { NewProductRequest, ProductCatalogService } from '../../services/product-catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorAlert } from '../error-alert/error-alert';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {  NewProductFormComponent } from '../new-product-form/new-product-form.component';

@Component({
  selector: 'app-products-catalog',
  imports: [ProductCatalogListComponent, ErrorAlert, MatButtonModule, MatIconModule, NewProductFormComponent],
  templateUrl: './products-catalog.html',
  styleUrl: './products-catalog.css',
})
export class ProductsCatalog {

  private productCatalogService = inject(ProductCatalogService);
  protected productCatalogData = toSignal( this.productCatalogService.getProductCatalog() );
  protected productList = computed( () => this.productCatalogData()?.isOk ? this.productCatalogData()?.data : []);

  protected isAddingProduct = signal<boolean>(false);

  onAddProduct(){
    this.isAddingProduct.set( true );
  }

  onCancelAddNewProduct() {
    this.isAddingProduct.set(false);
  }
  onSubmitNewProduct(data: NewProductRequest) {
    this.productCatalogService.addProduct(data);
    this.isAddingProduct.set(false);
  }

  onReload() {
    this.productCatalogService.reloadData();
  }

}
