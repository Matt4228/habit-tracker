import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHabitComponent } from './new-habit.component';

describe('NewHabitComponent', () => {
  let component: NewHabitComponent;
  let fixture: ComponentFixture<NewHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHabitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
