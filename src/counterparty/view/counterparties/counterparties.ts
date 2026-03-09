import {Component, computed, inject, signal} from '@angular/core';
import {ErrorAlert} from "../../../common/view/error-alert/error-alert";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {toSignal} from "@angular/core/rxjs-interop";
import {CounterpartiesService, Counterparty} from "../../service/counterparties.service";
import {CounterpartiesList} from "../counterparties-list/counterparties-list";
import {NewCounterpartyForm} from "../new-counterparty-form/new-counterparty-form";

@Component({
  selector: 'app-counterparties',
    imports: [
        ErrorAlert,
        MatButton,
        MatIcon,
        CounterpartiesList,
        NewCounterpartyForm
    ],
  templateUrl: './counterparties.html',
  styleUrl: './counterparties.css',
})
export class Counterparties {
    private counterpartiesService = inject(CounterpartiesService);
    protected counterpartiesData = toSignal( this.counterpartiesService.getCounterparty() );
    protected counterpartiesList = computed( () => this.counterpartiesData()?.isOk ? this.counterpartiesData()?.data : []);

    protected isAddingNewCounterparty = signal<boolean>(false);

    onAddNewCounterparty(){
        this.isAddingNewCounterparty.set( true );
    }

    onCancelAddNewCounterparty() {
        this.isAddingNewCounterparty.set(false);
    }
    onSubmitNewCounterparty(data: Counterparty) {
        this.counterpartiesService.addCounterparty(data);
        this.isAddingNewCounterparty.set(false);
    }

    onReload() {
        this.counterpartiesService.reloadData();
    }

}
