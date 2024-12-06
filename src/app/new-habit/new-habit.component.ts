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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      habitName: ['', [Validators.required]],
      goal: ['', [Validators.required]],
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
    } else {
      console.error('Form is invalid!');
    }
  }

  cancelNewHabit(): void {
    this.cancelNewHabitEvent.emit('new habit cancelled');
  }
}
