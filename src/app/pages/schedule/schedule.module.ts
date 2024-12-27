import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { canActivateGuard } from '../../guards/auth.guard';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiScheduleService } from '../../services/api-schedule.service';
import { ApiUserService } from '../../services/api-user.service';
import { AuthService } from '../../services/auth.service';
import { ScheduleService } from '../../services/schedule.service';
import { UserService } from '../../services/user.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { ApiCategoryService } from '../../services/api-category.service';
import { MaterialModule } from '../material/material.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GroupSchedulesPipe } from './group-schedules.pipe';
import { CalendarSchedulerComponent } from './calendar-scheduler/calendar-scheduler.component';
import { ScheduleDialogComponent } from './calendar-scheduler/dialog/schedule-dialog.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleFormComponent,
    CalendarSchedulerComponent,
    ScheduleDialogComponent,
    GroupSchedulesPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: ScheduleComponent,  }, { path: 'calendar', component: CalendarSchedulerComponent } ]),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    { provide: 'canActivateGuard', useValue: canActivateGuard },
    AngularFireAuth,
    { provide: ScheduleService, useClass: ApiScheduleService },
    { provide: AuthService, useClass: ApiAuthService },
    { provide: UserService, useClass: ApiUserService },
    { provide: CategoryService, useClass: ApiCategoryService }
  ]
})
export class ScheduleModule { }
