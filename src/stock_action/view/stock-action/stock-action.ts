import {Component, input} from '@angular/core';
import {StockActionType} from "../../service/stock-action.service";
import {StockActionForm} from "../stock-action-form/stock-action-form";

@Component({
  selector: 'app-stock-action',
  imports: [
    StockActionForm
  ],
  templateUrl: './stock-action.html',
  styleUrl: './stock-action.css',
})
export class StockAction {
  actionType = input.required<StockActionType>();
}
