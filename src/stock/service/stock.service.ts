import { Injectable } from '@angular/core';
import {ResponseStatus} from "../../common/service/responseStatus";
import {BehaviorSubject, Observable} from "rxjs";
import {Product, ProductCatalogData} from "../../product_catalog/service/product-catalog.service";
import {UserError} from "../../common/service/user-error";
import {HttpClient} from "@angular/common/http";
import {invoke} from "@tauri-apps/api/core";

export interface StockItem {
    id: number;
    product_id: number;
    product_name: string;
    total: number;
    reserved: number;
    available: number;
}

export interface StockData {
  isOk : boolean;
  error: UserError;
  data: StockItem[];
}


function dataOk( stockItems: StockItem[] ): StockData {
  return { isOk: true, error: {message:"", details:""}, data: stockItems }
}

function dataLoadError( errMsg : string) : StockData {
  const msg = "Сталась помилка при завантажені Залишків по складу";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}

interface GetStockResponse {
   status: ResponseStatus;
   data: StockItem[];
}

@Injectable({
  providedIn: 'root',
})
export class StockService {

  stockData$ = new BehaviorSubject<StockData>( dataOk([]) );

  constructor() {
    this.reloadData();
  }
  getStockData(): Observable<StockData> {
     return this.stockData$.asObservable();
  }
  reloadData() {
    invoke<GetStockResponse>('get_stock_list')
        .then( data =>  {
          if( data.status.is_ok ) {
            this.stockData$.next( dataOk(data.data) )
          }
          else {
            this.stockData$.next( dataLoadError( data.status.error ) );
          }
        })
        .catch( err => this.stockData$.next( dataLoadError( String(err) ) ) )
  }
}
