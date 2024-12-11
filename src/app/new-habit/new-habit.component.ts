import { Component, Output, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Habit } from '../habit';

@Component({
  selector: 'app-new-habit',
  imports: [ReactiveFormsModule],
  templateUrl: './new-habit.component.html',
  styleUrl: './new-habit.component.css',
})
export class NewHabitComponent {
  @Output() newHabitEvent = new EventEmitter<any>();
  @Output() cancelNewHabitEvent = new EventEmitter<any>();

  validateForm!: FormGroup;
  mysql = require('mysql2/promise');
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      habitName: ['', [Validators.required]],
      goal: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form Submitted:', this.validateForm.value);
      console.log(this.validateForm.get('habitName')?.value);
      this.newHabitEvent.emit({
        name: this.validateForm.get('habitName')?.value,
        tracking_successes: [],
        start_date: new Date().toISOString().split('T')[0],
        goal: this.validateForm.get('goal')?.value,
      });
      this.addHabit(this.validateForm.value.habit_name, this.validateForm.value.goal)
    } else {
      console.error('Form is invalid!');
    }
  }

  addHabit(name, goal) {
    const pool = this.mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'habitsql'
    });
  
    try {
      const connection = pool.getConnection();
  
      const [result] = connection.query('INSERT INTO habits (habit_name, goal) VALUES (?, ?)', [name, goal]);
  
      console.log('User added successfully:', result.insertId);
      connection.release();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      pool.end();
    }
  }

  cancelNewHabit(): void {
    this.cancelNewHabitEvent.emit('new habit cancelled');
  }
}
