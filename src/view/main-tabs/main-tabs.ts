import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductsCatalog } from '../products-catalog/products-catalog';

@Component({
  selector: 'app-main-tabs',
  imports: [MatTabsModule, ProductsCatalog],
  templateUrl: './main-tabs.html',
  styleUrl: './main-tabs.scss',
})
export class MainTabs {

}
