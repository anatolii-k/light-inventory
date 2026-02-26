import { AfterViewInit, Component, computed, effect, input, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ProductCatalogListDataSource } from './product-catalog-list-datasource';
import { Product } from '../../services/product-catalog.service';

@Component({
  selector: 'app-product-catalog-list',
  templateUrl: './product-catalog-list.component.html',
  styleUrl: './product-catalog-list.component.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
})
export class ProductCatalogListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;

  productList = input<Product[]|undefined>();
  dataSource = new ProductCatalogListDataSource();
  readonly totalCount = computed(() => this.dataSource.data().length);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'unit'];

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Товарів на сторінці:";

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  constructor(){
    effect( () => {
      const data = this.productList();
      if (data !== undefined) {
         this.dataSource.setData(data);
      }
    });
  }
}
