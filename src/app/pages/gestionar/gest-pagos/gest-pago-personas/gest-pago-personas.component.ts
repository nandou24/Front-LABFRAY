import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICotizacion, IHistorialCotizacion } from 'src/app/pages/models/pages.models';
import { CotizacionService } from 'src/app/pages/services/gestion/cotizacion.service';

@Component({
  selector: 'app-gest-pago-personas',
  templateUrl: './gest-pago-personas.component.html',
  styleUrl: './gest-pago-personas.component.scss'
})
export class GestPagoPersonasComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _cotizacionService: CotizacionService,
  ){ }
  ngOnInit(): void {
    this.ultimasCotizaciones(10);
  }

  public myFormPagoPersona:FormGroup  = this._fb.group({
      codCotizacion: '',
      version: "",
      codCliente: [''],
      nomCliente: [''],
      tipoDoc: [''],
      nroDoc: [''],
      codSolicitante: [''],
      nomSolicitante: [''],
      profesionSolicitante: [''],
      colegiatura: [''],
      subTotal: 0,
      igv: 0,
      total: 0,
      serviciosCotizacion: this._fb.array([], Validators.required)

  })

  get serviciosCotizacion(): FormArray{
      return this.myFormPagoPersona.get('serviciosCotizacion') as FormArray;
  }

  registraPago(){

  }

  timeoutBusqueda: any;

  buscarCotizaciones(){
  
    clearTimeout(this.timeoutBusqueda);

    this.timeoutBusqueda = setTimeout(() => {

      if (this.terminoBusquedaCotizacion.length >= 2) { 
        this._cotizacionService.getCotizacion(this.terminoBusquedaCotizacion).subscribe((res: ICotizacion[]) => {
          this.cotizaciones = res;
        });
      }if (this.terminoBusquedaCotizacion.length > 0) {
        this.cotizaciones = [];
      }else{
        this.ultimasCotizaciones(5);
      }
    },400)
  
  }
  
  terminoBusquedaCotizacion: any;
  cotizaciones: ICotizacion[] = [];  
  
  // Método últimas cotizaciones
  ultimasCotizaciones(cantidad:number): void {
    this._cotizacionService.getLastCotizacion(cantidad).subscribe({
      next: (res: ICotizacion[]) => {
        this.cotizaciones = res;
      },
      error: (err) => {
        console.error('Error al obtener las cotizaciones:', err);
      },
    });
  }

  seSeleccionoCotizacion: boolean = false
  filaCotizacionSeleccionada: number | null = null;
  public cotizacionCargada!: ICotizacion;
  public ultimaVersion!: IHistorialCotizacion;

  seleccionarFila(index: number): void {
    this.filaCotizacionSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  cargarCotizacion(cotizacion: ICotizacion){

    this.seSeleccionoCotizacion = true
    this.cotizacionCargada = cotizacion;
    
    // 📌 Obtener la última versión del historial
    const historial = cotizacion.historial;
    this.ultimaVersion = historial[historial.length - 1];

    // 📌 Cargar datos del paciente
    this.myFormPagoPersona.patchValue({
      codCotizacion: cotizacion.codCotizacion, 
      version: this.ultimaVersion.version,
      codCliente: this.ultimaVersion.codCliente,
      nomCliente: this.ultimaVersion.nomCliente,
      tipoDoc: this.ultimaVersion.tipoDoc,
      nroDoc: this.ultimaVersion.nroDoc,
      codSolicitante: this.ultimaVersion.codSolicitante,
      nomSolicitante: this.ultimaVersion.nomSolicitante,
      profesionSolicitante: this.ultimaVersion.profesionSolicitante,
      colegiatura: this.ultimaVersion.colegiatura,
      sumaTotalesPrecioLista: this.ultimaVersion.sumaTotalesPrecioLista,
      descuentoTotal: this.ultimaVersion.descuentoTotal,
      subTotal: this.ultimaVersion.subTotal,
      igv: this.ultimaVersion.igv,
      total: this.ultimaVersion.total,
    });

     // 📌 Cargar servicios
     this.serviciosCotizacion.clear(); // Limpiar antes de cargar
     this.ultimaVersion.serviciosCotizacion.forEach(servicio => {
       this.serviciosCotizacion.push(this._fb.group({
         codServicio: [servicio.codServicio, Validators.required],
         tipoServicio: [servicio.tipoServicio, Validators.required],
         nombreServicio: [servicio.nombreServicio, Validators.required],
         cantidad: [servicio.cantidad, [Validators.required, Validators.min(1)]],
         precioLista: [servicio.precioLista, [Validators.required, Validators.min(0)]],
         diferencia: [servicio.diferencia, [Validators.min(0)]],
         precioVenta: [servicio.precioVenta, [Validators.required, Validators.min(0)]],
         descuentoPorcentaje: [servicio.descuentoPorcentaje, [Validators.min(0), Validators.max(100)]],
         totalUnitario: [servicio.totalUnitario, [Validators.required, Validators.min(0)]]
       }));
     });

  }

}
