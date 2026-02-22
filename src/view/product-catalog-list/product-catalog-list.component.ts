import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ProductCatalogListDataSource } from './product-catalog-list-datasource';
import { Product, ProductCatalogService } from '../../services/product-catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-catalog-list',
  templateUrl: './product-catalog-list.component.html',
  styleUrl: './product-catalog-list.component.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  providers: [ProductCatalogListDataSource]
})
export class ProductCatalogListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;
  dataSource = inject(ProductCatalogListDataSource)
  totalCount = toSignal(this.dataSource.totalCount$, { initialValue: 0 });

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'unit'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
