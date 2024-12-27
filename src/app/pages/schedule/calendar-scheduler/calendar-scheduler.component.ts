import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from '../../../services/schedule.service';
import { CategoryService } from '../../../services/category.service';
import { ScheduleTypeService } from '../../../services/schedule-type.service';
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ScheduleDialogComponent } from './dialog/schedule-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  events: any[] = [];
  selectedEvents: any[] = [];
  selectedDate!: Date;
  currentMonth: Date = new Date();
  userNames: { [key: string]: BehaviorSubject<string> } = {};
  categoryObj: { [key: string]: BehaviorSubject<any> } = {};
  userRole: string | undefined = undefined;
  isDivVisible = false;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private categoryService: CategoryService,
    private scheduleTypeService: ScheduleTypeService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      scheduleType: ['', Validators.required],
      notes: [''],
      confirmed: [true],
      approved: [this.userRole !== 'publisher' ? false : true]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
    this.authService.getUser().subscribe((user: any) => {

      if (user && user.role) {
        this.userRole = user.role;
        this.currentUser = user;
        if (this.userRole !== 'publisher' && this.userRole !== 'viewer' && this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
    this.loadSchedules();
  }

  loadSchedules(scheduleTypeId?: string) {
    this.scheduleService.getSchedules(scheduleTypeId).subscribe((data: any) => {
      this.events = data;
    });
  }

  openDialog(date: Date): void {
    this.scheduleForm.patchValue({ date });
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '250px',
      data: { form: this.scheduleForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitForm();
      }
    });
  }

  submitForm() {
    const selectedDate = new Date(this.scheduleForm.value.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date time to midnight for comparison

    if (selectedDate < currentDate) {
      this.toastr.error('A data deve ser uma data futura.');
      return;
    }
    console.log(this.formatDate(this.scheduleForm.value.date));
    if (this.scheduleForm.valid) {
      const scheduleData = {
        ...this.scheduleForm.value,
        date: this.formatDate(this.scheduleForm.value.date),
        userId: this.currentUser.email,
        confirmed: true,
        approved: this.userRole !== 'publisher' ? false : true
      };
      this.scheduleService.addSchedule(scheduleData).subscribe(() => {
        this.toastr.success('Usuário adicionado com sucesso!');
        this.scheduleForm.reset();
        this.loadSchedules();
      });
    }
  }

  isFutureDate(date: Date): boolean {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date time to midnight for comparison

    if (selectedDate < currentDate) {
      return false;
    }
    return true;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  getDaysInMonth(): Date[] {
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const days: Date[] = [];
    while (date.getMonth() === this.currentMonth.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  isEventDate(date: Date): boolean {
    const dateString = date.toISOString().split('T')[0];
    return this.events.some(event => event.date === dateString);
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
  }

  getUserName(userId: string): BehaviorSubject<string> {
    if (!this.userNames[userId]) {
      this.userNames[userId] = new BehaviorSubject<string>('');
      this.userService.getUserName(userId).subscribe(name => {
        this.userNames[userId].next(name);
      });
    }
    return this.userNames[userId];
  }

  getCategoryNames(id: string): BehaviorSubject<any> {
    if (!this.categoryObj[id]) {
      this.categoryObj[id] = new BehaviorSubject<any>('');
      this.categoryService.getCategory(id).subscribe((category: any) => {
        this.categoryObj[id].next(category);
      });
    }
    return this.categoryObj[id];
  }

  openEventsDialog(events: any[], day: any): void {
    this.selectedDate = day;
    this.selectedEvents = events;
    this.isDivVisible = true; // Tornar a div visível
  }

  closeEventsDialog(): void {
    this.isDivVisible = false; // Tornar a div invisível
  }

  isEventOnSelectedDate(event: any, selectedDate: Date): boolean {
    const eventDate = parseEventDate(event.date); // Converte para objeto Date
    return isSameDate(eventDate, selectedDate);
  }

  getFormattedMonthYear(): string {
    return this.currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  getWeekdayAbbreviation(date: Date): string {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  }

  deleteSchedule(scheduleId: string) {
    this.scheduleService.deleteSchedule(scheduleId).subscribe(() => {
      this.toastr.success('Usuário excluído com sucesso!');
      this.closeEventsDialog(); // Fecha o dialog após a exclusão
      if (this.currentUser) {
        this.loadSchedules(); // Reload schedules after deletion
      }
    });
  }

  confirmSchedule(scheduleId: string, confirmed: boolean) {
    if (confirmed) {
      this.scheduleService.confirmSchedule(scheduleId, confirmed).subscribe(() => {
        this.toastr.success('Usuário confirmado com sucesso!');
        this.closeEventsDialog(); // Fecha o dialog após a exclusão
        this.loadSchedules(); // Reload schedules after confirmation
      });
    } else {
      this.deleteSchedule(scheduleId);
    }
  }

  approveSchedule(scheduleId: string, confirmed: boolean, approved: boolean) {
    if (confirmed && approved) {
      this.scheduleService.approveSchedule(scheduleId, confirmed, approved).subscribe(() => {
        this.toastr.success('Usuário aprovado com sucesso!');
        this.closeEventsDialog(); // Fecha o dialog após a exclusão
        this.loadSchedules(); // Reload schedules after approval
      });
    } else {
      this.deleteSchedule(scheduleId);
    }
  }

  goBack() {
    window.history.back();
  }
}

const parseEventDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)); // Ajusta o mês (base 0)
};

const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isSameDate = (date1: Date, date2: Date): boolean => {
  const normalizedDate1 = normalizeDate(date1);
  const normalizedDate2 = normalizeDate(date2);
  return normalizedDate1.getTime() === normalizedDate2.getTime();
};


