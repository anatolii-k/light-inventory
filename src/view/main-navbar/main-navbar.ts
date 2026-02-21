import { Component, Signal } from '@angular/core';
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
  protected readonly owner_info: Signal<OwnerInfo | undefined>;

  constructor(ownerService: OwnerService) {
    this.owner_info = toSignal(ownerService.getOwnerInfo());
  }
}
