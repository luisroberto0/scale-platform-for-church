import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ScheduleTypeService } from '../../services/schedule-type.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  categories$ = new BehaviorSubject<any[]>([]);
  userRole!: string;
  editMode = false;
  currentCategoryId: string | null = null;
  scheduleTypes$;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private scheduleTypeService: ScheduleTypeService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      color: [''],
      scheduleType: ['', Validators.required]
    });
    this.getCaterories();
    this.scheduleTypes$ = this.scheduleTypeService.getScheduleTypes();
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

  getCaterories() {
    this.categoryService.getCategories().pipe(
      map((categories: any[]) => categories.sort((a, b) => a.order - b.order))
    ).subscribe((sortedCategories: any[]) => {
      this.categories$.next(sortedCategories);
    });
  }

  editCategory(category: any) {
    this.editMode = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      color: category.color,
      scheduleType: category.scheduleType
    });
  }

  async deleteCategory(id: string) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await this.categoryService.deleteCategory(id);
    }
  }

  addCategory() {
    if (this.categoryForm.valid) {
      if (this.editMode && this.currentCategoryId) {
        this.categoryService.updateCategory(this.currentCategoryId, this.categoryForm.value);
        this.toastr.success('Categoria atualizada com sucesso!');
        this.editMode = false;
        this.currentCategoryId = null;
      } else {
        this.categoryService.addCategory(this.categoryForm.value);
        this.toastr.success('Categoria adicionada com sucesso!');
      }
      this.categoryForm.reset();
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    const categories = this.categories$.getValue();
    moveItemInArray(categories, event.previousIndex, event.currentIndex);
    this.categories$.next([...categories]); // Update the observable with the new order
    await this.saveCategoryOrder(categories);
  }

  async saveCategoryOrder(categories: any[]) {
    for (const [index, category] of categories.entries()) {
      await this.categoryService.updateCategory(category.id, { order: index });
      this.toastr.success('Ordem das categorias salva com sucesso!');
    }
  }

  goBack() {
    window.history.back();
  }
}
