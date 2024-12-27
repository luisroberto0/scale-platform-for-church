import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { CategoryService } from "../../../../services/category.service";
import { ScheduleTypeService } from "../../../../services/schedule-type.service";

@Component({
  selector: 'schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.css']
})
export class ScheduleDialogComponent {
  categories$!: Observable<any>;
  scheduleTypes$!: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private scheduleTypeService: ScheduleTypeService
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
