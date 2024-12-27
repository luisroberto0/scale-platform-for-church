import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, deleteDoc, doc, updateDoc, query, where, docData } from '@angular/fire/firestore';
import { CategoryService } from './category.service';
import { map, Observable } from 'rxjs';
// import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService implements CategoryService{
  constructor(private firestore: Firestore) {}

  getCategories() {
    const categoriesCollection = collection(this.firestore, 'categories');
    return collectionData(categoriesCollection, { idField: 'id' });
  }

  addCategory(category: any) {
    const categoriesCollection = collection(this.firestore, 'categories');
    return addDoc(categoriesCollection, category);
  }

  async deleteCategory(id: string) {
    const docRef = doc(this.firestore, 'categories', id);
    return deleteDoc(docRef);
  }

  async updateCategory(id: string, category: any) {
    const docRef = doc(this.firestore, 'categories', id);
    return updateDoc(docRef, category);
  }

  getScaleTypes() {
    const scaleTypesCollection = collection(this.firestore, 'scaleTypes');
    return collectionData(scaleTypesCollection, { idField: 'id' });
  }

  getCategoriesByScheduleType(scheduleTypeId: string) {
    const categoriesCollection = collection(this.firestore, 'categories');
    const q = query(categoriesCollection, where('scheduleType', '==', scheduleTypeId));
    return collectionData(q, { idField: 'id' });
  }

  getCategory(id: string): Observable<string> {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return docData(categoryDoc).pipe(
      map((category: any) => category)
    );
  }
}
