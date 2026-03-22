import {Component, computed, ElementRef, inject, input, LOCALE_ID, ViewChild} from '@angular/core';
import {StockActionType} from "../../service/stock-action.service";
import { ReactiveFormsModule, FormBuilder, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CounterpartiesService, Counterparty} from "../../../counterparty/service/counterparties.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatDivider} from "@angular/material/list";

@Component({
  selector: 'app-stock-action-form',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatDivider
  ],
  providers: [
     provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
  ],
  templateUrl: './stock-action-form.html',
  styleUrl: './stock-action-form.css',
})
export class StockActionForm {
  @ViewChild('counterpartyInput') counterpartyInput!: ElementRef<HTMLInputElement>;
  actionType = input.required<StockActionType>();

  private counterpartiesService = inject(CounterpartiesService);
  protected counterpartiesData = toSignal( this.counterpartiesService.getCounterparty() );
  protected counterpartiesList = computed( () => this.counterpartiesData()?.isOk ? this.counterpartiesData()?.data : []);

  filteredCounterpartiesList: Counterparty[]|undefined = this.counterpartiesList();

  private fb = inject(NonNullableFormBuilder);
  stockActionForm = this.fb.group({
    invoice_number: ['', Validators.required],
    invoice_date: ['', Validators.required],
    counterparty: ['', Validators.required],
  });


  onSubmit(): void {
    if (this.stockActionForm.invalid) {
      this.stockActionForm.markAllAsTouched();
      return;
    }
    console.log(this.stockActionForm.value);
  }

  onCancel(): void {
    this.stockActionForm.reset();
  }

  filter(): void {
    const filterValue = this.counterpartyInput.nativeElement.value.toLowerCase();
    this.filteredCounterpartiesList = this.counterpartiesList()?.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  displayCounterparty( counterparty: Counterparty): string {
    return counterparty.name;
  }
}
