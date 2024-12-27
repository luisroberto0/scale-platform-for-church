
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { canActivateGuard } from '../../guards/auth.guard';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ApiAuthService } from '../../services/api-auth.service';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    { provide: 'canActivateGuard', useValue: canActivateGuard },
    AngularFireAuth,
    { provide: AuthService, useClass: ApiAuthService },
  ]
})
export class HomeModule { }
