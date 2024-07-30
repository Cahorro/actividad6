import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  deleteUser(): void {
    this.usersService.deleteUser(
      this.miUsuario._id,
      this.miUsuario.first_name + ' ' + this.miUsuario.last_name
    );
  }
}
