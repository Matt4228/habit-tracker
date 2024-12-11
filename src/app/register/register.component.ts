import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  validateForm!: FormGroup;
  mysql = require('mysql2/promise');
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form Submitted:', this.validateForm.value);
      let userId = this.addUser(this.validateForm.value.username, this.validateForm.value.password)
      this.router.navigate(['/']);
    } else {
      console.error('Form is invalid!');
    }
  }

  addUser(username, password) {
    const pool = this.mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'habitsql'
    });
    let user_id = null
    try {
      const connection = pool.getConnection();

      const [result] = connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      user_id = connection.query('SELECT user_id FROM users WHER (username = ?, password = ?)', [username, password]);
      console.log('User added successfully:', result.insertId);
      connection.release();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      pool.end();
      return user_id
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
