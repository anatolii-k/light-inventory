import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerInfo, OwnerService } from '../owner/service/owner.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainNavbar } from '../main/view/main-navbar/main-navbar';
import { MainTabs } from '../main/view/main-tabs/main-tabs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavbar, MainTabs],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
