import { Observable } from "rxjs";

export abstract class AuthService {

  abstract user$: Observable<any>;

  abstract getUser(): any;

  abstract login(email: string, password: string): any;

  abstract logout(): any;
}
