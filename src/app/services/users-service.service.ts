import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { IuserPage } from '../interfaces/iuser-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  private baseUrl: string = 'https://peticiones.online/api/users';
  http = inject(HttpClient);

  constructor() {}

  getAll(): Promise<IuserPage> {
    return firstValueFrom(this.http.get<IuserPage>(this.baseUrl));
  }
}
