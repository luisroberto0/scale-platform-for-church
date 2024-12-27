
import { Firestore } from '@angular/fire/firestore';

export abstract class BaseService {
  constructor(protected firestore: Firestore) {}
}
