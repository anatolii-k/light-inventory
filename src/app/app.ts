import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerInfo, OwnerService } from '../services/owner.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly owner_info: Signal<OwnerInfo | undefined>;

  constructor(ownerService: OwnerService) {
    this.owner_info = toSignal(ownerService.getOwnerInfo());
  }}
