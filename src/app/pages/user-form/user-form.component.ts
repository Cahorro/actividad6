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

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  usersSrevice = inject(UsersServiceService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Guardar';
  userForm: FormGroup;

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
            // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
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
        const user: Iuser = await this.usersSrevice.getById(params.id);
        this.userForm.patchValue(user);
      }
    });
  }

  async getDataForm() {
    //console.log(this.userForm);
    if (this.userForm.value._id) {
      //Actualizando
      try {
        const response: Iuser = await this.usersSrevice.update(
          this.userForm.value
        );
        console.log(response);
        if (response._id) {
          alert('Usuario actualizado');
          this.router.navigate(['/dashboard', 'empleados']);
        }
      } catch ({ error }: any) {
        this.errorForm = error;
        console.log(this.errorForm);
      }
    } else {
      //insertando
      //peticion al servicio para insertar los datos en la API
      try {
        const response: Iuser = await this.usersSrevice.insert(
          this.userForm.value
        );
        if (response._id) {
          this.router.navigate(['/dashboard', 'empleados']);
        }
      } catch ({ error }: any) {
        this.errorForm = error;
        console.log(this.errorForm);
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
