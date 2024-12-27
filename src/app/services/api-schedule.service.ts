import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { ScheduleService } from './schedule.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiScheduleService implements ScheduleService {
  constructor(private firestore: Firestore) {}

  getSchedules(scheduleTypeId?: string) {
    const schedulesCollection = collection(this.firestore, 'schedules');
    if (scheduleTypeId) {
      const q = query(schedulesCollection, where('scheduleType', '==', scheduleTypeId));
      return collectionData(q, { idField: 'id' }).pipe(
        map((schedules: any[]) => {
          console.log('Fetched schedules with type:', schedules); // Add logging
          return schedules;
        })
      );
    }

    return collectionData(schedulesCollection, { idField: 'id' }).pipe(
      map((schedules: any[]) => {
        console.log('Fetched all schedules:', schedules); // Add logging
        return schedules;
      })
    );
  }

  getApprovedSchedules(scheduleTypeId?: string) {
    const schedulesCollection = collection(this.firestore, 'schedules');
    let q;
    if (scheduleTypeId) {
      q = query(schedulesCollection, where('scheduleType', '==', scheduleTypeId), where('approved', '==', true));
    } else {
      q = query(schedulesCollection, where('approved', '==', true));
    }
    return collectionData(q, { idField: 'id' }).pipe(
      map((schedules: any[]) => {
        console.log('Fetched approved schedules:', schedules); // Add logging
        return schedules;
      })
    );
  }

  addSchedule(schedule: any) {
    const schedulesCollection = collection(this.firestore, 'schedules');
    return from(addDoc(schedulesCollection, {...schedule}));
  }

  deleteSchedule(scheduleId: string) {
    const scheduleDoc = doc(this.firestore, `schedules/${scheduleId}`);
    return from(deleteDoc(scheduleDoc));
  }

  updateSchedule(scheduleId: string, schedule: any) {
    const scheduleDoc = doc(this.firestore, `schedules/${scheduleId}`);
    return from(updateDoc(scheduleDoc, schedule));
  }

  confirmSchedule(scheduleId: string, confirmed: boolean) {
    const scheduleDoc = doc(this.firestore, `schedules/${scheduleId}`);
    return from(updateDoc(scheduleDoc, { confirmed }));
  }

  approveSchedule(scheduleId: string, confirmed: boolean, approved: boolean) {
    const scheduleDoc = doc(this.firestore, `schedules/${scheduleId}`);
    return from(updateDoc(scheduleDoc, { confirmed, approved }));
  }
}
