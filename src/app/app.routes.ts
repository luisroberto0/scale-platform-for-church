import { Routes } from '@angular/router';
import { canActivateGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [canActivateGuard] },
  { path: 'schedules', loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule), canActivate: [canActivateGuard] },
  { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule), canActivate: [canActivateGuard] },
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule), canActivate: [canActivateGuard] },
  { path: 'schedule-types', loadChildren: () => import('./pages/schedule-types/schedule.module').then(m => m.ScheduleModule), canActivate: [canActivateGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
