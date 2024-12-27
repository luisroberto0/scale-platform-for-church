import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, public afAuth: AngularFireAuth) {}

  login() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        alert('Credenciais inválidas');
      });
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Error logging in with Google:', error);
      });
  }
}
