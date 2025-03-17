import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { ICotizacion, IPaciente, IPruebaLab, IRecHumano, IServicio } from '../../models/pages.models';
import { ServiciosService } from '../../services/servicios.service';
import Swal from 'sweetalert2';
import { CotizacionService } from '../../services/cotizacion.service';
import { RecursoHumanoService } from '../../services/recurso-humano.service';

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
  ) { }

  ngOnInit(): void {
    this.camnbioEstadoRegistroPaciente();
    this.camnbioEstadoRegistroSolicitante();
    this.ultimosServicios(10);
    this.ultimosPacientes(10);
    this.ultimosRecursosSolicitantes(10);
    this.listarServiciosFrecuentes();
  }

  public myFormCotizacion:FormGroup  = this._fb.group({
    codCotizacion: '',
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
    listaMenosDescuento: 0,
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
      listaMenosDescuento: Math.round(diferenciaTotal * 100) / 100,
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
      listaMenosDescuento: 0,
      subTotal: 0,
      igv: 0,
      total: 0
    });

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
                ...formValue,
                codCliente: formValue.estadoRegistroPaciente ? formValue.codCliente || null : null,
                nomCliente: !formValue.estadoRegistroPaciente ? formValue.nomCliente || null : null,
                tipoDoc: !formValue.estadoRegistroPaciente ? formValue.tipoDoc || null : null,
                nroDoc: !formValue.estadoRegistroPaciente ? formValue.nroDoc || null : null,
                codSolicitante: formValue.estadoRegistroSolicitante ? formValue.codSolicitante || null : null,
                nomSolicitante: !formValue.estadoRegistroSolicitante ? formValue.nomSolicitante || null : null,
                profesionSolicitante: !formValue.estadoRegistroSolicitante ? formValue.profesionSolicitante || null : null,
                colegiatura: !formValue.estadoRegistroSolicitante ? formValue.colegiatura || null : null,
                especialidadSolicitante: !formValue.estadoRegistroSolicitante ? formValue.especialidadSolicitante || null : null,
              
              }

              console.log("body aqui: ",body)
                              
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
                  //this.myFormPruebaLab.get('fechaNacimiento')?.setValue(fechaSeleccionada);
                }
              });
            }
          })
        }else{
          console.log("No procede")
        }

  }

  actualizarCotizacionPersona(){

  }

  cotizacionSeleccionada = false;

  cargarServicios(servicio: IServicio){
    this.cotizacionSeleccionada = true
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

  
}
