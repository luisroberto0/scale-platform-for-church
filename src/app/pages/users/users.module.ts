import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { canActivateGuard } from '../../guards/auth.guard';
import { UserService } from '../../services/user.service';
import { ApiUserService } from '../../services/api-user.service';
import { AuthService } from '../../services/auth.service';
import { ApiAuthService } from '../../services/api-auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../services/category.service';
import { ApiCategoryService } from '../../services/api-category.service';
import { MaterialModule } from '../material/material.module';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { getAuth } from 'firebase/auth';
import { BulkImportDialogComponent } from './bulk-import-dialog/bulk-import-dialog.component';

@NgModule({
  declarations: [UsersComponent, UserFormDialogComponent, BulkImportDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: UsersComponent }]),

  ],
  providers: [
    { provide: 'canActivateGuard', useValue: canActivateGuard },
    AngularFireAuth,
    { provide: UserService, useClass: ApiUserService },
    { provide: AuthService, useClass: ApiAuthService },
    { provide: CategoryService, useClass: ApiCategoryService },
  ]
})
export class UsersModule { }
