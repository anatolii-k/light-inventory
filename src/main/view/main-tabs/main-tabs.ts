import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductsCatalog } from '../../../product_catalog/view/products-catalog/products-catalog';
import {Counterparties} from "../../../counterparty/view/counterparties/counterparties";

@Component({
  selector: 'app-main-tabs',
  imports: [MatTabsModule, ProductsCatalog, Counterparties],
  templateUrl: './main-tabs.html',
  styleUrl: './main-tabs.scss',
})
export class MainTabs {

}
