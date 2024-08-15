import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/auth/models/auth.models';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.scss'
})
export class RegistrarPacienteComponent {

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {}
 
  public myForm:FormGroup  = this._fb.group({
      name: ['', [Validators.required]],  
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['',[Validators.required]]
    });

  userRegister(){
  
    const body: IUser = this.myForm.value;
    console.log("capturando valores en component.ts")

    this._authService.registerUser(body).subscribe((res) => {
      if (res !== 'ERROR') {
        Swal.fire({
          title: 'Woho!',
          text: 'Usuario Registrado',
          icon: 'success',
          confirmButtonText: 'Ok',
        });

        this._router.navigateByUrl('/auth/login');
      }
    });
  }

  fieldIsInvalidReactive(field: any) {
    return (
      this.myForm.controls[field].errors && this.myForm.controls[field].touched
    );
  }

}
