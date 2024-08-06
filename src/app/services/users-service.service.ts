import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { IuserPage } from '../interfaces/iuser-page.interface';
import { firstValueFrom } from 'rxjs';
import { InjectSetupWrapper } from '@angular/core/testing';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  private baseUrl: string = 'https://peticiones.online/api/users';
  http = inject(HttpClient);

  constructor() {}

  getAll(pagina: number = 1): Promise<IuserPage> {
    return firstValueFrom(
      this.http.get<IuserPage>(`${this.baseUrl}?page=${pagina}`)
    );
  }

  getById(id: string | undefined): Promise<Iuser> {
    let url: string = `${this.baseUrl}/${id}`;
    return firstValueFrom(this.http.get<Iuser>(url));
  }

  delete(id?: string): Promise<Iuser> {
    return firstValueFrom(this.http.delete<Iuser>(`${this.baseUrl}/${id}`));
  }

  insert(body: Iuser): Promise<Iuser> {
    return firstValueFrom(this.http.post<Iuser>(this.baseUrl, body));
  }

  update(body: Iuser, id: string): Promise<Iuser> {
    body._id = id;
    return firstValueFrom(
      this.http.put<Iuser>(`${this.baseUrl}/${body._id}`, body)
    );
  }
}
