import { Component, inject } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Iuser } from '../../interfaces/iuser.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  usersService = inject(UsersServiceService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Guardar';
  userForm: FormGroup;
  idUser!: string;

  constructor() {
    this.userForm = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        last_name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        username: new FormControl(null, [
          Validators.required,
          Validators.pattern(/[a-z]+\.[a-z]+/),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
        image: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /(^$|(http(s)?:\/\/)([\w-]+\.)+[\w-]+([\w- ;,.\/?%&=]*))/
          ),
        ]),
      },
      []
    );
  }

  ngOnInit() {
    //voy a preguntar por lo parametros ruta, si no tengo parametros estoy insertando y si tengo parametro estoy actualizando.
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.tipo = 'Actualizar';
        const user: Iuser = await this.usersService.getById(params.id);
        this.userForm.patchValue(user);
        console.log(this.userForm);
        this.idUser = params.id;
      }
    });
  }

  async getDataForm() {
    console.log(this.idUser);
    if (this.idUser) {
      //Actualizando usuario
      try {
        const response: Iuser = await this.usersService.update(
          this.userForm.value,
          this.idUser
        );
        console.log(response);
        if (response._id) {
          Swal.fire('Usuario actualizado correctamente', '', 'success').then(
            async () => this.router.navigate(['/user', this.idUser])
          );
        }
      } catch ({ error }: any) {
        this.errorForm = error;
        console.log(this.errorForm);
        Swal.fire('Error', 'Error al actualizar el usuario', 'error').then(
          async () => this.router.navigate(['/user', this.idUser])
        );
      }
    } else {
      //Nuevo usuario
      try {
        const response: Iuser = await this.usersService.insert(
          this.userForm.value
        );
        console.log(response);
        if (response.id) {
          Swal.fire('Usuario añadido correctamente', '', 'success').then(
            async () => this.router.navigate(['/home'])
          );
        }
      } catch ({ error }: any) {
        this.errorForm = error;
        console.log(this.errorForm);
        Swal.fire('Error', 'Error al crear el usuario', 'error').then(
          async () => this.router.navigate(['/user', this.idUser])
        );
      }
    }
  }
  checkControl(formControlName: string, validador: string) {
    return (
      this.userForm.get(formControlName)?.hasError(validador) &&
      this.userForm.get(formControlName)?.touched
    );
  }
}
