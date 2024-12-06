import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-menu',
  imports: [],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css',
})
export class AccountMenuComponent {
  @Output() logOutEvent = new EventEmitter<any>();
  @Output() deleteAccountEvent = new EventEmitter<any>();

  handleLogOut(): void {
    this.logOutEvent.emit();
  }

  handleDeleteAccount(): void {
    this.deleteAccountEvent.emit();
  }
}
