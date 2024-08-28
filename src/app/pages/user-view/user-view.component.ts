import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersServiceService } from '../../services/users-service.service';
import Swal from 'sweetalert2';

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
  oneUser: Iuser | null = null;

  ngOnInit() {
    try {
      this.activatedRoute.params.subscribe(async (params: Params) => {
        let id: string = params['id'];
        let response = await this.usersService.getById(id);
        if (response) {
          this.oneUser = response;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteUser() {
    Swal.fire({
      title: 'Atención',
      text: `¿Desea borrar el usuario ${this.oneUser?.first_name} ${this.oneUser?.last_name}?`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    }).then(async (isConfirm) => {
      if (isConfirm) {
        try {
          const response: Iuser = await this.usersService.delete(
            this.oneUser?._id
          );
          if (response._id) {
            const response = await this.usersService.getAll();
            Swal.fire('Usuario borrado correctamente', '', 'success').then(() =>
              this.router.navigate(['home'])
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}
