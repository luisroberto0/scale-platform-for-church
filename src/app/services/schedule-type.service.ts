
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ScheduleTypeService {
  constructor(private firestore: Firestore) {}

  getScheduleTypes() {
    const scheduleTypesCollection = collection(this.firestore, 'scheduleTypes');
    return collectionData(scheduleTypesCollection, { idField: 'id' });
  }

  addScheduleType(scheduleType: any) {
    const scheduleTypesCollection = collection(this.firestore, 'scheduleTypes');
    return addDoc(scheduleTypesCollection, scheduleType);
  }

  deleteScheduleType(id: string) {
    const docRef = doc(this.firestore, 'scheduleTypes', id);
    return deleteDoc(docRef);
  }

  updateScheduleType(id: string, scheduleType: any) {
    const docRef = doc(this.firestore, 'scheduleTypes', id);
    return updateDoc(docRef, scheduleType);
  }
}
