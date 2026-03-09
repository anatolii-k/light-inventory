import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
