import {Component, inject, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
    MatCardModule,
} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {Counterparty} from "../../service/counterparties.service";

@Component({
  selector: 'app-new-counterparty-form',
    imports: [
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule
    ],
  templateUrl: './new-counterparty-form.html',
  styleUrl: './new-counterparty-form.css',
})
export class NewCounterpartyForm {
    private fb = inject(NonNullableFormBuilder);
    counterpartyForm = this.fb.group({
        name: ['', Validators.required],
        legal_id: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
        address: ['', Validators.required],
        account: ['', Validators.nullValidator],
        bank: ['', Validators.nullValidator],
        bank_id: ['', Validators.nullValidator],

    });

    submited = output<Counterparty>();
    cancelled = output();


    onSubmit(): void {
        if (this.counterpartyForm.invalid) {
            this.counterpartyForm.markAllAsTouched();
            return;
        }
        const hasPaymentDetails = this.counterpartyForm.getRawValue().account.trim().length > 0;
        this.submited.emit( {
            id: 0,
            name: this.counterpartyForm.getRawValue().name,
            legal_id: this.counterpartyForm.getRawValue().legal_id,
            phone: this.counterpartyForm.getRawValue().phone,
            email: this.counterpartyForm.getRawValue().email,
            address: this.counterpartyForm.getRawValue().address,
            payment_details: !hasPaymentDetails ? null :
                {
                    account : this.counterpartyForm.getRawValue().account,
                    bank : this.counterpartyForm.getRawValue().bank,
                    bank_id : this.counterpartyForm.getRawValue().bank_id
                }
        } );
    }

    onCancel(): void {
        this.cancelled.emit();
    }

}
