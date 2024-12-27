
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { ApiAuthService } from '../../services/api-auth.service';
import { CategoryService } from '../../services/category.service';
import { ApiCategoryService } from '../../services/api-category.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { canActivateGuard } from '../../guards/auth.guard';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: CategoriesComponent }]),
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    { provide: 'canActivateGuard', useValue: canActivateGuard },
    AngularFireAuth,
    { provide: CategoryService, useClass: ApiCategoryService },
    { provide: AuthService, useClass: ApiAuthService },
  ]
})
export class CategoriesModule { }
