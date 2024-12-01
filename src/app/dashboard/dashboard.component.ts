import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../habit';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  today = new Date();
  d = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  month = this.d.toLocaleString('default', { month: 'long' });
  year = this.d.getFullYear();
  shownDate = this.month + ', ' + this.year;
  numDays = new Date(this.d.getFullYear(), this.d.getMonth() + 1, 0).getDate();
  daysInMonth = Array.from({ length: this.numDays }, (_, i) => i + 1);
  weekDaysInMonth = Array.from({ length: this.numDays }, (_, i) => {
    const date = new Date(this.d.getFullYear(), this.d.getMonth(), i + 1);
    return date.toLocaleString('default', { weekday: 'short' }).charAt(0); // Get the first letter of the weekday
  });

  // Habit data using the new structure
  habits: Habit[] = [
    {
      name: 'Drink Water',
      tracking_successes: ['2024-12-04'],
      start_date: this.d.toISOString().split('T')[0],
      goal: 20,
    },
    {
      name: 'Exercise',
      tracking_successes: ['2024-12-04', '2024-12-05'],
      start_date: this.d.toISOString().split('T')[0],
      goal: 15,
    },
  ];

  ngOnInit(): void {
    // Any additional initialization logic can go here
  }

  // Method to toggle success for a specific day
  toggleSuccess(habit: Habit, day: number): void {
    const date = new Date(this.d.getFullYear(), this.d.getMonth(), day)
      .toISOString()
      .split('T')[0];
    const index = habit.tracking_successes.indexOf(date);

    if (index === -1) {
      habit.tracking_successes.push(date); // Mark success
    } else {
      habit.tracking_successes.splice(index, 1); // Remove success
    }
    console.log(this.habits);
  }

  // Method to calculate progress for a habit
  calculateProgress(habit: Habit): number {
    return habit.tracking_successes.length;
  }

  // Check if a day is marked successful
  isDaySuccessful(habit: Habit, day: number): boolean {
    const date = new Date(this.d.getFullYear(), this.d.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return habit.tracking_successes.includes(date);
  }

  decMonth() {
    this.d.setMonth(this.d.getMonth() - 1);
    this.month = this.d.toLocaleString('default', { month: 'long' });
    this.year = this.d.getFullYear();
    this.shownDate = this.month + ', ' + this.year;
    this.numDays = new Date(
      this.d.getFullYear(),
      this.d.getMonth() + 1,
      0
    ).getDate();
    this.daysInMonth = Array.from({ length: this.numDays }, (_, i) => i + 1);
    this.weekDaysInMonth = Array.from({ length: this.numDays }, (_, i) => {
      const date = new Date(this.d.getFullYear(), this.d.getMonth(), i + 1);
      return date.toLocaleString('default', { weekday: 'short' }).charAt(0); // Get the first letter of the weekday
    });
  }

  incMonth() {
    this.d.setMonth(this.d.getMonth() + 1);
    this.month = this.d.toLocaleString('default', { month: 'long' });
    this.year = this.d.getFullYear();
    this.shownDate = this.month + ', ' + this.year;
    this.numDays = new Date(
      this.d.getFullYear(),
      this.d.getMonth() + 1,
      0
    ).getDate();
    this.daysInMonth = Array.from({ length: this.numDays }, (_, i) => i + 1);
    this.weekDaysInMonth = Array.from({ length: this.numDays }, (_, i) => {
      const date = new Date(this.d.getFullYear(), this.d.getMonth(), i + 1);
      return date.toLocaleString('default', { weekday: 'short' }).charAt(0); // Get the first letter of the weekday
    });
  }
}
