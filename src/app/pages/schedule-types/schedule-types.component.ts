
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleTypeService } from '../../services/schedule-type.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule-types',
  templateUrl: './schedule-types.component.html',
  styleUrls: ['./schedule-types.component.css']
})
export class ScheduleTypesComponent implements OnInit {
  scheduleTypeForm: FormGroup;
  scheduleTypes$;
  userRole!: string;
  editMode = false;
  currentTypeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private scheduleTypeService: ScheduleTypeService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.scheduleTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: { role: string; } | null) => {
      if (user && user.role) {
        this.userRole = user.role;
        if (this.userRole !== 'publisher' && this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  editScheduleType(type: any) {
    this.editMode = true;
    this.currentTypeId = type.id;
    this.scheduleTypeForm.patchValue({
      name: type.name,
      description: type.description
    });
  }

  async deleteScheduleType(id: string) {
    if (confirm('Tem certeza que deseja excluir este tipo de escala?')) {
      await this.scheduleTypeService.deleteScheduleType(id);
    }
  }

  addScheduleType() {
    if (this.scheduleTypeForm.valid) {
      if (this.editMode && this.currentTypeId) {
        this.scheduleTypeService.updateScheduleType(this.currentTypeId, this.scheduleTypeForm.value);
        this.toastr.success('Tipo de escala atualizado com sucesso!');
        this.editMode = false;
        this.currentTypeId = null;
      } else {
        this.scheduleTypeService.addScheduleType(this.scheduleTypeForm.value);
        this.toastr.success('Tipo de escalas adicionado com sucesso!');
      }
      this.scheduleTypeForm.reset();
    }
  }

  goBack() {
    window.history.back();
  }
}
