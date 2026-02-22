import { Component, computed, Signal } from '@angular/core';
import { OwnerInfo, OwnerService } from '../../services/owner.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-main-navbar',
  imports: [MatToolbarModule],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css',
})
export class MainNavbar {
  private readonly default_string = "Light Inventory";
  protected readonly owner_info: Signal<OwnerInfo | undefined>;
  protected readonly owner_string = computed( 
    () => this.owner_info() === undefined 
    ? this.default_string 
    : this.owner_info()?.name + " - " + this.owner_info()?.division  
  );

  constructor(ownerService: OwnerService) {
    this.owner_info = toSignal(ownerService.getOwnerInfo());
  }
}
