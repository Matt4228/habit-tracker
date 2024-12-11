import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validateForm!: FormGroup;
  mysql = require('mysql2/promise');
  @Output() login = new EventEmitter<any>();
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
      if(this.userCheck(this.validateForm.value.username, this.validateForm.value.password) != null){
        this.login.emit()
        this.router.navigate(['/']);
      }
      console.error('This user already exists!');
    } else {
      console.error('Form is invalid!');
    }
  }

  userCheck(username, password) {
        const pool = this.mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '0000',
        database: 'habitsql'
    });
    let match = null;
    try {
      const connection = pool.getConnection();
      const [rows] = connection.query('SELECT * FROM your_table WHERE field1 = ? AND field2 = ?', [username, password]);
  
      if (rows.length > 0) {
        console.log('Fields match!');
        match = rows[0].user_id;
        connection.release();
      }

    } catch (error) {
      console.error('Error querying database:', error);
    } finally {
      pool.end();
      return match;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
