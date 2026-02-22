import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';


export interface Product {
  id: number;
  name: string;
  unit: string;
}

const ProductCatalog: Product[] = [
  { id: 1, name: "Золото вагове", unit: "гр" },
  { id: 2, name: "Золото злиток 100 гр", unit: "шт" },
  { id: 5, name: "Срібло вагове", unit: "гр" },
  { id: 6, name: "Срібло злиток 100 гр", unit: "шт" },
  { id: 100, name: "Мідь лом вагова", unit: "кг" },
  { id: 335, name: "Дріт оцинкований", unit: "м" },
]


@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  
    private readonly catalog$ = new BehaviorSubject<Product[]>(ProductCatalog);

    getProductCatalog(): Observable<Product[]> {
        return this.catalog$.asObservable();
    }

    addProduct(product: Product): void {
        this.catalog$.next([...this.catalog$.getValue(), product]);
    }  
}
