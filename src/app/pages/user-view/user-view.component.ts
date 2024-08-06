import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersServiceService } from '../../services/users-service.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  usersService = inject(UsersServiceService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  oneUser!: Iuser;

  ngOnInit() {
    try {
      this.activatedRoute.params.subscribe(async (params: any) => {
        let id: string = params['id'];
        let response = await this.usersService.getById(id);
        console.log(response);
        this.oneUser = response;
        console.log(this.oneUser);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser() {
    let confirmacion = confirm(
      `Desea borrar el usuario ${this.oneUser.first_name} ${this.oneUser.last_name}`
    );
    if (confirmacion) {
      try {
        const response: Iuser = await this.usersService.delete(
          this.oneUser._id
        );
        if (response._id) {
          const response = await this.usersService.getAll();
          alert('Usuario borrado correctamente');
          this.router.navigate(['home']);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
