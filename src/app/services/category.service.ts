export abstract class CategoryService {
  abstract getCategories(): any;
  abstract addCategory(category: any): any;
  abstract deleteCategory(id: string): Promise<void>;
  abstract updateCategory(id: string, category: any): Promise<void>;
  abstract getScaleTypes(): any;
  abstract getCategoriesByScheduleType(scheduleTypeId: string): any;
  abstract getCategory(id: string): any;
}
