import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICotizacion, IHistorialCotizacion } from 'src/app/pages/models/pages.models';
import { DatepickerService } from 'src/app/pages/services/utilitarios/datepicker.service';
import { CotizacionService } from 'src/app/pages/services/gestion/cotizacion.service';
import Swal from 'sweetalert2';
import { NumbersService } from 'src/app/pages/services/utilitarios/numbers.service';
import { PagoService } from 'src/app/pages/services/gestion/pago.service';

@Component({
  selector: 'app-gest-pago-personas',
  templateUrl: './gest-pago-personas.component.html',
  styleUrl: './gest-pago-personas.component.scss'
})
export class GestPagoPersonasComponent implements OnInit {

  constructor(
    private _datePickerService:  DatepickerService,
    private _fb: FormBuilder,
    private _cotizacionService: CotizacionService,
    private _numbers: NumbersService,
    private _pagoService: PagoService
    
  ){ }
  ngOnInit(): void {
    this._datePickerService.loadScript();
    this.ultimasCotizacionesPorPagar(10);
    this.ultimasCotizacionesPagadas(10);
    (window as any).setFechaPago = (fechaStr: string) => {
      this.fechaPagoControl.setValue(fechaStr);
    };

  }

  public myFormPagoPersona:FormGroup  = this._fb.group({
      codPago: '',
      fechaPago: '',
      codCotizacion: '',
      version: "",
      fechaCotizacion: '',
      estadoCotizacion: '',
      codCliente: '',
      nomCliente: '',
      tipoDoc: '',
      nroDoc: '',
      codSolicitante: '',
      nomSolicitante: '',
      profesionSolicitante: '',
      colegiatura: '',
      sumaTotalesPrecioLista: 0,
      descuentoTotal: 0,
      subTotal: 0,
      igv: 0,
      total: 0,
      serviciosCotizacion: this._fb.array([], Validators.required),
      detallePagos: this._fb.array([],Validators.required),
      faltaPagar: 0,
      subTotalFacturar: 0,
      igvFacturar: 0,
      totalFacturar: 0,
      estadPago:''
  })

  get serviciosCotizacion(): FormArray{
      return this.myFormPagoPersona.get('serviciosCotizacion') as FormArray;
  }

  get detallePagos(): FormArray{
    return this.myFormPagoPersona.get('detallePagos') as FormArray;
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
        this.ultimasCotizacionesPorPagar(5);
      }
    },400)
  
  }
  
  terminoBusquedaCotizacion: any;
  cotizaciones: ICotizacion[] = [];
  cotizacionesPagadas: ICotizacion[] = [];  
  
  // Método últimas cotizaciones
  ultimasCotizacionesPorPagar(cantidad:number): void {
    this._cotizacionService.getLatestCotizacioPorPagar(cantidad).subscribe({
      next: (res: ICotizacion[]) => {
        this.cotizaciones = res;
      },
      error: (err) => {
        console.error('Error al obtener las cotizaciones:', err);
      },
    });
  }

  // Método últimas cotizaciones pagadas
  ultimasCotizacionesPagadas(cantidad:number): void {
    this._cotizacionService.getLatestCotizacioPagadas(cantidad).subscribe({
      next: (res: ICotizacion[]) => {
        this.cotizacionesPagadas = res;
      },
      error: (err) => {
        console.error('Error al obtener las cotizaciones:', err);
      },
    });
  }

  seSeleccionoCotizacion: boolean = false
  filaCotizacionPorPagarSeleccionada: number | null = null;
  filaCotizacionPagadaSeleccionada: number | null = null;
  public ultimaVersion!: IHistorialCotizacion;

  seleccionarFilaCotiPorPagar(index: number): void {
    this.filaCotizacionPagadaSeleccionada = null;
    this.filaCotizacionPorPagarSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  seleccionarFilaCotisPagadas(index: number): void {
    this.filaCotizacionPorPagarSeleccionada = null; 
    this.filaCotizacionPagadaSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  cargarCotizacion(cotizacion: ICotizacion){

    //this.pagarNuevaCotizacion();
    this.myFormPagoPersona.reset(); // Reinicia todos los campos del formulario
    this.seSeleccionoCotizacion = true
    this.detallePagos.clear();
    // 📌 Obtener la última versión del historial
    if(cotizacion.estadoCotizacion !== 'PAGO TOTAL'){
      this.seSeleccionoCotizacion = false;
    }

    const historial = cotizacion.historial;
    this.ultimaVersion = historial[historial.length - 1];

    // 📌 Cargar datos del paciente
    this.myFormPagoPersona.patchValue({
      codCotizacion: cotizacion.codCotizacion, 
      version: this.ultimaVersion.version,
      fechaCotizacion: this.formatearFecha(this.ultimaVersion.fechaModificacion),
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
      estadoCotizacion: cotizacion.estadoCotizacion
    });

    if(cotizacion.estadoCotizacion === 'PAGO PARCIAL' || cotizacion.estadoCotizacion === 'PAGO TOTAL'){

      this._pagoService.getDetallePago(cotizacion.codCotizacion).subscribe({

        next: (data) => {
          data.forEach((pago: any) => {
            this.detallePagos.push(this._fb.group({
              medioPago: [pago.medioPago, Validators.required],
              monto: [pago.monto, Validators.required],
              montoConRecargo: [pago.montoConRecargo],
              numOperacion: [pago.numOperacion],
              fechaPago: [this.formatearFecha(pago.fechaPago), Validators.required],
              banco: [pago.banco],
              esAntiguo: [pago.esAntiguo]
            }));
          });
          this.actualizarTotalesPago();
        },
        error: (err) => {
          console.error('Error al obtener los detalles de pago:', err);
        }

      })

    }else{
      this.actualizarTotalesPago();
    }

    this.montoControl.setValue(this.ultimaVersion.total);
    this.montoControl.enable();
    this.medioPagoControl.enable()
    this.fechaPagoControl.enable()
    

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

  // Función para formatear la fecha en dd/mm/YYYY
  formatearFecha(fecha: Date | string | null): string {
    if (!fecha) return '-';

    const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString();
    const [anio, mes, dia] = fechaStr.split('T')[0].split('-');
    // Retorna en formato `dd/mm/yyyy`
    return `${dia}/${mes}/${anio}`;
  }

  fechaPagoHoy: Date = new Date();

  public addPago: boolean = false;
  medioPagoControl = new FormControl({ value: '0', disabled: true}, [Validators.required, Validators.pattern('^(?!0).*$')]);
  montoControl = new FormControl({ value: 0, disabled: true}, [Validators.required, Validators.min(0.1)] );
  numOperacionControl = new FormControl({ value: '', disabled: true});
  fechaPagoControl = new FormControl({value: this.formatearFecha(this.fechaPagoHoy), disabled:true }, [Validators.required]);
  bancoControl = new FormControl({ value: '', disabled: true});

  onFechaDetallePago(event: Event): void {
    const inputValue = event.target as HTMLInputElement;
    const fechadetallePago = inputValue.value;  // Obtener el valor actual del input
    //console.log('Valor del input cambiado:', fechaNacimiento);
    // Aquí puedes realizar cualquier validación o transformación del valor de la fecha
    this.fechaPagoControl.setValue(fechadetallePago)
  }

  agregaPago(){

    this.addPago = true;  // Activar validaciones al hacer clic en "Agregar"
  
    const medioPago = this.medioPagoControl
    const monto = this.montoControl
    const numOperacion = this.numOperacionControl
    const fechaPago = this.fechaPagoControl
    const banco = this.bancoControl
  
    if (medioPago?.valid && monto?.valid) {

      const medio = medioPago.value;
      const baseMonto = Number(monto.value);
      const porcentajeRecargo = Math.round(((medio === 'Tarjeta Crédito' || medio === 'Tarjeta Débito') ? 0.05 : 0) *100)/100;
      const montoConRecargo = Math.round((baseMonto + (baseMonto * porcentajeRecargo))*100)/100;

      // ✅ Validar que no se sobrepase el total de cotización
      const totalActual = this.detallePagos.value.reduce((acc: number, p: any) => acc + Number(p.monto), 0);
      const totalCotizacion = Number(this.myFormPagoPersona.get('total')?.value || 0);

      if ((totalActual + baseMonto) > totalCotizacion) {
        Swal.fire({
          icon: 'warning',
          title: 'Monto excedido',
          text: 'No se puede agregar este pago. La suma total supera el monto de la cotización.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#0d6efd'
        });
        return
      }

      const nuevoDetallePagoFormGroup = this._fb.group({
        medioPago: [medio],
        monto: [baseMonto],
        montoConRecargo: [montoConRecargo],
        numOperacion: [numOperacion.value],
        fechaPago: [fechaPago.value],
        banco: [banco.value]
      });
  
      // Agrega el nuevo grupo al array `phones`
      this.detallePagos.push(nuevoDetallePagoFormGroup);
  
      // Limpia los campos `phoneNumber` y `descriptionPhone` después de agregar el teléfono
      this.medioPagoControl.reset();
      this.medioPagoControl.setValue('0');
      this.montoControl.reset();
      this.numOperacionControl.reset();
      this.numOperacionControl.disable();
      this.fechaPagoControl.reset();
      this.fechaPagoControl.setValue(this.formatearFecha(this.fechaPagoHoy));
      this.bancoControl.reset();
      this.actualizarTotalesPago();
  
      this.addPago = false;  // Desactivar validaciones después de agregar

    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      console.log('Error en validación')
      this.medioPagoControl?.markAsTouched();
      this.montoControl?.markAsTouched();
    }

  }

  validarDecimal(event: KeyboardEvent) {

    this._numbers.validarDecimal(event);

  }


  actualizarTotalesPago() {
    const total = Number(this.myFormPagoPersona.get('total')?.value || 0);
    const pagos = this.detallePagos.value;
  
    const totalSinRecargo = pagos.reduce((acc: number, p: any) => acc + Number(p.monto), 0);
    const totalConRecargo = Math.round((pagos.reduce((acc: number, p: any) => acc + Number(p.montoConRecargo), 0))*100)/100;

    const falta =  Math.round(Math.max(0, total - totalSinRecargo)*100)/100;
    const subTotal = Math.round((totalConRecargo / 1.18)*1000)/1000;
    const igv = Math.round((totalConRecargo - subTotal)*1000)/1000;
    
    this.myFormPagoPersona.patchValue({
      faltaPagar: falta,
      subTotalFacturar: subTotal,
      igvFacturar: igv,
      totalFacturar: totalConRecargo
    });
  }

  getFaltaPagar(): number {
    const totalSinRecargo = this.detallePagos.value.reduce((acc: number, p: any) => acc + p.monto, 0);
    return Math.max(0, this.myFormPagoPersona.get('total')?.value - totalSinRecargo);
  }

  getTotalFacturar(): number {
    return this.detallePagos.value.reduce((acc: number, p: any) => acc + p.montoConRecargo, 0);
  }

  removePago(index: number){
    this.detallePagos.removeAt(index);
    this.actualizarTotalesPago();

    if (this.detallePagos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin pagos',
        text: 'Debe registrar al menos un pago para continuar.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
  }

  cambioMedioPago(){
    const medioPago = this.medioPagoControl.value;
    
    if (medioPago === 'Transferencia') {
      this.numOperacionControl.enable();
      this.numOperacionControl.reset();
      this.bancoControl.enable();
      this.bancoControl.reset();
    } else if(medioPago === '0' || medioPago === 'Efectivo'){
      this.numOperacionControl.disable();
      this.numOperacionControl.reset();
      this.bancoControl.disable();      
      this.bancoControl.reset();
    } else {
      this.numOperacionControl.enable();
      this.numOperacionControl.reset();
      this.bancoControl.disable();      
      this.bancoControl.reset();
    }

  }

  parsearFechaDDMMYYYY(fechaStr: string): Date {
    const [dia, mes, anio] = fechaStr.split('/');
    return new Date(`${anio}-${mes}-${dia}`);
  }

  formSubmitted : boolean = false

  registrarPagos(){

    this.formSubmitted = true;

    if (this.detallePagos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin pagos',
        text: 'Debe registrar al menos un pago para continuar.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    const falta = Number(this.myFormPagoPersona.get('faltaPagar')?.value || 0);
    const tienePagosAnteriores = this.detallePagos.value.some((p: any) => p.esAntiguo);

    if (falta > 0) {
      Swal.fire({
        title: 'Pago parcial',
        icon: 'warning',
        html: `Aún falta pagar <strong>S/ ${falta.toFixed(2)}</strong>.<br><br>¿Deseas registrar este pago parcial?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar pago parcial',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#f59e0b'
      }).then((result) => {
        if (result.isConfirmed) {
          this.enviarVenta('PAGO PARCIAL', tienePagosAnteriores);
        }
      });
    } else {
      Swal.fire({
        title: '¿Registrar venta?',
        text: 'La venta será registrada como pagada en su totalidad.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#198754'
      }).then((result) => {
        if (result.isConfirmed) {
          this.enviarVenta('PAGO TOTAL', tienePagosAnteriores);
        }
      });
    }

  }

  enviarVenta(estado: 'PAGO TOTAL' | 'PAGO PARCIAL', tienePagosAnteriores: boolean) {
    const pago = this.myFormPagoPersona.getRawValue();
    pago.estadoCotizacion = estado;
    pago.estadoPago = 'REGISTRADO';
    pago.fechaPago = new Date();
    pago.tienePagosAnteriores = tienePagosAnteriores;

    // 🔁 Formatear todas las fechas de los pagos a tipo Date
    pago.detallePagos = pago.detallePagos.map((p: any) => ({
      ...p,
      fechaPago: this.parsearFechaDDMMYYYY(p.fechaPago)
    }));
  
    this._pagoService.registrarPago(pago).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Confirmado',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        this.pagarNuevaCotizacion();
      },
      error: (err) => {
        const mensaje = err?.error?.msg || err.message || 'No se pudo registrar el pago. Intenta nuevamente.';
  
        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  pagarNuevaCotizacion(){

    this.myFormPagoPersona.reset(); // Reinicia todos los campos del formulario
    this.detallePagos.clear();
    this.serviciosCotizacion.clear();
    this.addPago = false;
    this.seSeleccionoCotizacion = false;
    this.filaCotizacionPorPagarSeleccionada = null;
    this.filaCotizacionPagadaSeleccionada = null;
    this.cotizaciones = [];
    this.terminoBusquedaCotizacion = '';
    this.ultimasCotizacionesPorPagar(5);
    this.ultimasCotizacionesPagadas(5);

  }

}
