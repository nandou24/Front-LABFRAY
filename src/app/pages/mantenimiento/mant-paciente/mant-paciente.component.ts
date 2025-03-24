import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPaciente } from '../../models/pages.models';
import Swal from 'sweetalert2';
import { DatepickerService } from '../../services/datepicker.service';
import { UbigeosService } from '../../services/ubigeos.service';
import { PacienteService } from '../../services/mantenimiento/paciente.service';

@Component({
  selector: 'app-mant-paciente',
  templateUrl: './mant-paciente.component.html',
  styleUrl: './mant-paciente.component.scss'
})
export class MantPacienteComponent implements OnInit{

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _pacienteService: PacienteService,
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
    this.ultimosClientes();
    // Exponer el método globalmente para que pueda ser llamado desde JavaScript
    (window as any).clearFechaNacimientoError = this.clearFechaNacimientoError.bind(this);
    this.myForm.get('tipoDoc')?.valueChanges.subscribe(() =>{
      this.myForm.get('nroDoc')?.updateValueAndValidity();
    })
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
      hc:'',
      tipoDoc: ['0', [Validators.required]],
      nroDoc: ['', [Validators.required,
                    documentValidator('tipoDoc')
                  ]],
      nombreCliente: ['',[Validators.required,
                          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                        ]],
      apePatCliente:['',[Validators.required,
                          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                        ]],
      apeMatCliente:['',[Validators.required,
                          Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                        ]],
      fechaNacimiento: ['', Validators.required],
      sexoCliente:['0',[Validators.required, Validators.pattern('^[12]$')]],
      departamentoCliente: ['15'],
      provinciaCliente: ['01'],
      distritoCliente: ['',[Validators.required]],
      direcCliente:[''],
      mailCliente: ['', [Validators.email]],
      phones: this._fb.array([], Validators.required)
  });

  /*
  public newPhone = {
    phoneNumber: '',        // Campo para el número de teléfono
    descriptionPhone: ''    // Campo para la descripción del teléfono
  };*/

  get phones(): FormArray{
    return this.myForm.get('phones') as FormArray;
  }


  phoneNumberControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,11}$')]);
  descriptionPhoneControl = new FormControl('', Validators.required);

  public addPhone: boolean = false;

  addPhoneItem(): void {

    this.addPhone = true;  // Activar validaciones al hacer clic en "Agregar"
    // Primero, verifica si los campos `phoneNumber` y `descriptionPhone` están completos y válidos.
    const phoneNumber = this.phoneNumberControl // this.myForm.get('phoneNumber');
    const descriptionPhone = this.descriptionPhoneControl // this.myForm.get('descriptionPhone');
  
    if (phoneNumber?.valid && descriptionPhone?.valid) {
      const nuevoTelefonoFormGroup = this._fb.group({
        phoneNumber: [phoneNumber.value],
        descriptionPhone: [descriptionPhone.value]
      });
  
      // Agrega el nuevo grupo al array `phones`
      this.phones.push(nuevoTelefonoFormGroup);
  
      // Limpia los campos `phoneNumber` y `descriptionPhone` después de agregar el teléfono
      this.phoneNumberControl.reset();
      this. descriptionPhoneControl.reset();

      this.addPhone = false;

    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      this.phoneNumberControl?.markAsTouched();
      this.descriptionPhoneControl?.markAsTouched();
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
      this.edad = this.calcularEdad();
    }
  }

  clearFechaNacimientoError() {
    this.myForm.get('fechaNacimiento')?.setErrors(null);
    this.myForm.get('fechaNacimiento')?.markAsTouched();
    this.myForm.get('fechaNacimiento')?.markAsDirty();
  }


  // Ejemplo de función para validar el formato dd-mm-yyyy
  validarFormatoFecha(fecha: string): boolean {
    // Expresión regular para validar formato dd-mm-yyyy
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(fecha);
  }

  public edad: string = '';

  calcularEdad(): string {

    const fechaNacimiento = this.myForm.get('fechaNacimiento')?.value;

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

    if((telefonos.length > 0)){
      return true
    }
    return false

  }

  //public hc: string = '';

  public formSubmitted: boolean = false;

  registraPaciente(){

      this.formSubmitted = true;
    
      if(this.myForm.valid && this.validarArrayTelefono()){

        Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas confirmar la creación de este paciente?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          
          if (result.isConfirmed) {

            const fechaNacimientoInput = document.getElementById('fechaNac') as HTMLInputElement;
            const fechaSeleccionada = fechaNacimientoInput.value;
            console.log(fechaSeleccionada)
          
            const [dia, mes, anio] = fechaSeleccionada.split('/'); // Separar día, mes y año
            const fechaFormateada = `${anio}-${mes}-${dia}`

            // Actualizar el campo en el formulario con la fecha formateada
            this.myForm.get('fechaNacimiento')?.setValue(fechaFormateada);

            console.log('Procede registro')
            const body: IPaciente = this.myForm.value; //capturando los valores del component.ts
            
            console.log("capturando valores en component.ts")

            this._pacienteService.registrarPaciente(body).subscribe((res) => {
              if (res !== 'ERROR') {
                Swal.fire({
                  title: 'Confirmado',
                  text: 'Paciente Registrado',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                });
                this.ultimosClientes();
                this.nuevoCliente();
                //this._router.navigateByUrl('/auth/login');
              }else{
                this.myForm.get('fechaNacimiento')?.setValue(fechaSeleccionada);
              }
            });
          }
        })
      }else{
        console.log('No Procede')
      }

  }
  
  
  //Buscar Paciente

  terminoBusqueda: any;
  pacientes: IPaciente[] = [];

  // Método para buscar clientes
  buscarClientes(): void {
    if (this.terminoBusqueda.length >= 3) { 
      this._pacienteService.getPatient(this.terminoBusqueda).subscribe((res: IPaciente[]) => {
        this.pacientes = res;
      });
    }if (this.terminoBusqueda.length > 0) {
      this.pacientes = [];
    }else{
      this.ultimosClientes();
    }
  }
  
  // Método últimos 20* pacientes
  ultimosClientes(): void {
    this._pacienteService.getLastPatients(20).subscribe((res: IPaciente[]) => {
      this.pacientes = res;
    });
  }

  //Carga los datos en los campos
  cargarCliente(paciente: IPaciente): void {
    this.myForm.patchValue({ 
      hc: paciente.hc,
      tipoDoc: paciente.tipoDoc,
      nroDoc: paciente.nroDoc,
      nombreCliente: paciente.nombreCliente,
      apePatCliente: paciente.apePatCliente,
      apeMatCliente: paciente.apeMatCliente,
      fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
      sexoCliente: paciente.sexoCliente,
      departamentoCliente: paciente.departamentoCliente,
      provinciaCliente: paciente.provinciaCliente,
      distritoCliente: paciente.distritoCliente,
      direcCliente: paciente.direcCliente,
      mailCliente: paciente.mailCliente
    });
    this.edad = this.calcularEdad();
    // Limpiar el FormArray antes de llenarlo
    this.phones.clear();

    // Agregar cada teléfono al FormArray
    paciente.phones.forEach((phone: any) => {
      this.phones.push(this.crearTelefonoGroup(phone));
    });
  }

  private crearTelefonoGroup(phone: any): FormGroup {
    return this._fb.group({
      phoneNumber: [phone.phoneNumber],
      descriptionPhone: [phone.descriptionPhone]
    });
  }


  // Función para formatear la fecha en dd/mm/YYYY
  formatearFecha(fecha: Date | string): string {

    const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString();
    const [anio, mes, dia] = fechaStr.split('T')[0].split('-');
    // Retorna en formato `dd/mm/yyyy`
    return `${dia}/${mes}/${anio}`;
  }

  filaSeleccionada: number | null = null;

  seleccionarFila(index: number): void {
    this.filaSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  //Botón nuevo cliente
  nuevoCliente(): void {
    this.myForm.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario 
    this.phones.clear();// Limpia el FormArray de teléfonos, si es necesario
    this.addPhone = false;
    this.myForm.patchValue({
      tipoDoc: '0',
      sexoCliente: '0',
      departamentoCliente: '15',
      provinciaCliente: '01',
      distritoCliente: '',
    });
    this.edad = '';
    this.filaSeleccionada = null;
  }

  //actualizar cliente
  actualizarCliente(): void {

    this.formSubmitted = true;
  
    if(this.myForm.valid && this.validarArrayTelefono()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la actualización de este paciente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
      
        const fechaNacimientoInput = document.getElementById('fechaNac') as HTMLInputElement;
        const fechaSeleccionada = fechaNacimientoInput.value;
        console.log(fechaSeleccionada)
      
        const [dia, mes, anio] = fechaSeleccionada.split('/'); // Separar día, mes y año
        const fechaFormateada = `${anio}-${mes}-${dia}`
    
        // Actualizar el campo en el formulario con la fecha formateada
        this.myForm.get('fechaNacimiento')?.setValue(fechaFormateada);

        const body: IPaciente = this.myForm.value; //capturando los valores del component.ts

        this._pacienteService.actualizarPaciente(body.hc,body).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Paciente Actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimosClientes();
            this.myForm.reset();
            this.formSubmitted = false;
            this.nuevoCliente();
          }else{
            this.myForm.get('fechaNacimiento')?.setValue(fechaSeleccionada);
          }
        });
      })
    }else{
      console.log('No Procede Actualización')
    }
  }
  
}

export function documentValidator(tipoDocControlName: string): ValidatorFn {
  return (control: AbstractControl) => {
    const parent = control.parent; // Accede al formulario completo
    if (!parent) return null; // Verifica si existe un formulario padre

    const tipoDoc = parent.get(tipoDocControlName)?.value; // Obtén el valor de tipoDoc
    const nroDoc = control.value; // Obtén el valor del número de documento

    if (tipoDoc === '0') {
      // DNI: exactamente 8 dígitos numéricos
      if (!/^\d{8}$/.test(nroDoc)) {
        return { invalidDNI: true };
      }
    } else if (tipoDoc === '1') {
      // CE: máximo 13 caracteres alfanuméricos
      if (!/^[a-zA-Z0-9]{1,13}$/.test(nroDoc)) {
        return { invalidCE: true };
      }
    } else if (tipoDoc === '2') {
      // Pasaporte: máximo 16 caracteres alfanuméricos
      if (!/^[a-zA-Z0-9]{1,16}$/.test(nroDoc)) {
        return { invalidPasaporte: true };
      }
    }

    return null; // Es válido
  };
}
