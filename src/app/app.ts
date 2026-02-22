import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerInfo, OwnerService } from '../services/owner.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainNavbar } from '../view/main-navbar/main-navbar';
import { MainTabs } from '../view/main-tabs/main-tabs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavbar, MainTabs],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
