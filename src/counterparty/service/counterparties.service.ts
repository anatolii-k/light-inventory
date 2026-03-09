import { Injectable } from '@angular/core';
import {UserError} from "../../common/service/user-error";
import {ResponseStatus} from "../../common/service/responseStatus";
import {BehaviorSubject, Observable} from "rxjs";
import {invoke} from "@tauri-apps/api/core";

export interface PaymentDetails {
  account: string;
  bank: string;
  bank_id?: string;
}
  export interface Counterparty {
    id: number;
    name: string;
    legal_id: string;
    phone: string;
    email?: string|null;
    address: string;
    payment_details?: PaymentDetails|null;
  }

export interface CounterpartiesData {
  isOk : boolean;
  error: UserError;
  data: Counterparty[];
}


interface CounterpartiesResponse {
  status: ResponseStatus;
  data: Counterparty[];
}


function dataOk( CounterpartiesList: Counterparty[] ): CounterpartiesData {
  return { isOk: true, error: {message:"", details:""}, data: CounterpartiesList }
}

function dataLoadError( errMsg : string) : CounterpartiesData {
  const msg = "Сталась помилка при завантажені Контрагентів";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}

function dataAddError( errMsg : string) : CounterpartiesData {
  const msg = "Сталась помилка при створені нового Контрагента";
  return { isOk: false, error: { message: msg, details: errMsg }, data: [] }
}



@Injectable({
  providedIn: 'root',
})
export class CounterpartiesService {
  counterpartiesList$ = new BehaviorSubject<CounterpartiesData>( dataOk([]) );

  constructor(){
    this.reloadData();
  }

  getCounterparty(): Observable<CounterpartiesData> {
    return this.counterpartiesList$.asObservable();
  }

  addCounterparty(counterparty: Counterparty): void {
    invoke<ResponseStatus>('add_counterparty', { request: counterparty })
        .then( resp => {
          if( resp.is_ok ) {
            this.reloadData()
          }
          else {
            this.counterpartiesList$.next( dataAddError( resp.error ) );
          }
        } )
        .catch( err => this.counterpartiesList$.next( dataAddError( String(err) ) ) );
  }

  reloadData() {
    invoke<CounterpartiesResponse>('get_counterparties')
        .then( data =>  {
          if( data.status.is_ok ) {
            this.counterpartiesList$.next( dataOk(data.data) )
          }
          else {
            this.counterpartiesList$.next( dataLoadError( data.status.error ) );
          }
        })
        .catch( err => this.counterpartiesList$.next( dataLoadError( String(err) ) ) )
  }
}
