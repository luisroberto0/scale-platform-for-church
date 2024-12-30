import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export abstract class ScheduleService {
  abstract getSchedules(scheduleTypeId?: string): Observable<any>;

  abstract getApprovedSchedules(scheduleTypeId?: string): Observable<any>;

  abstract addSchedule(schedule: any): Observable<any>;

  abstract deleteSchedule(scheduleId: string): Observable<void>;

  abstract updateSchedule(scheduleId: string, schedule: any): Observable<void>;

  abstract confirmSchedule(scheduleId: string, confirmed: boolean): Observable<void>;

  abstract approveSchedule(scheduleId: string, confirmed: boolean, approved: boolean): Observable<void>;

  abstract checkExistingSchedule(userId: string, date: string): Observable<boolean>;
}
