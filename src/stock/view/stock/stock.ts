import {Component, inject, signal} from '@angular/core';
import {ErrorAlert} from "../../../common/view/error-alert/error-alert";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  ProductCatalogListComponent
} from "../../../product_catalog/view/product-catalog-list/product-catalog-list.component";
import {StockService} from "../../service/stock.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {StockList} from "../stock-list/stock-list";

@Component({
  selector: 'app-stock',
  imports: [
    ErrorAlert,
    MatButton,
    MatIcon,
    ProductCatalogListComponent,
    StockList
  ],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock {
  private stockService = inject(StockService);
  protected stockData = toSignal(this.stockService.getStockData());

  onReload() {
    this.stockService.reloadData();
  }
}
