import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/auth/models/auth.models';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DatepickerService } from '../services/datepicker.service';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.scss'
})
export class RegistrarPacienteComponent implements OnInit{

  constructor(
    private _fb: FormBuilder,
    private _fb_phone: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _datePickerService:  DatepickerService,
  ) { }

  ngOnInit(): void {
    this._datePickerService.loadScript();

    this.myForm.get('fechaNacimiento')?.valueChanges.subscribe(value => {
      console.log('Fecha de nacimiento modificada:', value);
      this.calcularEdad(value);  // Aquí puedes ejecutar la lógica que necesites
    });
  }
 
  public myForm:FormGroup  = this._fb.group({
      name: ['', [Validators.required]],  
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['',[Validators.required]],
      fechaNacimiento: ['', Validators.required],
      phones: this._fb.array([])
  });


  public newPhone = {
    phoneNumber: '',        // Campo para el número de teléfono
    descriptionPhone: ''    // Campo para la descripción del teléfono
  };

  public edad: number | null = null;

  crearTelefono(): FormGroup{
    return this._fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      descriptionPhone: ['',[Validators.required]]
    })
  }

  get phones(): FormArray{
    return this.myForm.get('phones') as FormArray;
  }

  addPhoneItem():void{
    if (this.newPhone.phoneNumber && this.newPhone.descriptionPhone) {

      const nuevoTelefonoFormGroup = this._fb.group({
        phoneNumber: [this.newPhone.phoneNumber, [Validators.required, Validators.pattern('^[0-9]+$')]],
        descriptionPhone: [this.newPhone.descriptionPhone, [Validators.required]]
      });

      this.phones.push(nuevoTelefonoFormGroup);

      this.newPhone = {phoneNumber:'', descriptionPhone:''}

    }
  }

  removeItem(index:number){
    this.phones.removeAt(index)
    console.log(this.phones)
  }

  calcularEdad(fechaNacimiento: any): void {
    
    console.log('Transformando fecha')
    const [day, month, year] = fechaNacimiento.split('/');
    const nuevaFecha = `${month}/${day}/${year}`;
    
    console.log('calculando')
    //const fechaNacimiento = this.myForm.get('fechaNacimiento')?.value;  // Obtener el valor del FormControl
    if (fechaNacimiento) {
      const today = new Date();  // Fecha actual
      const birthDate = new Date(nuevaFecha);  // Convertir a fecha
      let age = today.getFullYear() - birthDate.getFullYear();  // Calcular la diferencia de años
      const monthDiff = today.getMonth() - birthDate.getMonth();  // Verificar el mes

      // Ajustar la edad si aún no ha cumplido años este año
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.edad = age;  // Actualizar la variable de edad
    } else {
      this.edad = null;  // Si no hay fecha, limpiar la edad
    }
  }

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
