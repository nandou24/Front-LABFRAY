import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/pages/services/mantenimiento/paciente.service';
import { ICotizacion, IHistorialCotizacion, IPaciente, IPruebaLab, IRecHumano, IServicio } from 'src/app/pages/models/pages.models';
import { ServiciosService } from 'src/app/pages/services/mantenimiento/servicios.service';
import Swal from 'sweetalert2';
import { CotizacionService } from 'src/app/pages/services/gestion/cotizacion.service';
import { RecursoHumanoService } from 'src/app/pages/services/mantenimiento/recurso-humano.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-gest-coti-personal',
  templateUrl: './gest-coti-personal.component.html',
  styleUrl: './gest-coti-personal.component.scss'
})
export class GestCotiPersonalComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _pacienteService: PacienteService,
    private _recHumanoService: RecursoHumanoService,
    private _servicioService: ServiciosService,
    private _cotizacionService: CotizacionService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.camnbioEstadoRegistroPaciente();
    this.camnbioEstadoRegistroSolicitante();
    this.ultimosServicios(10);
    this.ultimosPacientes(10);
    this.ultimosRecursosSolicitantes(10);
    this.listarServiciosFrecuentes();
    this.ultimasCotizaciones(5);
  }

  public myFormCotizacion:FormGroup  = this._fb.group({
    codCotizacion: '',
    version: '',
    estadoRegistroPaciente: true,
    codCliente: [ { value: '', disabled: true }],
    nomCliente: [''],
    tipoDoc: [''],
    nroDoc: [''],
    estadoRegistroSolicitante: true,
    codSolicitante: [ { value: '', disabled: true }],
    nomSolicitante: [''],
    profesionSolicitante: [''],
    colegiatura: [''],
    especialidadSolicitante: [''],
    aplicarPrecioGlobal: false,
    aplicarDescuentoPorcentGlobal:  false,
    sumaTotalesPrecioLista: 0,
    descuentoTotal: 0,
    precioConDescGlobal: [ { value: '', disabled: true }],
    descuentoPorcentaje: [ { value: '', disabled: true }],
    subTotal: 0,
    igv: 0,
    total: 0,
    serviciosCotizacion: this._fb.array([], Validators.required)
  })

  get serviciosCotizacion(): FormArray{
      return this.myFormCotizacion.get('serviciosCotizacion') as FormArray;
  }

  camnbioEstadoRegistroPaciente() {
    const estado = this.myFormCotizacion.get('estadoRegistroPaciente')?.value;
  
    if (estado) {
      this.myFormCotizacion.get('codCliente')?.reset();
      this.myFormCotizacion.get('nomCliente')?.reset();
      this.myFormCotizacion.get('tipoDoc')?.setValue('0');
      this.myFormCotizacion.get('nroDoc')?.reset();
      this.myFormCotizacion.get('nomCliente')?.disable();
      this.myFormCotizacion.get('tipoDoc')?.disable();
      this.myFormCotizacion.get('nroDoc')?.disable();

    } else {
      this.myFormCotizacion.get('codCliente')?.reset();
      this.myFormCotizacion.get('nomCliente')?.reset();
      this.myFormCotizacion.get('tipoDoc')?.setValue('0');
      this.myFormCotizacion.get('nroDoc')?.reset();
      this.myFormCotizacion.get('nomCliente')?.enable();
      this.myFormCotizacion.get('tipoDoc')?.enable();
      this.myFormCotizacion.get('nroDoc')?.enable();
    }

  }

  camnbioEstadoRegistroSolicitante() {
    const estado = this.myFormCotizacion.get('estadoRegistroSolicitante')?.value;
  
    if (estado) {
      this.myFormCotizacion.get('codSolicitante')?.reset();
      this.myFormCotizacion.get('nomSolicitante')?.reset();
      this.myFormCotizacion.get('profesionSolicitante')?.reset();
      this.myFormCotizacion.get('colegiatura')?.reset();
      this.myFormCotizacion.get('especialidadSolicitante')?.reset();
      
      this.myFormCotizacion.get('codSolicitante')?.disable();
      this.myFormCotizacion.get('nomSolicitante')?.disable();
      this.myFormCotizacion.get('profesionSolicitante')?.disable();
      this.myFormCotizacion.get('colegiatura')?.disable();
      this.myFormCotizacion.get('especialidadSolicitante')?.disable();

    } else {
      this.myFormCotizacion.get('codSolicitante')?.reset();
      this.myFormCotizacion.get('nomSolicitante')?.reset();
      this.myFormCotizacion.get('profesionSolicitante')?.reset();
      this.myFormCotizacion.get('colegiatura')?.reset();
      this.myFormCotizacion.get('especialidadSolicitante')?.reset();
      
      this.myFormCotizacion.get('codSolicitante')?.enable();
      this.myFormCotizacion.get('nomSolicitante')?.enable();
      this.myFormCotizacion.get('profesionSolicitante')?.enable();
      this.myFormCotizacion.get('colegiatura')?.enable();
      this.myFormCotizacion.get('especialidadSolicitante')?.enable();

    }
  }

  //PACIENTES

  terminoBusquedaPaciente: any;
  pacientes: IPaciente[] = [];

  buscarPaciente(){

    clearTimeout(this.timeoutBusqueda);
    this.timeoutBusqueda = setTimeout(() => {
      if (this.terminoBusquedaPaciente.length >= 3) { 
        this._pacienteService.getPatientCotizacion(this.terminoBusquedaPaciente).subscribe((res: IPaciente[]) => {
          this.pacientes = res;
        });
      }if (this.terminoBusquedaPaciente.length > 0) {
        this.pacientes = [];
      }else{
        this.ultimosPacientes(5)
      }
    },400)
  }

  seleccionarPaciente(paciente: IPaciente){
    this.myFormCotizacion.patchValue({
      codCliente: paciente.hc,
      nomCliente: paciente.apePatCliente + " " + paciente.apeMatCliente + " " + paciente.nombreCliente,
      tipoDoc: paciente.tipoDoc,
      nroDoc: paciente.nroDoc
    });
  
  }

  // Método últimos pacientes
  ultimosPacientes(cantidad:number): void {
    this._pacienteService.getLastPatientsCotizacion(cantidad).subscribe({
      next: (res: IPaciente[]) => {
        this.pacientes = res;
      },
      error: (err) => {
        console.error('Error al obtener los pacientes:', err);
      },
    });
  }

  //SOLICITANTES

  terminoBusquedaMedico: any;
  timeoutBusqueda: any;
  solicitantes: IRecHumano[] = [];

  buscarSolicitante(){

    clearTimeout(this.timeoutBusqueda);

    this.timeoutBusqueda = setTimeout(() => {
      if (this.terminoBusquedaMedico.length >= 3) { 
        this._recHumanoService.getSolicitante(this.terminoBusquedaMedico).subscribe((res: IRecHumano[]) => {
          this.solicitantes = res;
        });
      }if (this.terminoBusquedaMedico.length > 0) {
        this.solicitantes = [];
      }else{
        this.ultimosRecursosSolicitantes(10)
      }
    },400)
  }

  seleccionarSolicitante(solicitante: IRecHumano){
    this.myFormCotizacion.patchValue({
      codSolicitante: solicitante.codRecHumano,
      nomSolicitante: solicitante.apePatRecHumano + " " + solicitante.apeMatRecHumano + " " + solicitante.nombreRecHumano,
      profesionSolicitante: solicitante.profesionSolicitante?.profesion,
      colegiatura: solicitante.profesionSolicitante?.nroColegiatura,
      especialidadSolicitante: this.getEspecialidadesTexto(solicitante)
    });
  
  }

  // Método últimos recursos humanos que solicitan exámenes
  ultimosRecursosSolicitantes(cantidad:number): void {
    this._recHumanoService.getRecursosSolicitantes(cantidad).subscribe({
      next: (res: IRecHumano[]) => {
        this.solicitantes = res;
      },
      error: (err) => {
        console.error('Error al obtener los solicitantes:', err);
      },
    });
  }

  getEspecialidadesTexto(solicitante: any): string {
    return solicitante.especialidadesRecurso && solicitante.especialidadesRecurso.length>0
      ? solicitante.especialidadesRecurso.map((e: any) => e.especialidad).join(', ')
      : 'No tiene especialidad';
  }

  //SERVICIO

  terminoBusquedaServicio: any;
  servicios: IServicio[] = [];
  serviciosFrecuentes: IServicio[] = [];

  // Método últimos 20* pacientes
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

  listarServiciosFrecuentes(){
    this._servicioService.getLastServicio(5).subscribe({
      next: (res: IServicio[]) => {
        this.serviciosFrecuentes = res;
      },
      error: (err) => {
        console.error('Error al obtener los servicios:', err);
      },
    });
  }

  buscarServicio(){
    if (this.terminoBusquedaServicio.length >= 3) { 
      this._servicioService.getServicio(this.terminoBusquedaServicio).subscribe((res: IServicio[]) => {
        this.servicios = res;
      });
    }if (this.terminoBusquedaServicio.length > 0) {
      this.servicios = [];
    }else{
      this.ultimosServicios(5);
    }
  }

  verDetalle(servicio: IServicio){

  }

  servicioSeleccionado: any = null;

  seleccionarServicio(servicio: IServicio) {

    // Verificar si el servicio ya está agregado
    const existe = this.serviciosCotizacion.controls.some(
      (control) => control.value.codServicio === servicio.codServicio
    );

    if (existe) {
      console.log('El servicio ya está agregado');
      return;
    }

    this.myFormCotizacion.get('aplicarPrecioGlobal')?.setValue(false);
    this.myFormCotizacion.get('aplicarDescuentoPorcentGlobal')?.setValue(false);

    // Crear un nuevo FormGroup para el servicio seleccionado
    const servicioForm = this._fb.group({
      codServicio: [servicio.codServicio, Validators.required],
      tipoServicio: [servicio.tipoServicio, Validators.required],
      nombreServicio: [servicio.nombreServicio, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]], // Cantidad editable
      precioLista: [servicio.precioServicio, [Validators.required, Validators.min(0)]], // Precio editable
      diferencia: [0, [Validators.min(0)]], // Descuento editable
      precioVenta:[servicio.precioServicio,[Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      descuentoPorcentaje: [0, [Validators.min(0), Validators.max(100)]], // Descuento editable
      totalUnitario: [servicio.precioServicio, [Validators.required, Validators.min(0)]], // Calculado automáticamente
    });

    // Agregar al FormArray
    this.serviciosCotizacion.push(servicioForm);

    Promise.resolve().then(() => {
      this.cambioEstadoDescGlobal();
      this.cambioEstadoDescPorcentajeGlobal();
    });
    
    console.log(this.serviciosCotizacion)

    Promise.resolve().then(() => {
      this.calcularTotalGeneral();
    });
    

  }

  validarEntradaEntero(event: KeyboardEvent) {
    const key = event.key;
    
    // Permitir solo números (0-9) y evitar signos, letras o espacios
    if (!/^\d$/.test(key)) {
      event.preventDefault(); // Bloquea la tecla si no es un número
    }
  }

  corregirEntero(index: number, campo: string) {
    const control = this.serviciosCotizacion.controls[index].get(campo);
    
    if (!control) return;

    let valor = parseInt(control.value, 10) || 0; // Si es NaN, lo fuerza a 0

    // Ajustar los valores según el campo
    if (campo === 'cantidad') {
      control.setValue(Math.max(1, valor)); // Mínimo 1
    } else if (campo === 'descuentoPorcentaje') {
      control.setValue(Math.min(100, Math.max(0, valor))); // Rango entre 0 y 100
    }

    this.calcularTotalUnitario(index)

  }

  validarDecimal(event: KeyboardEvent) {
    const charCode = event.key;
    const input = event.target as HTMLInputElement;

    // Permitir solo números y un punto decimal
    if (!/^\d$/.test(charCode) && charCode !== '.' && charCode !== 'Backspace') {
      event.preventDefault();
      return;
    }

    // Evitar más de un punto decimal
    if (charCode === '.' && input.value.includes('.')) {
      event.preventDefault();
      return;
    }

    // Verificar si ya hay un punto y cuántos decimales tiene
    /*
    if (input.value.includes('.')) {
      const partes = input.value.split('.');
      if (partes[1].length >= 2 && charCode !== 'Backspace') {
        event.preventDefault(); // Evitar que se escriban más de dos decimales
      }
    }*/
  }

  corregirDecimal(index: number, campo: string) {
    const control = this.serviciosCotizacion.controls[index].get(campo);
    if (control) {
      let valor = parseFloat(control.value);
  
      // Si el valor es NaN o menor a 0, lo forzamos a 0
      if (isNaN(valor) || valor < 0) {
        control.setValue(0);
      } else {
        // Redondeamos a dos decimales si tiene más
        control.setValue(valor.toFixed(2));
      }
    }
  }

  calcularTotalUnitario(index: number) {

    const servicio = this.serviciosCotizacion.at(index);
  
    const cantidad = servicio.get('cantidad')?.value || 0;
    const precioLista = servicio.get('precioLista')?.value || 0;
    let precioVenta = servicio.get('precioVenta')?.value || 0;
    let descuentoPorcentual = servicio.get('descuentoPorcentaje')?.value || 0;
    let precioListaTotal;
    let totalUnitario;

    // Validamos que el precio de venta no sea negativo
    if (precioVenta < 0) {
      servicio.get('precioVenta')?.setValue(0);
      precioVenta = 0;
    }

    if(descuentoPorcentual>100){
      descuentoPorcentual = 100
    }

    precioListaTotal = cantidad * precioLista
    totalUnitario = cantidad * Math.round((precioVenta * ((100 - descuentoPorcentual) / 100))*100)/100;

    // Calculamos la diferencia
    const diferencia = Math.round((totalUnitario - precioListaTotal)*100)/100;
    servicio.get('diferencia')?.setValue(diferencia);

/*
    // Calcular el total unitario - descuento fijo
    let total = precioVenta * cantidad
  
    // Calcular el total unitario - descuento porcentual
    total = Math.round((total * ((100 - descuentoPorcentual) / 100))*100)/100;*/
  
    if(totalUnitario < 0){
      servicio.get('totalUnitario')?.setValue("Error");
    }else{
      servicio.get('totalUnitario')?.setValue(totalUnitario);
      this.calcularTotalGeneral()
    }

  }

  removerServicio(index: number) {

    this.serviciosCotizacion.removeAt(index);
    this.calcularTotalGeneral();

    Promise.resolve().then(() => {
      const serviciosArray = this.myFormCotizacion.get('serviciosCotizacion') as FormArray;

      if (serviciosArray.length === 0) {
        this.myFormCotizacion.get('aplicarPrecioGlobal')?.setValue(false);
        this.myFormCotizacion.get('aplicarDescuentoPorcentGlobal')?.setValue(false);
        this.myFormCotizacion.get('precioConDescGlobal')?.reset();
        this.myFormCotizacion.get('precioConDescGlobal')?.disable();
        this.myFormCotizacion.get('descuentoPorcentaje')?.reset();
        this.myFormCotizacion.get('descuentoPorcentaje')?.disable();
      }
    });        
    
  }


  cambioEstadoDescGlobal() {

    const estadoPrecioGlobal = this.myFormCotizacion.get('aplicarPrecioGlobal')?.value;
    const serviciosArray = this.myFormCotizacion.get('serviciosCotizacion') as FormArray;

    if (serviciosArray.length === 0) {
      this.myFormCotizacion.get('aplicarPrecioGlobal')?.setValue(false, { emitEvent: false });

      // 🔥 SweetAlert de advertencia
      Swal.fire({
          icon: 'warning',
          title: 'No hay servicios en la cotización',
          text: 'Debes agregar al menos un servicio antes de aplicar un descuento global.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido'
      });

      return;
    }    

    if (estadoPrecioGlobal) {

      //this.myFormCotizacion.get('precioConDescGlobal')?.reset();
      this.myFormCotizacion.get('precioConDescGlobal')?.enable();
    
      serviciosArray.controls.forEach((control, index) => {
        const precioLista = parseFloat(control.get('precioLista')?.value) || 0;
        control.get('precioVenta')?.setValue(precioLista);
        control.get('precioVenta')?.disable();
        control.get('diferencia')?.setValue(0);
        this.calcularTotalUnitario(index);
      });

      this.myFormCotizacion.get('precioConDescGlobal')?.setValue(0)
      

    } else {

      this.myFormCotizacion.get('precioConDescGlobal')?.reset();
      this.myFormCotizacion.get('precioConDescGlobal')?.disable();

      serviciosArray.controls.forEach((control, index) => {
        control.get('precioVenta')?.enable();
        this.calcularTotalUnitario(index);
      });

    }

    // Asegurar que calcularTotalGeneral() se ejecute después de actualizar todos los valores
   
    Promise.resolve().then(() => {
      this.calcularTotalGeneral();
    });   

  }

  cambioEstadoDescPorcentajeGlobal() {

    const estadoPorcentGlobal = this.myFormCotizacion.get('aplicarDescuentoPorcentGlobal')?.value;
    const serviciosArray = this.myFormCotizacion.get('serviciosCotizacion') as FormArray;

    if (serviciosArray.length === 0) {
      this.myFormCotizacion.get('aplicarDescuentoPorcentGlobal')?.setValue(false, { emitEvent: false });

      // 🔥 SweetAlert de advertencia
      Swal.fire({
          icon: 'warning',
          title: 'No hay servicios en la cotización',
          text: 'Debes agregar al menos un servicio antes de aplicar un descuento porcentual.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido'
      });

      return;
    }

    if (estadoPorcentGlobal) {

      this.myFormCotizacion.get('descuentoPorcentaje')?.reset();
      this.myFormCotizacion.get('descuentoPorcentaje')?.enable();

      serviciosArray.controls.forEach((control, index) => {
        control.get('descuentoPorcentaje')?.setValue(0);
        control.get('descuentoPorcentaje')?.disable();
        control.get('diferencia')?.setValue(0);
        this.calcularTotalUnitario(index);
      });

    } else {

      this.myFormCotizacion.get('descuentoPorcentaje')?.reset();
      this.myFormCotizacion.get('descuentoPorcentaje')?.disable();

      serviciosArray.controls.forEach((control, index) => {
        control.get('descuentoPorcentaje')?.enable();
        this.calcularTotalUnitario(index);
      });
    }

    // Asegurar que calcularTotalGeneral() se ejecute después de actualizar todos los valores
   
    Promise.resolve().then(() => {
      this.calcularTotalGeneral();
    });  
  }
 
  // Calcular los totales generales
  calcularTotalGeneral() {
    
    const serviciosArray = this.myFormCotizacion.get('serviciosCotizacion') as FormArray;
    const estadoPrecioGlobal = this.myFormCotizacion.get('aplicarPrecioGlobal')?.value;
    const estadoPorcentGlobal = this.myFormCotizacion.get('aplicarDescuentoPorcentGlobal')?.value;

    let totalPrecioLista = 0;
    let sumaTotalUnitarios = 0;
    let precioGlobal = 0;

    // 1️⃣ Calcular la suma de precios de lista y la suma de totales unitarios
    serviciosArray.controls.forEach(control => {
      const precioLista = parseFloat(control.get('precioLista')?.value) || 0;
      const totalUnitario = parseFloat(control.get('totalUnitario')?.value) || 0;
      const cantidad = parseFloat(control.get('cantidad')?.value) || 0;

      totalPrecioLista += (precioLista*cantidad);
      sumaTotalUnitarios += totalUnitario;

    });


    // 2️⃣ Obtener el precio global (si el usuario lo especificó, lo usa, sino, usa la suma de totales unitarios)
    if(estadoPrecioGlobal==true){
      precioGlobal = parseFloat(this.myFormCotizacion.get('precioConDescGlobal')?.value);
    }else{
      precioGlobal = sumaTotalUnitarios;
    }    

    // 3️⃣ Obtener el descuento en porcentaje
    const descuentoPorcentaje = parseFloat(this.myFormCotizacion.get('descuentoPorcentaje')?.value) || 0;

    // 4️⃣ Calcular el total a pagar aplicando el descuento
    let totalAPagar = Math.round((precioGlobal * (1 - descuentoPorcentaje / 100)) * 100) / 100;

    // 5️⃣ Calcular la diferencia total
    let diferenciaTotal = Math.round((totalAPagar - totalPrecioLista) * 100) / 100;

    // calcular subTotal
    let calSubTotal = Math.round((totalAPagar/1.18) * 100) / 100

    // calcular IGV
    let calIgv = Math.round((totalAPagar - calSubTotal) * 100) / 100;

    // 6️⃣ Actualizar los valores en el formulario
    this.myFormCotizacion.patchValue({
      sumaTotalesPrecioLista: Math.round(totalPrecioLista * 100) / 100,
      descuentoTotal: Math.round(diferenciaTotal * 100) / 100,
      precioConDescGlobal: Math.round(precioGlobal * 100) / 100,     
      subTotal: calSubTotal,
      igv: calIgv,
      total: Math.round(totalAPagar * 100) / 100

    });    

  }

  nuevaCotizacionPersona(){

    this.myFormCotizacion.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario
    this.serviciosCotizacion.clear();
    this.myFormCotizacion.patchValue({
      estadoRegistroPaciente: true,
      estadoRegistroSolicitante: true,
      sumaTotalesPrecioLista: 0,
      descuentoTotal: 0,
      subTotal: 0,
      igv: 0,
      total: 0
    });
    this.seSeleccionoCotizacion = false;
    this.filaCotizacionSeleccionada = null;

    this.resetearVariablesAuxiliares();

    Promise.resolve().then(() => {
      this.myFormCotizacion.get('precioConDescGlobal')?.disable();
      this.myFormCotizacion.get('descuentoPorcentaje')?.disable();
      this.camnbioEstadoRegistroPaciente();
      this.camnbioEstadoRegistroSolicitante();
    });  

  }

  private resetearVariablesAuxiliares(): void {
    
    this.terminoBusquedaPaciente = "";
    this.ultimosPacientes(10);
  
    this.terminoBusquedaMedico = "";
    this.timeoutBusqueda = null;
    this.ultimosRecursosSolicitantes(10);
  
    this.terminoBusquedaServicio = "";
    this.ultimosServicios(10);
    this.servicioSeleccionado = null;
  }

  public formSubmitted: boolean = false;

  generarCotizacion(){

    this.formSubmitted = true;
    
        if(this.myFormCotizacion.valid){
    
          Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas confirmar la generación de esta cotización?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            
            if (result.isConfirmed) {
    
              console.log('Procede registro coti')
              const formValue  = this.myFormCotizacion.getRawValue();

              console.log("formvalue aqui: ", formValue)
    
              const body: ICotizacion = {
                codCotizacion: "",
                estado:"Generada",
                historial:[{
                  version: 1,
                  fechaModificacion: new Date(),
                  estadoRegistroPaciente: !!formValue.estadoRegistroPaciente,
                  codCliente: formValue.codCliente,
                  nomCliente: formValue.nomCliente,
                  tipoDoc: formValue.tipoDoc,
                  nroDoc: formValue.nroDoc,
                  estadoRegistroSolicitante: !!formValue.estadoRegistroSolicitante,
                  codSolicitante: formValue.codSolicitante,
                  nomSolicitante: formValue.nomSolicitante,
                  profesionSolicitante: formValue.profesionSolicitante,
                  colegiatura: formValue.colegiatura,
                  especialidadSolicitante: formValue.especialidadSolicitante,
                  aplicarPrecioGlobal: !!formValue.aplicarPrecioGlobal,
                  aplicarDescuentoPorcentGlobal: !!formValue.aplicarDescuentoPorcentGlobal,
                  sumaTotalesPrecioLista: formValue.sumaTotalesPrecioLista,
                  descuentoTotal: formValue.descuentoTotal,
                  precioConDescGlobal: formValue.precioConDescGlobal || 0,
                  descuentoPorcentaje: formValue.descuentoPorcentaje || 0,
                  subTotal: formValue.subTotal,
                  igv: formValue.igv,
                  total: formValue.total,
                  serviciosCotizacion: formValue.serviciosCotizacion

                }]
              
              }

              console.log("📌 **Body antes de enviar**:", body);
                              
              this._cotizacionService.generarCotizacion(body).subscribe((res) => {
                if (res !== 'ERROR') {
                  Swal.fire({
                    title: 'Confirmado',
                    text: 'Cotizacion Generada',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                  });
                  this.ultimasCotizaciones(10);
                  this.nuevaCotizacionPersona();
                  //this._router.navigateByUrl('/auth/login');
                }else{
                  console.log("❌ Error en el registro de la cotización");
                }
              });
            }
          })
        }else{
          console.log("❌ Formulario inválido, no se procede")
        }

  }

  generarVersionCotizacionPersona(){

    if (!this.seSeleccionoCotizacion) {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione una cotización',
        text: 'Debe seleccionar una cotización antes de generar una nueva versión.',
      });
      return;
    }

    Swal.fire({
      title: '¿Generar nueva versión?',
      text: 'Se creará una nueva versión de la cotización actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        
        // Obtener los valores actuales del formulario
        const formValue = this.myFormCotizacion.getRawValue();

        // Obtener el último historial de la cotización
        const ultimaVersion = this.cotizacionCargada.historial[this.cotizacionCargada.historial.length - 1];

        // Crear un nuevo historial basado en la última versión pero con datos actualizados
        const nuevaVersion: IHistorialCotizacion = {
          version: ultimaVersion.version + 1,
          fechaModificacion: new Date(),
          estadoRegistroPaciente: !!formValue.estadoRegistroPaciente,
          codCliente: formValue.codCliente,
          nomCliente: formValue.nomCliente,
          tipoDoc: formValue.tipoDoc,
          nroDoc: formValue.nroDoc,
          estadoRegistroSolicitante: !!formValue.estadoRegistroSolicitante,
          codSolicitante: formValue.codSolicitante,
          nomSolicitante: formValue.nomSolicitante,
          profesionSolicitante: formValue.profesionSolicitante,
          colegiatura: formValue.colegiatura,
          especialidadSolicitante: formValue.especialidadSolicitante,
          aplicarPrecioGlobal: !!formValue.aplicarPrecioGlobal,
          aplicarDescuentoPorcentGlobal: !!formValue.aplicarDescuentoPorcentGlobal,
          sumaTotalesPrecioLista: formValue.sumaTotalesPrecioLista,
          descuentoTotal: formValue.descuentoTotal,
          precioConDescGlobal: formValue.precioConDescGlobal || 0,
          descuentoPorcentaje: formValue.descuentoPorcentaje || 0,
          subTotal: formValue.subTotal,
          igv: formValue.igv,
          total: formValue.total,
          serviciosCotizacion: formValue.serviciosCotizacion
        } 

        // Crear el objeto de la nueva cotización con los datos del paciente y la nueva versión
        const nuevaCotizacion: ICotizacion = {
          
          codCotizacion: this.cotizacionCargada.codCotizacion, // Mismo código
          estado: "modificada",
          // Historial con la nueva versión agregada
          historial: [nuevaVersion]
        }

  
        // Enviar la nueva versión al backend
        this._cotizacionService.generarNuevaVersion(nuevaCotizacion).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Cotizacion Generada',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimasCotizaciones(10);
            this.nuevaCotizacionPersona();
            //this._router.navigateByUrl('/auth/login');
          }else{
            console.log("❌ Error en el registro de la cotización");
          }
        });
      }
    })

  }


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
  
  seSeleccionoCotizacion = false;
  filaCotizacionSeleccionada: number | null = null;

  seleccionarFila(index: number): void {
    this.filaCotizacionSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  public versionesDisponibles: number[] = [];
  public versionActual: number | null = null;
  public cotizacionCargada!: ICotizacion;

  cargarCotizacion(cotizacion: ICotizacion){
    
    this.seSeleccionoCotizacion = true
    this.cotizacionCargada = cotizacion;
    
    // Obtener todas las versiones de la cotización
    this.versionesDisponibles = cotizacion.historial.map(h => h.version as number).sort((a, b) => a - b);

    // 📌 Obtener la última versión del historial
    const ultimaVersion = cotizacion.historial[cotizacion.historial.length - 1];
    this.versionActual = ultimaVersion.version

    // 📌 Cargar datos del paciente
    this.myFormCotizacion.patchValue({
      codCotizacion: cotizacion.codCotizacion, 
      version: ultimaVersion.version,
      estado: cotizacion.estado

    });

    // 📌 Deshabilitar campos que no pueden modificarse
    this.myFormCotizacion.get('codCotizacion')?.disable();

    this.cargarVersion(ultimaVersion.version)

  }

  cargarVersion(version:number){

    const historialVersion = this.cotizacionCargada.historial.find(h => h.version === version);

    if (!historialVersion) return;

    // 📌 Cargar datos de la última versión del historial
    this.myFormCotizacion.patchValue({
      estadoRegistroPaciente: historialVersion.estadoRegistroPaciente,
      codCliente: historialVersion.codCliente || '',
      nomCliente: historialVersion.nomCliente || '',
      tipoDoc: historialVersion.tipoDoc || '',
      nroDoc: historialVersion.nroDoc || '',
      estadoRegistroSolicitante: historialVersion.estadoRegistroSolicitante,
      codSolicitante: historialVersion.codSolicitante || '',
      nomSolicitante: historialVersion.nomSolicitante || '',
      profesionSolicitante: historialVersion.profesionSolicitante || '',
      colegiatura: historialVersion.colegiatura || '',
      especialidadSolicitante: historialVersion.especialidadSolicitante || '',
      aplicarPrecioGlobal: historialVersion.aplicarPrecioGlobal,
      aplicarDescuentoPorcentGlobal: historialVersion.aplicarDescuentoPorcentGlobal,
      sumaTotalesPrecioLista: historialVersion.sumaTotalesPrecioLista,
      descuentoTotal: historialVersion.descuentoTotal||0,
      precioConDescGlobal: historialVersion.precioConDescGlobal || 0,
      descuentoPorcentaje: historialVersion.descuentoPorcentaje || 0,
      subTotal: historialVersion.subTotal,
      igv: historialVersion.igv,
      total: historialVersion.total
    });

     // 📌 Cargar servicios
    this.serviciosCotizacion.clear(); // Limpiar antes de cargar
    historialVersion.serviciosCotizacion.forEach(servicio => {
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

  // Método para cambiar de versión
  cambiarVersion(version: number){
    console.log("entro a cambiar version")

    //si seSeleccionoCotizacion es false, seguimos, sino return
    console.log("seleccionado",this.seSeleccionoCotizacion)
    if (!this.seSeleccionoCotizacion) return;

    const indexActual = this.versionesDisponibles.indexOf(this.versionActual as number);
    if (indexActual === -1) return;
    const nuevoIndex = indexActual + version;

    console.log("nuevo index", nuevoIndex)

    // Verificamos si la nueva versión está dentro de los límites
    if (nuevoIndex >= 0 && nuevoIndex < this.versionesDisponibles.length) {
      this.versionActual = this.versionesDisponibles[nuevoIndex];
      
      this.myFormCotizacion.patchValue({
        version: this.versionActual
      });

      this.cargarVersion(this.versionActual);
    }else{
      console.log("fuera de límites")
    }

  }

  irUltimaVersion() {
    if (!this.seSeleccionoCotizacion) {
        console.log("⚠️ No hay cotización seleccionada.");
        return;
    }

    if (this.versionesDisponibles.length === 1) {
        console.log("⚠️ Solo existe una version.");
        return;
    }

    // 📌 Obtener la última versión disponible
    this.versionActual = Math.max(...this.versionesDisponibles);

    console.log("✅ Ir a la última versión:", this.versionActual);

    // 📌 Actualizar la versión en el formulario
    this.myFormCotizacion.patchValue({
        version: this.versionActual
    });

    // 📌 Cargar los datos de la versión seleccionada
    this.cargarVersion(this.versionActual);
  }

  public pdfSrc: SafeResourceUrl | null = null;

  formatearFecha(fecha:Date | null){

    if (!fecha) return '';

    const nuevafecha = new Date(fecha);

    // Obtener fecha y hora local
    const dia = nuevafecha.getDate().toString().padStart(2, '0');
    const mes = (nuevafecha.getMonth() + 1).toString().padStart(2, '0'); // Enero es 0
    const anio = nuevafecha.getFullYear();

    const horas = nuevafecha.getHours().toString().padStart(2, '0');
    const minutos = nuevafecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} - ${horas}:${minutos}`;

  }

  generarPDF(preview:boolean){

    const doc = new jsPDF();

    const imagenBase64 = '/images/logo labfray.png';
    doc.addImage(imagenBase64, 'PNG', 15, 10, 22.4, 25); // (x, y, width, height)
    
    console.log("Generando  PDF", this.cotizacionCargada.codCotizacion)

    const ultimaVersion = this.cotizacionCargada.historial[this.myFormCotizacion.get('version')?.value - 1];

    const fechaDocumento = this.formatearFecha(ultimaVersion.fechaModificacion)

    doc.setProperties({
      title: `Cotizacion_${this.cotizacionCargada.codCotizacion}.pdf`,
    });

    //Encabezado
    doc.setFontSize(7);
    doc.setTextColor(139, 139, 139); 
    doc.setFont('helvetica', 'bold');
    const encX = 40;
    const encY = 15;
    const encAltoFila = 4
    doc.text('LAB FRAY SAC', encX, encY)
    doc.text('COMAS', encX, encY+encAltoFila)
    doc.setFont('helvetica', 'normal');
    doc.text('Policlínico  Av. Túpac Amaru 3809 (01) 525-6675', encX+13, encY+encAltoFila)

    doc.setFont('helvetica', 'bold');
    doc.text('CALLAO', encX, encY+encAltoFila*2)
    doc.setFont('helvetica', 'normal');
    doc.text('Laboratorio clínico  Av. Elmer Faucett 326 - Carmen de la Legua (01) 452-6316', encX+13, encY+encAltoFila*2)
    doc.text('Whatsapp: 924870728', encX, encY+encAltoFila*3)
    doc.text('E-mail: correo@labfray.pe', encX, encY+encAltoFila*4)
    doc.text('www.labfray.pe', encX, encY+encAltoFila*5)


    
    //DATOS PACIENTE

    // Coordenadas y dimensiones
    const x = 34;          // Margen izquierdo
    const y = 42;          // Posición en Y
    const anchoEtiqueta = 20;
    const anchoCampo = 109.9;
    const altoFila = 5;
    const radioEsquinas = 1;
    const colorEtiquetaR= 48 
    const colorEtiquetaG= 95
    const colorEtiquetaB= 114

    //-------FILA SUPERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(255, 255, 255); // Color del borde negro
    doc.roundedRect(x-5, y, anchoCampo, altoFila, radioEsquinas, radioEsquinas, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(x-anchoEtiqueta, y, anchoEtiqueta, altoFila, radioEsquinas, radioEsquinas, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(x-anchoEtiqueta+1,y,anchoEtiqueta,altoFila, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); 
    doc.rect(x-anchoEtiqueta,y+altoFila/2,anchoEtiqueta/4,altoFila/2, "F")

    //-------FILA INFERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(255, 255, 255); // Color del borde negro
    doc.roundedRect(x-5, y+altoFila*2, anchoCampo, altoFila, radioEsquinas, radioEsquinas, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(x-anchoEtiqueta, y+altoFila*2, anchoEtiqueta, altoFila, radioEsquinas, radioEsquinas, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(x-anchoEtiqueta+1,y+altoFila*2,anchoEtiqueta,altoFila, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); 
    doc.rect(x-anchoEtiqueta,y+altoFila*2,anchoEtiqueta/4,altoFila/2, "F")

    //------- FILAS INTERMEDIAS (1 EN ESTE CASO)
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Color del borde negro
    doc.rect(x-5, y+altoFila, anchoCampo, altoFila, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.rect(x-anchoEtiqueta, y+altoFila, anchoEtiqueta, altoFila, 'F');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(x-anchoEtiqueta+1,y+altoFila,anchoEtiqueta,altoFila, "F")

    //BORDE TOTAL
    doc.roundedRect(x-anchoEtiqueta,y,anchoEtiqueta+anchoCampo-5,altoFila*3,1,1)


    //texto primera fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Paciente', x - anchoEtiqueta + 2, y + 3.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.nomCliente || 'No registrado'}`, x + 3, y + 3.5);

    //texto segundo fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Documento', x - anchoEtiqueta + 2, y + 3.5 + altoFila);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.tipoDoc} ${ultimaVersion.nroDoc || '-'}`, x + 3, y + 3.5 + altoFila);

    //texto tercer fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('HC', x - anchoEtiqueta + 2, y + 3.5 + altoFila*2);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.codCliente || '-'}`, x + 3, y + 3.5 + altoFila*2);


    //DATOS SOLICITANTE

    // Coordenadas y dimensionesradioEsquinas
    const xSol = 34; // Margen izquierdo
    const ySol = y + 3*altoFila + 2; // Posición en Y
    const anchoEtiquetaSol = 20;
    const anchoCampoSol = 109.9;
    const altoFilaSol = 5;
    const radioEsquinasSol = 1;

    //-------FILA SUPERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(255, 255, 255); // Color del borde negro
    doc.roundedRect(xSol-5, ySol, anchoCampoSol, altoFilaSol, radioEsquinasSol, radioEsquinasSol, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(xSol-anchoEtiquetaSol, ySol, anchoEtiquetaSol, altoFilaSol, radioEsquinasSol, radioEsquinasSol, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(xSol-anchoEtiquetaSol+1,ySol,anchoEtiquetaSol,altoFilaSol, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.rect(xSol-anchoEtiquetaSol,ySol+altoFilaSol/2,anchoEtiquetaSol/4,altoFilaSol/2, "F")

    //-------FILA INFERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(255, 255, 255); // Color del borde negro
    doc.roundedRect(xSol-5, ySol+altoFilaSol*2, anchoCampoSol, altoFilaSol, radioEsquinasSol, radioEsquinasSol, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscurox
    doc.roundedRect(xSol-anchoEtiquetaSol, ySol+altoFilaSol*2, anchoEtiquetaSol, altoFilaSol, radioEsquinasSol, radioEsquinasSol, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(xSol-anchoEtiquetaSol+1,ySol+altoFilaSol*2,anchoEtiquetaSol,altoFilaSol, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); 
    doc.rect(xSol-anchoEtiquetaSol,ySol+altoFilaSol*2,anchoEtiquetaSol/4,altoFilaSol/2, "F")

    //------- FILAS INTERMEDIAS (1 EN ESTE CASO)
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Color del borde negro
    doc.rect(xSol-5, ySol+altoFilaSol, anchoCampoSol, altoFilaSol, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.rect(xSol-anchoEtiquetaSol, ySol+altoFilaSol, anchoEtiquetaSol, altoFilaSol, 'F');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(xSol-anchoEtiquetaSol+1,ySol+altoFilaSol,anchoEtiquetaSol,altoFilaSol, "F")

    //BORDE TOTAL
    doc.roundedRect(xSol-anchoEtiquetaSol,ySol,anchoEtiquetaSol+anchoCampoSol-5,altoFilaSol*3,1,1)

    //texto primera fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Profesional', xSol - anchoEtiquetaSol + 2, ySol + 3.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.nomSolicitante || 'No registrado'}`, xSol + 3, ySol + 3.5);

    //texto segundo fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Profesión', xSol - anchoEtiquetaSol + 2, ySol + 3.5 + altoFilaSol);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.profesionSolicitante || '-'}`, xSol + 3, ySol + 3.5 + altoFilaSol);

    //texto tercer fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Colegiatura', xSol - anchoEtiquetaSol + 2, ySol + 3.5 + altoFilaSol*2);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.colegiatura || '-'}`, xSol + 3, ySol + 3.5 + altoFilaSol*2);

    
    // ------------ DATOS DE DOCUMENTO -----------

    // Coordenadas y dimensionesradioEsquinas
    const espacio1 = 2;
    const anchoEtiquetaCot = 20;
    const xCot = x + anchoCampo - 5 + anchoEtiquetaCot + espacio1; // Margen izquierdo
    const yCot = y; // Posición en Y
    const anchoCampoCot = 40;
    const altoFilaCot = 5.33;
    const radioEsquinasCot = 1;
    const cantFilasIntermedias = 4;
    console.log('suma',x+anchoCampo)
    console.log('x',x)
    console.log('campo',anchoCampo)

    //-------FILA SUPERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(xCot-5, yCot, anchoCampoCot, altoFilaCot, radioEsquinasCot, radioEsquinasCot, 'DF');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(xCot-anchoEtiquetaCot, yCot, anchoEtiquetaCot, altoFilaCot, radioEsquinasCot, radioEsquinasCot, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(xCot-anchoEtiquetaCot+1,yCot,anchoEtiquetaCot,altoFilaCot, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); 
    doc.rect(xCot-anchoEtiquetaCot,yCot+altoFilaCot/2,anchoEtiquetaCot/4,altoFilaCot/2, "F")

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.rect(xCot+anchoCampoCot-5-(anchoEtiquetaCot/4),yCot+altoFilaCot/2,anchoEtiquetaCot/4,altoFilaCot/2, "F")

    //-------FILA INFERIOR
    // Dibujar campo con bordes redondeados
    doc.setDrawColor(255, 255, 255); // Color del borde negro
    doc.roundedRect(xCot-5, yCot+altoFilaCot*(1+cantFilasIntermedias), anchoCampoCot, altoFilaCot, radioEsquinasCot, radioEsquinasCot, 'D');

    // Dibujar rectángulo con fondo azul para la etiqueta
    doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
    doc.roundedRect(xCot-anchoEtiquetaCot, yCot+altoFilaCot*(1+cantFilasIntermedias), anchoEtiquetaCot, altoFilaCot, radioEsquinasCot, radioEsquinasCot, 'DF');

    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
    doc.rect(xCot-anchoEtiquetaCot+1,yCot+altoFilaCot*(1+cantFilasIntermedias),anchoEtiquetaCot,altoFilaCot, "F")
    doc.setDrawColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB);
    doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); 
    doc.rect(xCot-anchoEtiquetaCot,yCot+altoFilaCot*(1+cantFilasIntermedias),anchoEtiquetaCot/4,altoFilaCot/2, "F")

    //------- FILAS INTERMEDIAS (1 EN ESTE CASO)
    for (let i = 1; i <= cantFilasIntermedias; i++) {
      // Dibujar campo con bordes redondeados
      doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Color del borde negro
      doc.rect(xCot-5, yCot+altoFilaCot*i, anchoCampoCot, altoFilaCot, 'D');

      // Dibujar rectángulo con fondo azul para la etiqueta
      doc.setDrawColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
      doc.setFillColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB); // Azul oscuro
      doc.rect(xCot-anchoEtiquetaCot, yCot+altoFilaCot*i, anchoEtiquetaCot, altoFilaCot, 'F');

      doc.setFillColor(colorEtiquetaR,colorEtiquetaG,colorEtiquetaB); // Azul oscuro
      doc.rect(xCot-anchoEtiquetaCot+1,yCot+altoFilaCot*i,anchoEtiquetaCot,altoFilaCot, "F")
    }

    //BORDE TOTAL
    doc.roundedRect(xCot-anchoEtiquetaCot,yCot,anchoEtiquetaCot+anchoCampoCot-5,altoFilaCot*(cantFilasIntermedias+2),1,1)

    //texto primera fila
    //doc.setFontSize(8);
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'bold');
    doc.text('Datos de documento', 170, yCot + 3.5, {align: 'center'});

    //texto segundo fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Código', xCot - anchoEtiquetaCot + 2, yCot + 3.5 + altoFilaCot);
    doc.setTextColor(0, 0, 0);
    doc.text(`${this.cotizacionCargada.codCotizacion}`, xCot + ((xCot+anchoCampoCot-5)-xCot)/2, yCot + 3.5 + altoFilaCot, {align: 'center'});

    //texto tercer fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Fecha', xCot - anchoEtiquetaCot + 2, yCot + 3.5 + altoFilaCot*2);
    doc.setTextColor(0, 0, 0);
    doc.text(fechaDocumento, xCot + ((xCot+anchoCampoCot-5)-xCot)/2, yCot + 3.5 + altoFilaCot*2, {align: 'center'});

    //texto cuarta fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Versión', xCot - anchoEtiquetaCot + 2, yCot + 3.5 + altoFilaCot*3);
    doc.setTextColor(0, 0, 0);
    doc.text(`${ultimaVersion.version}`, xCot + ((xCot+anchoCampoCot-5)-xCot)/2, yCot + 3.5 + altoFilaCot*3, {align: 'center'});

    //texto quinta fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Forma de pago', xCot - anchoEtiquetaCot + 2, yCot + 3.5 + altoFilaCot*4);
    doc.setTextColor(0, 0, 0);
    doc.text(`Contado`, xCot + ((xCot+anchoCampoCot-5)-xCot)/2, yCot + 3.5 + altoFilaCot*4, {align: 'center'});

    //texto sexta fila
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont('helvetica', 'normal');
    doc.text('Validez', xCot - anchoEtiquetaCot + 2, yCot + 3.5 + altoFilaCot*5);
    doc.setTextColor(0, 0, 0);
    doc.text(`5 días`, xCot + ((xCot+anchoCampoCot-5)-xCot)/2, yCot + 3.5 + altoFilaCot*5, {align: 'center'});



    doc.setFontSize(20);
    doc.setTextColor(colorEtiquetaR, colorEtiquetaG, colorEtiquetaB);
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN', 195, 37, {align: 'right'});

    // 📌 Tabla de Servicios Cotizados
    const servicios = ultimaVersion.serviciosCotizacion.map(servicio => [
      servicio.codServicio,
      servicio.nombreServicio,
      servicio.cantidad,
      `S/ ${servicio.precioLista.toFixed(2)}`,
      `S/ ${servicio.diferencia.toFixed(2)}`,
      `S/ ${servicio.totalUnitario.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 78,
      head: [['Código', 'Nombre', 'Cantidad', 'Precio', 'Descuento', 'Total']],
      body: servicios,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 0.1, textColor: [0,0,0] },
      headStyles: { 
        fillColor: [39, 96, 114], // Azul oscuro (RGB)
        textColor: [255, 255, 255], // Texto blanco
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'left' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' }
      },
    });

    // 📌 Resumen de costos
    const espaciadoResumenCostos = 5;
    const finalY = (doc as any).lastAutoTable.finalY + espaciadoResumenCostos;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total:`, 165, finalY,{align: "right"});
    doc.text(`S/ ${ultimaVersion.sumaTotalesPrecioLista.toFixed(2)}`, 195, finalY, {align: "right"});
    doc.text(`Descuento Total:`, 165, finalY + espaciadoResumenCostos, {align: "right"});
    doc.text(`S/ ${ultimaVersion.descuentoTotal.toFixed(2)}`, 195, finalY + espaciadoResumenCostos, {align: "right"});
    doc.text(`Subtotal:`, 165, finalY + espaciadoResumenCostos*2, {align: "right"});
    doc.text(`S/ ${ultimaVersion.subTotal.toFixed(2)}`, 195, finalY + espaciadoResumenCostos*2, {align: "right"});
    doc.text(`IGV (18%):`, 165, finalY + espaciadoResumenCostos*3, {align: "right"});
    doc.text(`S/ ${ultimaVersion.igv.toFixed(2)}`, 195, finalY + espaciadoResumenCostos*3, {align: "right"});
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total a Pagar:`, 165, finalY + espaciadoResumenCostos*4+2, {align: "right"});
    doc.text(`S/ ${ultimaVersion.total.toFixed(2)}`, 195, finalY + espaciadoResumenCostos*4+2, {align: "right"});

    // 📌 Números de cuenta
    const puntoRefMediosPago = finalY + 40;
    const espaciadoCuentas = 15
    const espaciado = 6;
    const espaciadoQR = 13;
    const alturaLineaCuentas = 4;
    const inicioX = 15;
    doc.setFontSize(8);
    doc.setTextColor(139, 139, 139); // Gris oscuro
    doc.text('Números de cuenta para depositos', inicioX+75, puntoRefMediosPago+espaciadoCuentas);
    doc.text('BBVA Continental: ', inicioX+75, puntoRefMediosPago+espaciado+espaciadoCuentas);
    doc.text('Cuenta', inicioX+75, puntoRefMediosPago+espaciado+alturaLineaCuentas+espaciadoCuentas);
    doc.text('0011-0252-0100004659', inicioX+12+75,  puntoRefMediosPago+espaciado+alturaLineaCuentas+espaciadoCuentas);
    doc.text('CCI', inicioX+75,  puntoRefMediosPago+espaciado+alturaLineaCuentas*2+espaciadoCuentas);
    doc.text('011-252-000100004659-47', inicioX+12+75, puntoRefMediosPago+espaciado+alturaLineaCuentas*2+espaciadoCuentas);
    
    doc.text('Banco de crédito (BCP): ', inicioX+60+75, puntoRefMediosPago+espaciado+espaciadoCuentas);
    doc.text('Cuenta', inicioX+60+75, puntoRefMediosPago+espaciado+alturaLineaCuentas+espaciadoCuentas);
    doc.text('1912408682020', inicioX+60+12+75, puntoRefMediosPago+espaciado+alturaLineaCuentas+espaciadoCuentas);
    doc.text('CCI', inicioX+60+75, puntoRefMediosPago+espaciado+alturaLineaCuentas*2+espaciadoCuentas);
    doc.text('00219100240868202056', inicioX+60+12+75, puntoRefMediosPago+espaciado+alturaLineaCuentas*2+espaciadoCuentas);

    doc.text('Medios de pago a nombre dE LAB FRAY SAC:', 15, puntoRefMediosPago-6);

    const logoyapeBase64 = '/images/LogoYape.png';
    doc.addImage(logoyapeBase64, 'PNG', inicioX+6, puntoRefMediosPago, 12.5, 12.05); // (x, y, width, height)

    const QRyapeBase64 = '/images/QR Yape.png';
    doc.addImage(QRyapeBase64, 'PNG', inicioX, puntoRefMediosPago+espaciadoQR, 25, 25); // (x, y, width, height)

    const logoplinBase64 = '/images/LogoPlin.png';
    doc.addImage(logoplinBase64, 'PNG', inicioX+40+6, puntoRefMediosPago, 12.5, 12); // (x, y, width, height)

    const QRplinBase64 = '/images/QR Plin.png';
    doc.addImage(QRplinBase64, 'PNG', inicioX+40, puntoRefMediosPago+espaciadoQR, 25, 25); // (x, y, width, height)


    doc.text('Consideraciones:', inicioX, puntoRefMediosPago+45);
    doc.text('- Las tranferencias interbancarias deben ser inmediatas', inicioX, puntoRefMediosPago+45+alturaLineaCuentas);
    doc.text('- Compartir el pago realizado a través de yape o plin al 924870728, indicando el nombre del paciente', inicioX, puntoRefMediosPago+45+alturaLineaCuentas*2);
    doc.text('- Los pagos con tarjeta tienen un recargo del 5%, por favor priorice otro medio de pago', inicioX, puntoRefMediosPago+45+alturaLineaCuentas*3);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

      if (preview) {
        this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);

        const modal = document.getElementById('modalVistaPrevia');
        if (modal) {
          modal.style.display = 'block';
          modal.classList.add('show');
          document.body.classList.add('modal-open');
        }

      } else {
        // 📌 Descargar directamente
        doc.save(`Cotizacion_${this.cotizacionCargada.codCotizacion}.pdf`);
      }

  }
  
}
