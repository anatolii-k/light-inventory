import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserError } from './user-error';
import { Response } from './response';


export interface Product {
  id: number;
  name: string;
  unit: string;
}

export interface NewProductRequest {
  name: string,
  unit: string,
  
}

export interface ProductCatalogData {
  isOk : boolean;
  error: UserError;
  data: Product[];
}


interface ProductCatalogResponse extends Response {
  data: Product[];
}


function dataOk( productList: Product[] ): ProductCatalogData {
  return { isOk: true, error: {message:"", details:""}, data: productList }
}

function dataLoadError( errMsg : string) : ProductCatalogData {
  const msg = "Сталась помилка при завантажені Каталогу Товарів";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}

function dataAddError( errMsg : string) : ProductCatalogData {
  const msg = "Сталась помилка при створені нового Товару";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}


@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {

  catalog$ = new BehaviorSubject<ProductCatalogData>( dataOk([]) );

  constructor(){
    this.reloadData();
  }
  
  getProductCatalog(): Observable<ProductCatalogData> {
      return this.catalog$.asObservable();
  }

  addProduct(product: NewProductRequest): void {
    invoke<Response>('add_product_to_catalog', { request: product })
          .then( resp => this.reloadData() )
          .catch( err => this.catalog$.next( dataAddError( String(err) ) ) );   
  }
  
  reloadData() {
    invoke<ProductCatalogResponse>('get_product_catalog')
    .then( data =>  {
        if( data.is_ok ) {
          this.catalog$.next( dataOk(data.data) )
        }
        else {
          this.catalog$.next( dataLoadError( data.error ) );
        }
    })
    .catch( err => this.catalog$.next( dataLoadError( String(err) ) ) )
  }
}
