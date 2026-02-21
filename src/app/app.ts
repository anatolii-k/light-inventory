import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerInfo, OwnerService } from '../services/owner.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainNavbar } from '../view/main-navbar/main-navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
