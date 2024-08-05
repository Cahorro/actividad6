import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Iuser } from '../../interfaces/iuser.interface';
import { UsersServiceService } from '../../services/users-service.service';

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

  async deleteUser() {
    let confirmacion = confirm(
      `Desea borrar el usuario ${this.miUsuario.first_name} ${this.miUsuario.last_name}`
    );
    if (confirmacion) {
      try {
        const response: Iuser = await this.usersService.delete(
          this.miUsuario._id
        );
        if (response._id) {
          const response = await this.usersService.getAll();
          alert('Empleado borrado correctamente');
          this.router.navigate(['home']);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
