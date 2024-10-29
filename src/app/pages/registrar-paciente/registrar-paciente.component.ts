import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPaciente } from '../models/pages.models';
import Swal from 'sweetalert2';
import { DatepickerService } from '../services/datepicker.service';
import { UbigeosService } from '../services/ubigeos.service';
import { PacienteService } from '../services/paciente.service';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.scss'
})
export class RegistrarPacienteComponent implements OnInit{

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _pagesService: PacienteService,
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
      //phoneNumber:[''],
      //descriptionPhone: [''],
      phones: this._fb.array([], Validators.required)
  });

  public newPhone = {
    phoneNumber: '',        // Campo para el número de teléfono
    descriptionPhone: ''    // Campo para la descripción del teléfono
  };

  get phones(): FormArray{
    return this.myForm.get('phones') as FormArray;
  }

  /*
  addPhoneItem():void{

    if(this.myForm.get('phoneNumber')?.value && this.myForm.get('descriptionPhone')?.value){

      const nuevoTelefonoFormGroup = this._fb.group({
        phoneNumber: [this.myForm.get('phoneNumber')?.value, [Validators.required, Validators.pattern('^[0-9]+$')]],
        descriptionPhone: [this.myForm.get('descriptionPhone')?.value, [Validators.required]]
      });

      this.phones.push(nuevoTelefonoFormGroup);
      this.myForm.get('phoneNumber')?.reset();
      this.myForm.get('descriptionPhone')?.reset();

    }

  }*/

    phoneNumberControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
    descriptionPhoneControl = new FormControl('', Validators.required);

  addPhoneItem(): void {
    // Primero, verifica si los campos `phoneNumber` y `descriptionPhone` están completos y válidos.
    const phoneNumberControl = this.myForm.get('phoneNumber');
    const descriptionPhoneControl = this.myForm.get('descriptionPhone');
  
    if (phoneNumberControl?.valid && descriptionPhoneControl?.valid) {
      const nuevoTelefonoFormGroup = this._fb.group({
        phoneNumber: [phoneNumberControl.value, [Validators.required, Validators.pattern('^[0-9]+$')]],
        descriptionPhone: [descriptionPhoneControl.value, Validators.required]
      });
  
      // Agrega el nuevo grupo al array `phones`
      this.phones.push(nuevoTelefonoFormGroup);
  
      // Limpia los campos `phoneNumber` y `descriptionPhone` después de agregar el teléfono
      phoneNumberControl.reset();
      descriptionPhoneControl.reset();
    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      phoneNumberControl?.markAsTouched();
      descriptionPhoneControl?.markAsTouched();
    }

  }


  removeItem(index:number){
    this.phones.removeAt(index)
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

  validarArrayTelefono(): boolean{
    
    const telefonos = this.myForm.get('phones') as FormArray;

    if((telefonos.length >= 1)){
      return true
    }
    return false

  }


  public formSubmitted: boolean = false;

  registraPaciente(){

    this.formSubmitted = true;
  
    if(this.validarArrayTelefono() == true){

    const fecha1 = this.myForm.get('fechaNacimiento')?.value
    const [dia, mes, anio] = fecha1.split('/'); // Separar día, mes y año
    const fechaFormateada = `${anio}-${mes}-${dia}`

    // Actualizar el campo en el formulario con la fecha formateada
    this.myForm.get('fechaNacimiento')?.setValue(fechaFormateada);

      console.log('Procede registro')
      const body: IPaciente = this.myForm.value; //capturando los valores del component.ts
      console.log("capturando valores en component.ts")

      this._pagesService.registrarPaciente(body).subscribe((res) => {
        if (res !== 'ERROR') {
          Swal.fire({
            title: 'Woho!',
            text: 'Paciente Registrado',
            icon: 'success',
            confirmButtonText: 'Ok',
          });

          this._router.navigateByUrl('/auth/login');
        }
      });
    }else{
      console.log('No Procede')
    }

  }
  
  fieldIsInvalidReactive(field: any) {
    return (
      this.myForm.controls[field].errors && this.myForm.controls[field].touched && this.phones.length > 0
    );
  }

}
