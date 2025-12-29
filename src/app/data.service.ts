import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserRow[]> {
    return this.http.get<UserRow[]>('assets/users.json');
  }
}
