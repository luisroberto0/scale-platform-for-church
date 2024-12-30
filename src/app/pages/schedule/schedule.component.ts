import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '../../services/schedule.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduleTypeService } from '../../services/schedule-type.service';
import { ToastrService } from 'ngx-toastr';

interface Schedule {
  id: string;
  date: string;
  userId: string;
  category: string;
  notes?: string;
  confirmed: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit {
  schedules$ = new BehaviorSubject<Schedule[]>([]);
  categories$!: Observable<any>;
  userRole!: string;
  userNames: { [key: string]: BehaviorSubject<string> } = {};
  currentUserId: string | null = null;
  scheduleTypes$;
  userScheduleType: string | undefined = undefined;  // Changed from null to undefined
  selectedScheduleType: any | undefined = undefined;

  constructor(
    private scheduleService: ScheduleService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private scheduleTypeService: ScheduleTypeService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();

    this.authService.getUser().subscribe((user: any) => {
      if (user && (user.role === 'viewer' || user.role === 'publisher' || user.role === 'admin')) {
        // Convert null to undefined if no scheduleTypeId exists
        this.userScheduleType = user.scheduleTypeId || undefined;
        this.selectedScheduleType = this.userScheduleType;
        this.loadSchedules(this.userScheduleType);
      }
      // else {
      //   this.schedules$ = this.scheduleService.getSchedules(this.userScheduleType).pipe(
      //     map((schedules: Schedule[]) => {
      //       const now = new Date();
      //       const past15Days = new Date(now.setDate(now.getDate() - 15));
      //       const future30Days = new Date(now.setDate(now.getDate() + 45)); // 15 + 30 days

      //       return schedules
      //         .filter((schedule: Schedule) => {
      //           const scheduleDate = new Date(schedule.date);
      //           return scheduleDate >= past15Days && scheduleDate <= future30Days;
      //         })
      //         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      //     })
      //   );
      //   this.categories$ = this.categoryService.getCategories();
      // }
    });
  }

  loadSchedules(scheduleTypeId?: string) {
    this.scheduleService.getApprovedSchedules(scheduleTypeId).pipe(
      map((schedules: Schedule[]) => {
        const now = new Date();
        const past15Days = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
        const future30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        console.log('Current date:', now);
        console.log('Past 15 days date:', past15Days);
        console.log('Future 30 days date:', future30Days);

        const sch = schedules
          .filter((schedule: Schedule) => {
            const scheduleDate = new Date(schedule.date);
            console.log('Schedule date:', scheduleDate, 'Original date:', schedule.date);
            return scheduleDate >= past15Days && scheduleDate <= future30Days;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        console.log('Filtered and sorted schedules:', sch); // Add logging
        return sch;
      })
    ).subscribe((schedules: Schedule[]) => {
      console.log('Loaded schedules:', schedules); // Add logging
      this.schedules$.next(schedules);
      this.cdr.markForCheck(); // Mark for check instead of detect changes
    });

    if (scheduleTypeId) {
      this.categories$ = this.categoryService.getCategoriesByScheduleType(scheduleTypeId).pipe(
        map((categories: any[]) => categories.sort((a, b) => a.order - b.order))
      );
    } else {
      this.categories$ = this.categoryService.getCategories().pipe(
        map((categories: any[]) => categories.sort((a, b) => a.order - b.order))
      );
    }
  }

  onScheduleTypeChange(event: any) {
    this.selectedScheduleType = event.value; // Update selectedScheduleType
    this.loadSchedules(this.selectedScheduleType.id);
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: { role: string; email: string; } | null) => {
      if (user && user.role) {
        this.userRole = user.role;
        this.currentUserId = user.email;
        if (this.userRole !== 'publisher' && this.userRole !== 'viewer' && this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  openScheduleForm(schedule?: any) {
    if (this.userRole !== 'viewer') {
      debugger;
      const dialogRef = this.dialog.open(ScheduleFormComponent, {
        data: schedule
      });

      dialogRef.afterClosed().subscribe(() => {
        this.loadSchedules(this.selectedScheduleType.id); // Reload schedules after closing the form
      });
    }
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

  getCategoryNames = (categories: any[]): string[] => {
    return categories?.map(category => category.name);
  }

  getColumnNames = (categories: any[]): string[] => {
    if (!categories) {
      return [];
    }
    return ['date', ...this.getCategoryNames(categories)];
  }

  groupSchedulesByDate(schedules: any[]): any[] {
    const grouped = schedules.reduce((acc, schedule) => {
      const date = schedule.date.split('T')[0]; // Assuming date is in ISO format
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {});

    return Object.keys(grouped).map(date => ({ date, schedules: grouped[date] }));
  }

  deleteSchedule(scheduleId: string) {
    this.scheduleService.deleteSchedule(scheduleId).subscribe(() => {
      this.toastr.success('Usuário removido com sucesso!');
      this.loadSchedules(this.selectedScheduleType.id); // Reload schedules after deletion
    });
  }

  confirmSchedule(scheduleId: string, confirmed: boolean) {
    if (confirmed) {
      this.scheduleService.confirmSchedule(scheduleId, confirmed).subscribe(() => {
        this.toastr.success('Usuário confirmado com sucesso!');
        this.loadSchedules(this.selectedScheduleType.id); // Reload schedules after confirmation
      });
    } else {
      this.deleteSchedule(scheduleId);
    }
  }

  goBack() {
    window.history.back();
  }

  isFutureDate(date: string): boolean {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate >= currentDate;
  }
}
