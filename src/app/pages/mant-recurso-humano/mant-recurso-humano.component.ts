import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DatepickerService } from '../services/datepicker.service';
import { UbigeosService } from '../services/ubigeos.service';
import Swal from 'sweetalert2';
import { RecursoHumanoService } from '../services/recurso-humano.service';
import { IRecHumano } from '../models/pages.models';

@Component({
  selector: 'app-mant-recurso-humano',
  templateUrl: './mant-recurso-humano.component.html',
  styleUrl: './mant-recurso-humano.component.scss'
})
export class MantRecursoHumanoComponent implements OnInit {

  constructor(
      private _fb: FormBuilder,
      private _recHumanoService: RecursoHumanoService,
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
    this.ultimosRecHumanos(20);
    // Exponer el método globalmente para que pueda ser llamado desde JavaScript
    (window as any).clearFechaNacimientoError = this.clearFechaNacimientoError.bind(this);
    this.myFormRecHumano.get('tipoDoc')?.valueChanges.subscribe(() =>{
      this.myFormRecHumano.get('nroDoc')?.updateValueAndValidity();
    })
  }

  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  // Método separado para manejar el cambio de departamento
  onDepartamentoChange(): void {
    this.myFormRecHumano.get('departamentoRecHumano')?.valueChanges.subscribe(departamentoId => {
      // Obtener y cargar las provincias según el departamento seleccionado
      this.provincias = this._ubigeoService.getProvincia(departamentoId);
      this.distritos = this._ubigeoService.getDistrito(departamentoId,'01')
      // Reiniciar el select de provincias
      this.myFormRecHumano.get('provinciaRecHumano')?.setValue('01');  // Limpia la selección de provincias
    });
  }
    
  onProvinciaChange(): void {
    this.myFormRecHumano.get('provinciaRecHumano')?.valueChanges.subscribe(provinciaId => {
      
      const departamentoId = this.myFormRecHumano.get('departamentoRecHumano')?.value;
      this.distritos = this._ubigeoService.getDistrito(departamentoId, provinciaId);
      this.myFormRecHumano.get('distritoRecHumano')?.setValue('01');
      
    });
  }

  public myFormRecHumano:FormGroup  = this._fb.group({
    codRecHumano:'',
    tipoDoc: ['0', [Validators.required]],
    nroDoc: ['', [Validators.required,
                  documentValidator('tipoDoc')
                ]],
    nombreRecHumano: ['',[Validators.required,
                        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                      ]],
    apePatRecHumano:['',[Validators.required,
                        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                      ]],
    apeMatRecHumano:['',[Validators.required,
                        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
                      ]],
    fechaNacimiento: ['', Validators.required],
    sexoRecHumano:['0',[Validators.required, Validators.pattern('^[12]$')]],
    departamentoRecHumano: ['15'],
    provinciaRecHumano: ['01'],
    distritoRecHumano: ['',[Validators.required]],
    direcRecHumano:[''],
    mailRecHumano: ['', [Validators.email]],
    phones: this._fb.array([], Validators.required),
    gradoInstruccion:['0'],
    profesionesRecurso: this._fb.array([]),
    profesionSolicitante: new FormControl(null),
    especialidadesRecurso: this._fb.array([]),
    esSolicitante: false
  });

  get phones(): FormArray{
    return this.myFormRecHumano.get('phones') as FormArray;
  }

  get profesionesRecurso(): FormArray{
    return this.myFormRecHumano.get('profesionesRecurso') as FormArray;
  }

  get especialidadesRecurso(): FormArray{
    return this.myFormRecHumano.get('especialidadesRecurso') as FormArray;
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

  removePhone(index:number){
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
    this.myFormRecHumano.get('fechaNacimiento')?.setErrors(null);
    this.myFormRecHumano.get('fechaNacimiento')?.markAsTouched();
    this.myFormRecHumano.get('fechaNacimiento')?.markAsDirty();
  }

  // Ejemplo de función para validar el formato dd-mm-yyyy
  validarFormatoFecha(fecha: string): boolean {
    // Expresión regular para validar formato dd-mm-yyyy
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(fecha);
  }

  public edad: string = '';

  calcularEdad(): string {

    const fechaNacimiento = this.myFormRecHumano.get('fechaNacimiento')?.value;

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
    
    const telefonos = this.myFormRecHumano.get('phones') as FormArray;

    if((telefonos.length > 0)){
      return true
    }
    return false

  }


  nivelProfesionControl = new FormControl('0', [Validators.required, Validators.pattern(/^(?!0$).+$/)]);
  tituloControl = new FormControl<boolean>(false);
  profesionControl = new FormControl('0', [Validators.required, Validators.pattern(/^(?!0$).+$/)]);
  nroColegiaturaControl = new FormControl('');
  universProcedenciaProfesionControl = new FormControl('');
  anioEgresoProfesionControl = new FormControl('');

  public addProfesion: boolean = false;

  addProfesionItem(): void {

    this.addProfesion = true;

    const nivelProfesion = this.nivelProfesionControl
    const titulo = this.tituloControl
    const profesion = this.profesionControl
    const nroColegiatura = this.nroColegiaturaControl
    const universProcedenciaProfesion = this.universProcedenciaProfesionControl
    const anioEgresoProfesion = this.anioEgresoProfesionControl
  
    if (this.profesionControl.valid && this.nivelProfesionControl.valid) {

        const nuevaProfesionFormGroup = this._fb.group({
          nivelProfesion: [nivelProfesion.value],
          titulo: [titulo.value],
          profesion: [profesion.value],
          nroColegiatura: [nroColegiatura.value],
          universProcedenciaProfesion: [universProcedenciaProfesion.value],
          anioEgresoProfesion: [anioEgresoProfesion.value],
          profesionSolicitante: false
        });
  
      // Agrega el nuevo grupo al array `profesionesRecurso`
      this.profesionesRecurso.push(nuevaProfesionFormGroup);
  
      // Limpia los campos después de agregar la profesión
      this.nivelProfesionControl.setValue('0')
      this.tituloControl.reset();
      this.profesionControl.setValue('0')
      this.nroColegiaturaControl.reset();
      this.universProcedenciaProfesionControl.reset();
      this.anioEgresoProfesionControl.reset();

      this.addProfesion = false;

    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      this.profesionControl?.markAsTouched();
      this.nivelProfesionControl?.markAsTouched();
    }

  }

  setSolicitante(index: number): void {
       
    const profesionSeleccionada = this.profesionesRecurso.controls[index];

    if (!profesionSeleccionada) return; // Validación de seguridad

    const yaEsSolicitante = profesionSeleccionada.get('profesionSolicitante')?.value;

    if (!yaEsSolicitante) {
      // 🔹 Si ya está activada, desactivarla y limpiar `profesionSolicitante`
      profesionSeleccionada.get('profesionSolicitante')?.setValue(false);
      this.myFormRecHumano.get('profesionSolicitante')?.reset();
    } else {
      // 🔹 Si ninguna está activada, activar esta y desactivar las demás
      this.profesionesRecurso.controls.forEach((profesion) => {
        profesion.get('profesionSolicitante')?.setValue(false);
      });

      profesionSeleccionada.get('profesionSolicitante')?.setValue(true);
      this.myFormRecHumano.get('profesionSolicitante')?.setValue({
        profesion: profesionSeleccionada.get('profesion')?.value,
        nroColegiatura: profesionSeleccionada.get('nroColegiatura')?.value
      });
    }

  }

  removeProfesion(index:number){
    this.profesionesRecurso.removeAt(index)
  }

  especialidadControl = new FormControl('0', [Validators.required, Validators.pattern(/^(?!0$).+$/)]);
  rneControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,7}$')]);
  universProcedenciaEspecialidadControl = new FormControl('');
  anioEgresoEspecialidadControl = new FormControl('');

  public addEspecialidad: boolean = false;

  addEspecialidadItem(): void {

    this.addEspecialidad = true;

    const especialidad = this.especialidadControl
    const rne = this.rneControl
    const universProcedenciaEspecialidad = this.universProcedenciaEspecialidadControl
    const anioEgresoEspecialidad = this.anioEgresoEspecialidadControl
  
    if (this.especialidadControl.valid && this.rneControl.valid) {

        const nuevaEpecialidadFormGroup = this._fb.group({
          especialidad: [especialidad.value],
          rne: [rne.value],
          universProcedenciaEspecialidad: [universProcedenciaEspecialidad.value],
          anioEgresoEspecialidad: [anioEgresoEspecialidad.value]
        });
  
      // Agrega el nuevo grupo al array `profesionesRecurso`
      this.especialidadesRecurso.push(nuevaEpecialidadFormGroup);
  
      // Limpia los campos después de agregar la profesión
      this.especialidadControl.setValue('0')
      this.rneControl.reset();
      this.universProcedenciaEspecialidadControl.reset();
      this.anioEgresoEspecialidadControl.reset();

      this.addEspecialidad = false;

    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      this.especialidadControl?.markAsTouched();
      this.rneControl?.markAsTouched();
    }

  }

  removeEspecialidad(index:number){
    this.especialidadesRecurso.removeAt(index)
  }



  public formSubmitted: boolean = false;

  registraRecHumano(){

    this.formSubmitted = true;
        
    if(this.myFormRecHumano.valid && this.validarArrayTelefono()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la creación de este recuso?',
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
          this.myFormRecHumano.get('fechaNacimiento')?.setValue(fechaFormateada);

          console.log('Procede registro')
          const body: IRecHumano = this.myFormRecHumano.value; //capturando los valores del component.ts
          
          console.log("capturando valores en component.ts")

          this._recHumanoService.registrarRecHumano(body).subscribe((res) => {
            if (res !== 'ERROR') {
              Swal.fire({
                title: 'Confirmado',
                text: 'Recurso Registrado',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.ultimosRecHumanos(20);
              this.nuevoRecHumano();
              this.recHumanoSeleccionado = false
              //this._router.navigateByUrl('/auth/login');
            }else{
              this.myFormRecHumano.get('fechaNacimiento')?.setValue(fechaSeleccionada);
            }
          });
        }
      })
    }else{
      console.log('No Procede')
    }

  }

  //Buscar recHumanos
  
  terminoBusqueda: any;
  recHumanos: IRecHumano[] = [];

  // Método para buscar recHumanos
  buscarRecHumano(): void {
    if (this.terminoBusqueda.length >= 2) { 
      this._recHumanoService.getRecHumano(this.terminoBusqueda).subscribe((res: IRecHumano[]) => {
        this.recHumanos = res;
      });
    }if (this.terminoBusqueda.length > 0) {
      this.recHumanos = [];
    }else{
      this.ultimosRecHumanos(20);
    }
  }
    
  // Método últimos 20* pacientes
  ultimosRecHumanos(cantidad:number): void {
    this._recHumanoService.getLastRecHumanos(cantidad).subscribe({
      next: (res: IRecHumano[]) => {
        this.recHumanos = res;
      },
      error: (err) => {
        console.error('Error al obtener los recursos:', err);
      },
    });
  }
  
  //Carga los datos en los campos
  cargarRecHumano(recHumano: IRecHumano): void {
    this.myFormRecHumano.patchValue({ 
      codRecHumano: recHumano.codRecHumano,
      tipoDoc: recHumano.tipoDoc,
      nroDoc: recHumano.nroDoc,
      nombreRecHumano: recHumano.nombreRecHumano,
      apePatRecHumano: recHumano.apePatRecHumano,
      apeMatRecHumano: recHumano.apeMatRecHumano,
      fechaNacimiento: this.formatearFecha(recHumano.fechaNacimiento),
      sexoRecHumano: recHumano.sexoRecHumano,
      departamentoRecHumano: recHumano.departamentoRecHumano,
      provinciaRecHumano: recHumano.provinciaRecHumano,
      distritoRecHumano: recHumano.distritoRecHumano,
      direcRecHumano: recHumano.direcRecHumano,
      mailRecHumano: recHumano.mailRecHumano,
      gradoInstruccion:recHumano.gradoInstruccion,
      esSolicitante: recHumano.esSolicitante,
      profesionSolicitante: recHumano.profesionSolicitante
    });

    this.edad = this.calcularEdad();

    this.recHumanoSeleccionado = true

    // Limpiar el FormArray antes de llenarlo
    this.phones.clear();
    // Agregar cada teléfono al FormArray
    recHumano.phones.forEach((phone: any) => {
      this.phones.push(this.crearTelefonoGroup(phone));
    });

    this.profesionesRecurso.clear();
    // Agregar cada profesión al FormArray
    recHumano.profesionesRecurso.forEach((profesion: any) => {
      const esSolicitante = recHumano.profesionSolicitante?.profesion === profesion.profesion;
      this.profesionesRecurso.push(this.crearProfesionGroup(profesion, esSolicitante));
    });

    this.especialidadesRecurso.clear();
    // Agregar cada especialidad al FormArray
    recHumano.especialidadesRecurso.forEach((especialidad: any) => {
      this.especialidadesRecurso.push(this.crearEspecialidadGroup(especialidad));
    });

  }
  
  private crearTelefonoGroup(phone: any): FormGroup {
    return this._fb.group({
      phoneNumber: [phone.phoneNumber],
      descriptionPhone: [phone.descriptionPhone]
    });
  }

  private crearProfesionGroup(profesion: any, esSolicitante: boolean): FormGroup {
    return this._fb.group({
      nivelProfesion: [profesion.nivelProfesion],
      titulo: [profesion.titulo],
      profesion: [profesion.profesion],
      nroColegiatura: [profesion.nroColegiatura],
      universProcedenciaProfesion: [profesion.universProcedenciaProfesion],
      anioEgresoProfesion: [profesion.anioEgresoProfesion],
      profesionSolicitante: [esSolicitante]
    });
  }

  private crearEspecialidadGroup(especialidad: any): FormGroup {
    return this._fb.group({
      especialidad: [especialidad.especialidad],
      rne: [especialidad.rne],
      universProcedenciaEspecialidad: [especialidad.universProcedenciaEspecialidad],
      anioEgresoEspecialidad: [especialidad.anioEgresoEspecialidad]
    });
  }

  // Función para formatear la fecha en dd/mm/YYYY
  formatearFecha(fecha: Date | string): string {

    const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString();
    const [anio, mes, dia] = fechaStr.split('T')[0].split('-');
    // Retorna en formato `dd/mm/yyyy`
    return `${dia}/${mes}/${anio}`;
  }

  recHumanoSeleccionado = false;

  filaSeleccionadaRecHumano: number | null = null;

  seleccionarFila(index: number): void {
    this.filaSeleccionadaRecHumano = index; // Guarda el índice de la fila seleccionada
  }

  //Botón nuevo RecHumano
  nuevoRecHumano(): void {
    this.myFormRecHumano.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario 
    this.phones.clear();// Limpia el FormArray de teléfonos, si es necesario
    this.addPhone = false
    this.profesionesRecurso.clear();
    this.especialidadesRecurso.clear();
    this.myFormRecHumano.patchValue({
      tipoDoc: '0',
      sexoRecHumano: '0',
      departamentoRecHumano: '15',
      provinciaRecHumano: '01',
      distritoRecHumano: '',
      gradoInstruccion: '0',
      profesionSolicitante: { profesion: "", nroColegiatura: "" } 
    });
    this.edad = '';
    this.filaSeleccionadaRecHumano = null;
    this.recHumanoSeleccionado = false;
    
    this.addProfesion = false
    this.nivelProfesionControl.setValue('0')
    this.tituloControl.setValue(false)
    this.profesionControl.setValue('0')
    this.nroColegiaturaControl.reset()
    this.universProcedenciaProfesionControl.reset()
    this.anioEgresoProfesionControl.reset()

    this.addEspecialidad  = false; 
    this.especialidadControl.setValue('0')
    this.rneControl.reset()
    this.universProcedenciaEspecialidadControl.reset()
    this.anioEgresoEspecialidadControl.reset()
   

  }
  
  //actualizar RecHumano
  actualizarRecHumano(): void {

    this.formSubmitted = true;
  
    if(this.myFormRecHumano.valid && this.validarArrayTelefono()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la actualización de este recurso?',
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
        this.myFormRecHumano.get('fechaNacimiento')?.setValue(fechaFormateada);

        if (!this.myFormRecHumano.get('profesionSolicitante')?.value) {
          this.myFormRecHumano.patchValue({
              profesionSolicitante: { profesion: "", nroColegiatura: "" }
          });
        }

        const body: IRecHumano = this.myFormRecHumano.value; //capturando los valores del component.ts

        this._recHumanoService.actualizarRecHumano(body.codRecHumano,body).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Recurso Actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimosRecHumanos(20);
            this.myFormRecHumano.reset();
            this.formSubmitted = false;
            this.nuevoRecHumano();
            this.recHumanoSeleccionado = false
          }else{
            this.myFormRecHumano.get('fechaNacimiento')?.setValue(fechaSeleccionada);
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