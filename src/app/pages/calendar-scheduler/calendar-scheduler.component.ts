
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '../../../services/schedule.service';
import { CategoryService } from '../../../services/category.service';
import { ScheduleTypeService } from '../../../services/schedule-type.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-scheduler',
  templateUrl: './calendar-scheduler.component.html',
  styleUrls: ['./calendar-scheduler.component.css']
})
export class CalendarSchedulerComponent implements OnInit {
  scheduleForm: FormGroup;
  categories$!: Observable<any>;
  scheduleTypes$!: Observable<any>;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private categoryService: CategoryService,
    private scheduleTypeService: ScheduleTypeService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      scheduleTypeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
    this.authService.getUser().subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  submitForm() {
    if (this.scheduleForm.valid) {
      const scheduleData = {
        ...this.scheduleForm.value,
        userId: this.currentUser.email,
        confirmed: false
      };
      this.scheduleService.addSchedule(scheduleData).subscribe(() => {
        this.scheduleForm.reset();
      });
    }
  }
}
