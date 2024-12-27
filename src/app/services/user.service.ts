import { Observable } from 'rxjs';

export abstract class UserService {

  abstract getUsers(): any;

  abstract addUser(user: any): any;

  abstract getUser(uid: string): any;

  abstract getUserName(userId: string): Observable<string>;

  abstract editUser(email: string, userData: any): Promise<void>;
  abstract resetUserPassword(email: string): Promise<void>;
  abstract deleteUser(email: string): Promise<void>;
}

