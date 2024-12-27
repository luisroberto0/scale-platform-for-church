import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduleService } from '../../../services/schedule.service';
import { UserService } from '../../../services/user.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ScheduleTypeService } from '../../../services/schedule-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm: FormGroup;
  users$;
  categories$;
  scheduleTypes$; // Add this line
  userRole!: string;
  isEditing = false;
  scheduleId: string = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private userService: UserService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<ScheduleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private scheduleTypeService: ScheduleTypeService,
    private toastr: ToastrService
  ) {
    this.users$ = this.userService.getUsers();
    this.categories$ = this.categoryService.getCategories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes(); // Add this line
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      userId: ['', Validators.required],
      notes: [''],
      confirmed: [false],
      approved: [true],
      scheduleType: ['', Validators.required]
    });

    if (data) {
      this.isEditing = true;
      this.scheduleId = data.id;
      this.scheduleForm.patchValue({
        date: data.date.split('T')[0],
        category: data.category,
        userId: data.userId,
        notes: data.notes,
        confirmed: data.confirmed,
        scheduleType: data.scheduleType
      });
    }
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: { role: string; } | null) => {
      if (user && user.role) { // Add null check for user
        this.userRole = user.role;
        if (this.userRole !== 'publisher' && this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  addSchedule() {
    if (this.scheduleForm.valid) {
      const selectedDate = new Date(this.scheduleForm.value.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set current date time to midnight for comparison

      if (selectedDate < currentDate) {
        this.toastr.error('A data deve ser uma data futura.');
        return;
      }

      if (this.isEditing) {
        this.scheduleService.updateSchedule(this.scheduleId, this.scheduleForm.value).subscribe(() => {
          this.toastr.success('Escala atualizada com sucesso!');
        }, (error) => { this.toastr.error('Error updating schedule: ' + error); });
      } else {
        this.scheduleService.addSchedule(this.scheduleForm.value).subscribe(() => {
          this.toastr.success('Escala adicionada com sucesso!');
        }, (error) => { this.toastr.error('Error updating schedule: ' + error); });
      }
      this.scheduleForm.reset();
      this.dialogRef.close();
    }
  }
}
