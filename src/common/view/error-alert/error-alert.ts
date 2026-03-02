import { Component, input } from '@angular/core';
import { UserError } from '../../service/user-error';

@Component({
  selector: 'app-error-alert',
  imports: [],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.css',
})
export class ErrorAlert {
  userError = input<UserError>();
}
