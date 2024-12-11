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
  mysql = require('mysql2/promise');

  handleLogOut(): void {
    this.logOutEvent.emit();
  }

  handleDeleteAccount(): void {
    this.deleteAccountEvent.emit();
    deleteId.on('userDeletion', (user_id)) => {
      this.deleteUser(userId);
    };
  }

  deleteUser(userId) {
    const pool = this.mysql.createPool({
      host: 'your_host',
      user: 'your_user',
      password: 'your_password',
      database: 'your_database'
    });
  
    try {
      const connection = pool.getConnection();
      connection.query('DELETE FROM users WHERE id = ?', [userId]);
      connection.release();
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      pool.end();
    }
  }
}
