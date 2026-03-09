import {AfterViewInit, Component, computed, effect, input, signal, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import { MatTable, MatTableModule } from "@angular/material/table";
import {CounterpartiesDataSource} from "./counterparties-list-datasource";
import {Counterparty} from "../../service/counterparties.service";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-counterparties-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIcon, MatIconButton, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './counterparties-list.html',
  styleUrl: './counterparties-list.css',
})
export class CounterpartiesList implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Counterparty>;

  counterpartiesList = input<Counterparty[]|undefined>();
  dataSource = new CounterpartiesDataSource();
  readonly totalCount = computed(() => this.dataSource.data().length);
  expandedElement = signal<Counterparty|null>(null);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'legal_id', 'address', 'expand'];

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Контрагенів на сторінці:";

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  constructor(){
    effect( () => {
      const data = this.counterpartiesList();
      if (data !== undefined) {
        this.dataSource.setData(data);
      }
    });
  }

  isExpanded(item: Counterparty) {
    return this.expandedElement() === item;
  }

  /** Toggles the expanded state of an element. */
  toggle(item: Counterparty) {
    this.expandedElement.set(this.isExpanded(item) ? null : item);
  }
}
