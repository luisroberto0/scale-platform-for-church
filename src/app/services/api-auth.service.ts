import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Updated import
import { switchMap, map } from 'rxjs/operators'; // Added map import
import { of } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService implements AuthService{
  user$;

  constructor(private afAuth: AngularFireAuth, private userService: UserService) { // Updated type
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.afAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          console.log(user);
          return this.userService.getUser(user?.email).pipe(
            map((userData: any) => ({
              ...userData, role: userData?.role || 'viewer'
             })) // Ensure role is present
          );
        } else {
          return of(null);
        }
      })
    );
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }
}
