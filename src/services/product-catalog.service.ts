import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserError } from './user-error';


export interface Product {
  id: number;
  name: string;
  unit: string;
}

export interface ProductCatalogData {
  isOk : boolean;
  error: UserError;
  data: Product[];
}

interface ProductCatalogResponse {
  is_ok : boolean;
  error: string;
  data: Product[];
}


function dataIsOk( productList: Product[] ): ProductCatalogData {
  return { isOk: true, error: {message:"", details:""}, data: productList }
}

function dataIsError( errMsg : string) : ProductCatalogData {
  const msg = "Failed to load Product catalog";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {

  catalog$ = new BehaviorSubject<ProductCatalogData>( dataIsOk([]) );

  constructor(){
    this._loadData();
  }
  
  getProductCatalog(): Observable<ProductCatalogData> {
      return this.catalog$.asObservable();
  }

  addProduct(product: Product): void {
      //this.catalog$.next([...this.catalog$.getValue(), product]);
      this._loadData();
  }
  
  _loadData() {
    invoke<ProductCatalogResponse>('get_product_catalog')
    .then( data =>  {
        if( data.is_ok ) {
          this.catalog$.next( dataIsOk(data.data) )
        }
        else {
          this.catalog$.next( dataIsError( data.error ) );
        }
    })
    .catch( err => this.catalog$.next( dataIsError( String(err) ) ) )
  }
}
