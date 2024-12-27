import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ScheduleTypeService } from '../../services/schedule-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { BulkImportDialogComponent } from './bulk-import-dialog/bulk-import-dialog.component';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  users$: Observable<any[]>;
  categories$;
  userRole!: string;
  editingUser: any = null;
  scheduleTypes$;
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private categoryService: CategoryService,
    private scheduleTypeService: ScheduleTypeService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      role: ['', Validators.required],
      category: [''],
      scheduleTypeId: ['']
    });
    this.users$ = this.userService.getUsers().pipe(
      map(users => users || []) // Transform null to empty array
    );
    this.categories$ = this.categoryService.getCategories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: { role: string; } | null) => {
      if (user && user.role) { // Add null check for user
        this.userRole = user.role;
        if (this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private async createUserWithoutSignIn(email: string, password: string) {
    const currentAuth = getAuth();
    const currentUser = currentAuth.currentUser;

    // Create a new auth instance
    const secondaryAuth = getAuth();

    try {
      // Create the new user
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      return userCredential;
    } finally {
      // Make sure we're signed in as the original user
      await secondaryAuth.updateCurrentUser(currentUser);
    }
  }

  addUser() {
    if (this.userForm.valid) {
      const { email, name, role, category } = this.userForm.value;
      this.createUserWithoutSignIn(email, '123456')
        .then((userCredential) => {
          this.toastr.success('Usuário criado com sucesso!');
          const uid = userCredential.user?.uid;
          if (uid && email && name && role) {
            this.userService.addUser({ uid, email, name, role, category });
            this.afAuth.sendPasswordResetEmail(email); // Send password reset email
            this.userForm.reset();
          } else {
            throw new Error('Missing required user fields');
          }
        })
        .catch(error => {
          console.log(error);
          if (error.message.includes('The email address is already in use by another account.')) { // Check if the error message contains the phrase

            this.userService.getUserName(email).subscribe(use => {
              if (use) {
                alert(`O usuário com e-mail ${email} já existe`);
              } else {
                this.userService.addUser({ email, name, role, category });
                this.afAuth.sendPasswordResetEmail(email); // Send password reset email
                this.router.navigate(['/users']);
              }
            });
          } else {
            console.error('Error creating user:', error);
            this.toastr.error('Erro ao criar usuário: ' + error);
          }
        });
    }
  }

  openUserDialog(user: any = null): void {
    if (user) {
      this.editingUser = user;
      this.userForm.patchValue({
        email: user.email,
        name: user.name,
        role: user.role,
        category: user.category,
        scheduleTypeId: user.scheduleTypeId
      });
    } else {
      this.editingUser = null;
      this.userForm.reset();
    }

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: {
        userForm: this.userForm,
        editingUser: this.editingUser,
        categories$: this.categories$,
        scheduleTypes$: this.scheduleTypes$
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.editingUser) {
          this.userService.editUser(result.email, result)
            .then(() => {
              this.toastr.success('Usuário atualizado com sucesso!');
              this.userForm.reset();
              this.editingUser = null;
            })
            .catch(error => {
              this.toastr.error('Erro ao atualizar usuário: ' + error);
            });
        } else {
          this.addUser();
        }
      }
    });
  }

  editUser(user: any) {
    this.openUserDialog(user);
  }

  resetPassword(email: string) {
    this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.toastr.success('E-mail de redefinição de senha enviado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao enviar e-mail de redefinição:', error);
        this.toastr.error('Erro ao enviar e-mail de redefinição de senha.');
      });
  }

  submitForm() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.editingUser) {
        // Update existing user
        this.userService.editUser(userData.email, userData)
          .then(() => {
            this.toastr.success('Usuário atualizado com sucesso!');
            this.userForm.reset();
            this.editingUser = null;
          })
          .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            this.toastr.error('Erro ao atualizar usuário: ' + error);
          });
      } else {
        // Add new user (existing addUser logic)
        this.addUser();
      }
    }
  }

  goBack() {
    window.history.back();
  }

  getRoleName(role: string): string {
    const roles: any = {
      admin: 'Administrator',
      viewer: 'Cooperador/Escalado',
      publisher: 'Coordenador de Escalas'
    };
    return roles[role] || 'Unknown';
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o usuário ${user.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.email)
          .then(() => {
            this.toastr.success('Usuário excluído com sucesso!');
          })
          .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            this.toastr.error('Erro ao excluir usuário: ' + error);
          });
      }
    });
  }

  openBulkImportDialog(): void {
    const dialogRef = this.dialog.open(BulkImportDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processBulkImport(result);
      }
    });
  }

  private async processBulkImport(users: Array<{name: string, email: string}>) {
    for (const user of users) {
      try {
        const userCredential = await this.createUserWithoutSignIn(user.email, '123456');
        if (userCredential.user) {
          await this.userService.addUser({
            uid: userCredential.user.uid,
            email: user.email,
            name: user.name,
            role: 'viewer',
            category: ''
          });
          await this.afAuth.sendPasswordResetEmail(user.email);
        }
      } catch (error: any) {
        if (error.message.includes('already in use')) {
          // If user exists in auth but not in Firestore, add to Firestore
          await this.userService.addUser({
            email: user.email,
            name: user.name,
            role: 'viewer',
            category: ''
          });
        } else {
          console.error(`Error adding user ${user.email}:`, error);
          this.toastr.error(`Erro ao adicionar usuário ${user.email}`);
        }
      }
    }
    this.toastr.success('Importação concluída!');
  }
}
