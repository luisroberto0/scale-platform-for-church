
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupSchedules'
})
export class GroupSchedulesPipe implements PipeTransform {
  transform(schedules: any[]): any[] {
    if (!schedules) {
      return [];
    }
    const grouped = schedules.reduce((acc, schedule) => {
      const date = schedule.date.split('T')[0]; // Assuming date is in ISO format
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {});

    return Object.keys(grouped).map(date => ({ date, schedules: grouped[date] }));
  }
}
