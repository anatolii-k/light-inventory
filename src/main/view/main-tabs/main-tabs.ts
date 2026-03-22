import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductsCatalog } from '../../../product_catalog/view/products-catalog/products-catalog';
import {Counterparties} from "../../../counterparty/view/counterparties/counterparties";
import {Stock} from "../../../stock/view/stock/stock";
import {StockAction} from "../../../stock_action/view/stock-action/stock-action";

@Component({
  selector: 'app-main-tabs',
   imports: [MatTabsModule, ProductsCatalog, Counterparties, Stock, StockAction],
  templateUrl: './main-tabs.html',
  styleUrl: './main-tabs.scss',
})
export class MainTabs {

}
