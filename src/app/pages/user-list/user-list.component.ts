import { Component, inject, OnInit } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { Iuser } from '../../interfaces/iuser.interface';
import { IuserPage } from '../../interfaces/iuser-page.interface';
import { UserCardComponent } from '../../components/user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  usuariosServices = inject(UsersServiceService);
  numPages: number = 0;
  currentPage: number = 1;

  misUsuarios: Iuser[] = [];
  async ngOnInit() {
    try {
      let pagina: IuserPage = await this.usuariosServices.getAll();
      this.misUsuarios = pagina.results;
      this.numPages = pagina.total_pages;
    } catch (error) {
      console.log(error);
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  async goToPage(page: number) {
    try {
      let pagina: IuserPage = await this.usuariosServices.getAll(page);
      this.misUsuarios = pagina.results;
      this.numPages = pagina.total_pages;
      this.currentPage = page;
    } catch (error) {
      console.log(error);
    }
  }
}
