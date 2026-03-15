import {AfterViewInit, Component, computed, effect, input, ViewChild} from '@angular/core';
import {StockItem} from "../../service/stock.service";
import {MatTable, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {StockListDataSource} from "./stock-list-datatsource";

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
})
export class StockList implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StockItem>;

  stockList = input<StockItem[]|undefined>();
  dataSource = new StockListDataSource();
  readonly totalCount = computed(() => this.dataSource.data().length);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['product_id', 'product_name', 'total', 'reserved', 'available'];

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Записів на сторінці:";

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  constructor(){
    effect( () => {
      const data = this.stockList();
      if (data !== undefined) {
        this.dataSource.setData(data);
      }
    });
  }
}
