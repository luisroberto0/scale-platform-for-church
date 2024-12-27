import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideToastr, ToastrModule } from 'ngx-toastr';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HomeModule } from './pages/home/home.module';
import { UsersModule } from './pages/users/users.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { environment } from '../environments/environment';
import { ScheduleModule } from './pages/schedule/schedule.module';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule, // required animations module
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
      }),
      AngularFireAuthModule,
      AngularFireModule,
      HomeModule,
      UsersModule,
      ScheduleModule,
      AngularFireModule.initializeApp(environment.firebaseConfig)

    ),

    provideAnimations(), // required animations providers
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), // Toastr providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'escalas-igreja',
        appId: '1:839191571581:web:b4ae0fffcac567ea669514',
        storageBucket: 'escalas-igreja.firebasestorage.app',
        apiKey: 'AIzaSyASRBZta9YYcCXqGzyiWZDzOY0eNctB_kU',
        authDomain: 'escalas-igreja.firebaseapp.com',
        messagingSenderId: '839191571581',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
  ],
};
