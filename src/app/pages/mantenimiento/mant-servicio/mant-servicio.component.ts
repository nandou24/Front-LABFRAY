import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from '../../services/mantenimiento/servicios.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { IServicio } from '../../models/pages.models';

@Component({
  selector: 'app-mant-servicio',
  templateUrl: './mant-servicio.component.html',
  styleUrls: ['./mant-servicio.component.scss']
})
export class MantServicioComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
      private _fb: FormBuilder,
      private _servicioService: ServiciosService
  ) { }

  ngOnInit(): void {
    this.onTipoServicioChange(),
    this.ultimosServicios(30)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método separado para manejar el cambio de departamento
  onTipoServicioChange(): void {
    /*
    this.myFormServicio.get('tipoServicio')?.valueChanges.subscribe(tipoServicio => {
      // Obtener y cargar las provincias según el departamento seleccionado
      this.obtenerExamenesPorTipo(tipoServicio)
      // Reiniciar el select de provincias
    });*/

    this.myFormServicio.get('tipoServicio')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipoServicio => {
        this.obtenerExamenesPorTipo(tipoServicio);
      });
  }

  public myFormServicio:FormGroup  = this._fb.group({

    codServicio:'',
    tipoServicio:['0',[Validators.required]],
    nombreServicio: ['',[Validators.required]],
    descripcionServicio: [''],
    precioServicio: ['',[Validators.required]],
    estadoServicio: [true,[Validators.required]],
    examenesServicio: this._fb.array([])

  });

  get examenesServicio(): FormArray {
      return this.myFormServicio.get('examenesServicio') as FormArray;
    }

  terminoServicioBusqueda: any;
  examenes: any[] = [];
  examenesFiltrados: any[] = [];

  obtenerExamenesPorTipo(tipoServicio: string) {
    // Si no se ha seleccionado nada, limpiar la lista
    if (tipoServicio === '0') {
      this.examenes = [];
      this.examenesFiltrados = [];
      return;
    }
  
    this.examenes = [];
    this.examenesFiltrados = [];
    // Llamar al backend para obtener los exámenes de ese tipo
    this._servicioService.getExamenesPorTipo(tipoServicio).subscribe({
      
      next: (res: any[]) =>{
        this.examenes = res.map((examen) => {
          return {
            codExamen: examen.codPruebaLab || examen.codEcografia || examen.codConsulta || examen.codProcedimiento,
            nombreExamen: examen.nombrePruebaLab || examen.nombreEcografia || examen.nombreConsulta || examen.nombreProcedimiento,
            //detalles: examen.descripcion || examen.metodo || examen.especialidad || 'Sin detalle'
          };
        });

        //console.log("mapeo: ")
        //console.log(this.examenes)
        this.examenesFiltrados= this.examenes.slice(0, 5);

      },
      error: (error) => {
        console.error('Error al obtener exámenes:', error);
        
      }      
    });
  }
  
  buscarExamenes(){

    const tipo = this.myFormServicio.get('tipoServicio')?.value
    
    if (this.terminoServicioBusqueda.trim().length >= 2) { 
      this.examenesFiltrados = this.examenes.filter(examen =>
        examen.nombreExamen.toLowerCase().includes(this.terminoServicioBusqueda.toLowerCase())
      );
    }
    else {
      this.examenesFiltrados = this.examenes.slice(0, 5);
    }

  }

  verDetalle(item: any): void {

  }

  agregarExamen(examen: any): void {

    const existe = this.examenesServicio.controls.some(
      (control) => control.value.codExamen  === examen.codExamen 
    );

    if (existe) {
      console.log('Item ya está agregado')
      return;
    }
    else{
      this.examenesServicio.push(this.crearExamenFormGroup(examen));
      /*this.examenesServicio.push(
        this._fb.group({
          codExamen: [examen.codExamen, Validators.required],
          nombreExamen: [examen.nombreExamen, Validators.required],
          detalle: [examen.detalle],
        })
      );*/
    }
  }

  removerExamen(index: number): void {
    this.examenesServicio.removeAt(index);
  }

  /*
  validarArrayExamenes(): boolean{

    const valoresArray = this.myFormServicio.get('examenesServicio') as FormArray;

      if((valoresArray.length === 0)){
        return false
      }

    return true

  }*/

  formSubmitted = false;

  nuevoServicio(){
    this.myFormServicio.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario
    this.examenesServicio.clear();
    this.myFormServicio.get('tipoServicio')?.enable();
    this.myFormServicio.patchValue({
      tipoServicio: '0',
      estadoServicio: '0'
    });

    this.filaSeleccionadaServicios = null;
    this.pruebaSeleccionada = false
  }

  registrarServicio(){

    this.formSubmitted = true;

    if(this.myFormServicio.valid){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la creación de este servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        
        if (result.isConfirmed) {

          console.log('Procede registro')
          const formValue  = this.myFormServicio.value;

          const body: IServicio = {
            ...formValue
          }
                          
          this._servicioService.registrarServicio(body).subscribe((res) => {
            if (res !== 'ERROR') {
              Swal.fire({
                title: 'Confirmado',
                text: 'Prueba Registrado',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.ultimosServicios(30);
              this.nuevoServicio();
              //this._router.navigateByUrl('/auth/login');
            }else{
              //this.myFormPruebaLab.get('fechaNacimiento')?.setValue(fechaSeleccionada);
            }
          });
        }
      })
    }else{
      console.log("No procede")
    }

  }

  servicios: IServicio[] = [];
  terminoBusquedaServicio: any;
  
  buscarServicio(){
    if (this.terminoBusquedaServicio.length >= 2) { 
          this._servicioService.getServicio(this.terminoBusquedaServicio).subscribe((res: IServicio[]) => {
            this.servicios = res;
          });
    }if (this.terminoBusquedaServicio.length > 0) {
      this.servicios = [];
    }else{
      this.ultimosServicios(30);
    }
  }

  actualizarServicio(){

    this.formSubmitted = true;
          
    if(this.myFormServicio.valid){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la actualización de este servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
      
      if (result.isConfirmed) {
      
        console.log('Procede actualización')
        const formValue  = this.myFormServicio.value;

        this._servicioService.actualizarServicio(formValue.codServicio,formValue).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Prueba Actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimosServicios(20);
            this.myFormServicio.reset();
            this.formSubmitted = false;
            this.nuevoServicio();
            this.pruebaSeleccionada = false
          }else{

          }
        });

      }})

    }
    else{
      console.log('No Procede Actualización')
    }

  }

  pruebaSeleccionada = false;

  filaSeleccionadaServicios: number | null = null;

  seleccionarFilaPruebas(index: number): void {
    this.filaSeleccionadaServicios = index; // Guarda el índice de la fila seleccionada
  }

  // Método últimos 20* servicios
  ultimosServicios(cantidad:number): void {
    this._servicioService.getLastServicio(cantidad).subscribe({
      next: (res: IServicio[]) => {
        this.servicios = res;
      },
      error: (err) => {
        console.error('Error al obtener los servicios:', err);
      },
    });
  }

  cargarServicios(servicio: IServicio){
  
      this.pruebaSeleccionada = true
  
      this.myFormServicio.get('tipoServicio')?.disable();
  
      this.myFormServicio.patchValue({
        codServicio: servicio.codServicio,
        tipoServicio: servicio.tipoServicio,
        nombreServicio: servicio.nombreServicio,
        descripcionServicio: servicio.descripcionServicio,
        precioServicio: servicio.precioServicio,
        estadoServicio: servicio.estadoServicio
      });
    
      this.examenesServicio.clear();
  
      // Agregar cada teléfono al FormArray
      servicio.examenesServicio.forEach((item: any) => {
        this.examenesServicio.push(this.crearExamenFormGroup(item));
      });
  }

  private crearExamenFormGroup(item: any): FormGroup {
    return this._fb.group({
      codExamen: [item.codExamen, Validators.required],
      nombreExamen: [item.nombreExamen, Validators.required],
      detalle: [item.detalle],
    });
  }

}
