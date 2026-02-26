import { Component, inject, output } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { NewProductRequest } from '../../services/product-catalog.service';

@Component({
  selector: 'app-new-product-form',
  templateUrl: './new-product-form.component.html',
  styleUrl: './new-product-form.component.css',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class NewProductFormComponent {
  private fb = inject(NonNullableFormBuilder);
  addressForm = this.fb.group({
    product_name: ['', Validators.required],
    unit: ['', Validators.required]
  });
  
  units = [ 'кг.', 'т.', 'шт.', 'м.', 'уп.', 'гр.' ];
  submited = output<NewProductRequest>();
  cancelled = output();


  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.submited.emit( { name: this.addressForm.getRawValue().product_name, unit: this.addressForm.getRawValue().unit } );
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
