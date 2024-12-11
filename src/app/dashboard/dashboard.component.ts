import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../habit';
import { NewHabitComponent } from '../new-habit/new-habit.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NewHabitComponent,
    HttpClientModule,
    NewHabitComponent,
    AccountMenuComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  mysql = require('mysql2/promise');
  user_id = null;
  handleEvent('login',user){
    this.user_id = user;
  };
  @Output() deleteAccountID = new EventEmitter<any>();
  displayNewHabit = false;
  displayAccountMenu = false;
  today = new Date();
  d = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  month = this.d.toLocaleString('default', { month: 'long' });
  year = this.d.getFullYear();
  shownDate = this.month + ', ' + this.year;
  numDays = new Date(this.d.getFullYear(), this.d.getMonth() + 1, 0).getDate();
  daysInMonth: number[] = Array.from({ length: this.numDays }, (_, i) => i + 1);
  weekDaysInMonth = Array.from({ length: this.numDays }, (_, i) => {
    const date = new Date(this.d.getFullYear(), this.d.getMonth(), i + 1);
    return date.toLocaleString('default', { weekday: 'short' }).charAt(0);
  });

  quote: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.populateDashboard();
    console.log('init');
  }

  populateDashboard(): void {
    this.fetchRandomQuote();
  }

  fetchRandomQuote(): void {
    console.log('getting quote!');
    this.http
      .get<any>('https://zenquotes.io/api/random')
      .subscribe((response) => {
        if (response && response.length > 0) {
          this.quote = '"' + response[0].q + '" - ' + response[0].a;
        }
      });
  }

  isToday(day: number | string): boolean {
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const dayNumber = typeof day === 'string' ? parseInt(day, 10) : day;

    return (
      day === todayDate &&
      this.d.getMonth() === todayMonth &&
      this.d.getFullYear() === todayYear
    );
  }

  // Habit data using the new structure. Placeholder for testing functionality.
  /*habits: Habit[] = [
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
  */

   // Habit data using the new structure
  habits: Habit[] = this.fetchHabits(this.user_id);

  fetchHabits(user_id) {
    const pool = this.mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'habitsql'
    });

    try {
        const connection = pool.getConnection();
        const [rows] = connection.query('SELECT * FROM habits WHERE user_id = ?', [user_id]);
        connection.release();

        const habits = rows.map(row => ({
            name: row.habit_name,
            tracking_successes: JSON.parse(row.successes),
            start_date: row.start_date.toISOString().split('T')[0],
            goal: row.goal
        }));

        return habits;

    } catch (error) {
        console.error('Error fetching habits:', error);
    } finally {
        pool.end();
    }
}

  

  // Method to toggle success for a specific day
  toggleSuccess(habit: Habit, day: number): void {
    const date = new Date(this.d.getFullYear(), this.d.getMonth(), day)
      .toISOString()
      .split('T')[0];
    const index = habit.tracking_successes.indexOf(date);

    if (index === -1) {
      habit.tracking_successes.push(date);
    } else {
      habit.tracking_successes.splice(index, 1);
    }
    this.updateHabits(habit.tracking_successes, this.user_id, habit.name)
    console.log(this.habits);
  }

  updateHabits(user_id, name, successes) {
    const pool = this.mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '0000',
      database: 'habitsql'
    });

    try {
        const connection = pool.getConnection();
        const [rows] = connection.query('UPDATE habits SET sucesses = ? WHERE user_id = ?, name = ?', [successes, user_id, name]);
        connection.release();

    } catch (error) {
        console.error('Error fetching habits:', error);
    } finally {
        pool.end();
    }
}

  // Method to calculate progress for a habit
  calculateProgress(habit: Habit): number {
    return habit.tracking_successes.filter((date) => {
      const successDate = new Date(date);
      return (
        successDate.getFullYear() === this.d.getFullYear() &&
        successDate.getMonth() === this.d.getMonth()
      );
    }).length;
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
      return date.toLocaleString('default', { weekday: 'short' }).charAt(0);
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
      return date.toLocaleString('default', { weekday: 'short' }).charAt(0);
    });
  }

  addHabit() {
    this.displayNewHabit = true;
  }

  createHabit(newHabit: Habit) {
    this.habits.push(newHabit);
    this.displayNewHabit = false;
  }

  cancelNewHabit() {
    this.displayNewHabit = false;
  }

  onProfileClick() {
    if (this.displayAccountMenu == false) {
      this.displayAccountMenu = true;
    } else {
      this.displayAccountMenu = false;
    }
  }

  logOut() {
    console.log('logout');
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    console.log('delete');
    this.router.navigate(['/login']);
  }
}

