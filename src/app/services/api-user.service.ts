import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, collection, doc, addDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
// import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService implements UserService {
  constructor(private firestore: Firestore, private http: HttpClient) {}

  getUsers() {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' });
  }

  addUser(user: any) {
    if (!user.email || !user.name || !user.role) {
      throw new Error('Missing required user fields');
    }
    const userDoc = doc(this.firestore, `users/${user.email}`);
    return setDoc(userDoc, user); // Use setDoc to specify the document ID
  }

  getUser(email: string) {
    const userDoc = doc(this.firestore, `users/${email}`);
    return docData(userDoc);
  }

  getUserName(email: string): Observable<string> {
    const userDoc = doc(this.firestore, `users/${email}`);
    return docData(userDoc).pipe(
      map((user: any) => user?.name)
    );
  }

  async editUser(email: string, userData: any): Promise<void> {
    const userDoc = doc(this.firestore, `users/${email}`);
    return setDoc(userDoc, userData, { merge: true });
  }

  async resetUserPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(getAuth(), email);
  }

  async deleteUser(email: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${email}`);
    return deleteDoc(userDoc);
  }
}
