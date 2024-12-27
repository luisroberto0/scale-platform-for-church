import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { canActivateGuard } from '../../guards/auth.guard';
import { ApiAuthService } from '../../services/api-auth.service';
import { AuthService } from '../../services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../material/material.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ScheduleTypeService } from '../../services/schedule-type.service';
import { ScheduleTypesComponent } from './schedule-types.component';

@NgModule({
  declarations: [
    ScheduleTypesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: ScheduleTypesComponent }]),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    { provide: 'canActivateGuard', useValue: canActivateGuard },
    AngularFireAuth,
    { provide: ScheduleTypeService, useClass: ScheduleTypeService },
    { provide: AuthService, useClass: ApiAuthService }
  ]
})
export class ScheduleModule { }
