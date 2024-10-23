import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/auth/models/auth.models';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DatepickerService } from '../services/datepicker.service';
import { UbigeosService } from '../services/ubigeos.service';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.scss'
})
export class RegistrarPacienteComponent implements OnInit{

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _datePickerService:  DatepickerService,
    private _ubigeoService: UbigeosService
  ) { }

  ngOnInit(): void {
    this._datePickerService.loadScript();
    this.departamentos = this._ubigeoService.getDepartamento();
    this.provincias = this._ubigeoService.getProvincia('15')
    this.distritos = this._ubigeoService.getDistrito('15','01')
    this.onDepartamentoChange();
    this.onProvinciaChange();
  }
 
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  // Método separado para manejar el cambio de departamento
  onDepartamentoChange(): void {
    this.myForm.get('departamentoCliente')?.valueChanges.subscribe(departamentoId => {
      // Obtener y cargar las provincias según el departamento seleccionado
      this.provincias = this._ubigeoService.getProvincia(departamentoId);
      this.distritos = this._ubigeoService.getDistrito(departamentoId,'01')

      // Reiniciar el select de provincias
      this.myForm.get('provinciaCliente')?.setValue('01');  // Limpia la selección de provincias
    });
  }

    
  onProvinciaChange(): void {
    this.myForm.get('provinciaCliente')?.valueChanges.subscribe(provinciaId => {
      
      const departamentoId = this.myForm.get('departamentoCliente')?.value;
      this.distritos = this._ubigeoService.getDistrito(departamentoId, provinciaId);
      this.myForm.get('distritoCliente')?.setValue('01');
      
    });
  }

  public myForm:FormGroup  = this._fb.group({
      tipoDoc: ['0', [Validators.required]],
      nroDoc: ['', [Validators.required]],
      nombreCliente: ['',[Validators.required]],
      apePatCliente:['',[Validators.required]],
      apeMatCliente:['',[Validators.required]],
      fechaNacimiento: ['', Validators.required],
      sexoCliente:['0',[Validators.required, Validators.pattern('^[12]$')]],
      departamentoCliente: ['15'],
      provinciaCliente: ['01'],
      distritoCliente: ['',[Validators.required]],
      direcCliente:[''],
      mailCliente: ['', [Validators.email]],
      phoneNumber:['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      descriptionPhone: ['', [Validators.required]],
      phones: this._fb.array([])
  });

  public newPhone = {
    phoneNumber: '',        // Campo para el número de teléfono
    descriptionPhone: ''    // Campo para la descripción del teléfono
  };

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
    //console.log(this.phones)
  }

  onFechaNacimientoInput(event: Event): void {
    const inputValue = event.target as HTMLInputElement;
    const fechaNacimiento = inputValue.value;  // Obtener el valor actual del input
    //console.log('Valor del input cambiado:', fechaNacimiento);

    // Aquí puedes realizar cualquier validación o transformación del valor de la fecha
    if (this.validarFormatoFecha(fechaNacimiento)) {
      //console.log('Formato de fecha válido:', fechaNacimiento);
      this.edad = this.calcularEdad(fechaNacimiento);
    }
  }

  // Ejemplo de función para validar el formato dd-mm-yyyy
  validarFormatoFecha(fecha: string): boolean {
    // Expresión regular para validar formato dd-mm-yyyy
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(fecha);
  }

  public edad: string = '';

  calcularEdad(fechaNacimiento: string): string {
    const [day, month, year] = fechaNacimiento.split('/').map(Number);  // Dividir la fecha en partes

    const birthDate = new Date(year, month - 1, day);  // Crear una fecha con el valor ingresado
    const today = new Date();  // Obtener la fecha actual

    let years = today.getFullYear() - birthDate.getFullYear();

    // Calcular la diferencia en meses
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0) {
      months += 12;
      years--;  // Si el mes del cumpleaños aún no ha pasado, restamos un año
    }

    // Calcular la diferencia en días
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) {
      months--;  // Si el día del cumpleaños aún no ha pasado, restamos un mes
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);  // Obtener el último día del mes anterior
      days += lastMonth.getDate();  // Sumamos los días del mes anterior
    }

    // Devolver el resultado en años, meses y días
    return `${years} años, ${months} meses, y ${days} días`;
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
