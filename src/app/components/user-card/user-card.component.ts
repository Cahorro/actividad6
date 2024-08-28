import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersServiceService } from '../../services/users-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  @Input() miUsuario!: Iuser;
  usersService = inject(UsersServiceService);
  router = inject(Router);

  deleteUser() {
    Swal.fire({
      title: 'Atención',
      text: `¿Desea borrar el usuario ${this.miUsuario?.first_name} ${this.miUsuario?.last_name}?`,
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    }).then(async (isConfirm) => {
      if (isConfirm) {
        try {
          const response: Iuser = await this.usersService.delete(
            this.miUsuario?._id
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
