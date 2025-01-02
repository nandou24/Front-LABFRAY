import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPaciente, IPruebaLab } from '../models/pages.models';
import Swal from 'sweetalert2';
import { PruebaLabService } from '../services/prueba-lab.service';

@Component({
  selector: 'app-mant-prueba-lab',
  templateUrl: './mant-prueba-lab.component.html',
  styleUrl: './mant-prueba-lab.component.scss'
})
export class MantPruebaLabComponent implements OnInit {


  constructor(
      private _fb: FormBuilder,
      private _pruebaLabService: PruebaLabService,
  ) { }

  ngOnInit(): void {
    this.ultimasPruebas();
  }

  public myFormPruebaLab:FormGroup  = this._fb.group({
     codPruebaLab:'',
          areaLab:['00',[Validators.required]],
          nombrePruebaLab: ['',[Validators.required]],
          condPreAnalitPaciente: ['',[Validators.required]],
          condPreAnalitRefer: ['',[Validators.required]],
          metodoPruebaLab:[''],
          tipoMuestra: this._fb.group({
            suero: [false],
            sangreTotal: [false],
            plasmaCitratado: [false],
            orinaAleatoria: [false],
            orina24Horas: [false],
            heces: [false],
            esputo: [false],
            saliva: [false],
            raspado: [false],
            hisopado: [false],
            secrecion: [false],
            cintaAdhesiva: [false],
            otro: [false]
          }),
          tipoTuboEnvase: this._fb.group({
            checkTuboLila: [false],
            checkTuboAmarillo: [false],
            checkTuboCeleste: [false],
            checkTuboPlomo: [false],
            checkTuboVerde: [false],
            checkCriovial: [false],
            checkFrascoEsteril: [false],
            checkFrascoNoEsteril: [false],
            checkFrasconEspatula: [false],
            checkHemocultivo: [false],
            checkMedioTransporte: [false],
            checkLamina: [false]
          }),
          tiempoEntrega:['', [Validators.required]],
          precioPrueba: ['', [Validators.required]],
          observPruebas: [''],
          estadoPrueba: ['0', [Validators.required, Validators.pattern('^[12]$')]],
          compuestaPrueba: ['0', [Validators.required]],
          tipoResultado: ['0', [Validators.required, Validators.pattern('^[12]$')]],
          sexo: ['0',[Validators.required]],
          valorRefCuali: [''],
          valorRefCuantiLimInf: [''],
          valorRefCuantiLimSup: [''],
          unidadesRef: [''],
          otrosValoresRef: [''],
          valoresReferencia: this._fb.array([])
  });

  get valoresReferencia(): FormArray {
    return this.myFormPruebaLab.get('valoresReferencia') as FormArray;
  }

  agregarReferencia(): void {
    const nuevaReferencia = this._fb.group({
      tipoResultado: this.myFormPruebaLab.get('tipoResultado')?.value,
      sexo: this.myFormPruebaLab.get('sexo')?.value,
      edadMin: this.myFormPruebaLab.get('porEdades')?.value ? this.myFormPruebaLab.get('edadMin')?.value : null,
      edadMax: this.myFormPruebaLab.get('porEdades')?.value ? this.myFormPruebaLab.get('edadMax')?.value : null,
      limiteInferior: this.myFormPruebaLab.get('limiteInferior')?.value || null,
      limiteSuperior: this.myFormPruebaLab.get('limiteSuperior')?.value || null,
      unidades: this.myFormPruebaLab.get('unidades')?.value || null,
    });
  
    this.valoresReferencia.push(nuevaReferencia);
  
    // Limpiar el formulario (excepto la tabla)
    this.myFormPruebaLab.patchValue({
      tipoResultado: '1',
      sexo: 'U',
      porEdades: false,
      edadMin: null,
      edadMax: null,
      limiteInferior: '',
      limiteSuperior: '',
      unidades: '',
    });
    this.myFormPruebaLab.get('edadMin')?.disable();
    this.myFormPruebaLab.get('edadMax')?.disable();
  }

  removerReferencia(index: number): void {
    this.valoresReferencia.removeAt(index);
  }

  formSubmitted = false;

  registraPruebaLab(){

    this.formSubmitted = true;
        
          if(this.myFormPruebaLab.valid){
    
            Swal.fire({
              title: '¿Estás seguro?',
              text: '¿Deseas confirmar la creación de este paciente?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí, confirmar',
              cancelButtonText: 'Cancelar',
            }).then((result) => {
              
              if (result.isConfirmed) {
    
                console.log('Procede registro')
                const formValue  = this.myFormPruebaLab.value;
                
                // Filtrar solo los checkboxes seleccionados de tipo muestra
                const tipoMuestraSeleccionado = Object.keys(formValue.tipoMuestra)
                .filter((key) => formValue.tipoMuestra[key])
                .map((key) => key); // Devuelve un array con las claves marcadas

                // Filtrar solo los checkboxes seleccionados de tipo tubo
                const tipoTuboEnvaseSeleccionado = Object.keys(formValue.tipoTuboEnvase)
                .filter((key) => formValue.tipoTuboEnvase[key])
                .map((key) => key); // Devuelve un array con las claves marcadas

                const body: IPruebaLab = {
                  ...formValue,
                  tipoMuestra: tipoMuestraSeleccionado, //solo los seleccionados
                  tipoTuboEnvase: tipoTuboEnvaseSeleccionado //solo los seleccionados
                }
                console.log("capturando valores en component.ts")
                                
                this._pruebaLabService.registrarPruebaLab(body).subscribe((res) => {
                  if (res !== 'ERROR') {
                    Swal.fire({
                      title: 'Confirmado',
                      text: 'Prueba Registrado',
                      icon: 'success',
                      confirmButtonText: 'Ok',
                    });
                    this.ultimasPruebas();
                    this.myFormPruebaLab.reset();
                    this.formSubmitted = false;
                    //this._router.navigateByUrl('/auth/login');
                  }else{
                    //this.myFormPruebaLab.get('fechaNacimiento')?.setValue(fechaSeleccionada);
                  }
                });
              }
            })
          }else{
            console.log('No Procede')
          }
    
  }


  pruebas: IPruebaLab[] = [];

  // Método últimos 20* pacientes
  ultimasPruebas(): void {
    this._pruebaLabService.getLastPruebasLab().subscribe({
      next: (res: IPruebaLab[]) => {
        this.pruebas = res;
      },
      error: (err) => {
        console.error('Error al obtener las pruebas:', err);
      },
    });
  }


  nuevaPrueba(){
    this.myFormPruebaLab.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario 
    this.myFormPruebaLab.patchValue({
      areaLab: '00',
      estadoPrueba: '0',
      compuestaPrueba: '0',
      tipoResultado: '0'
    });
    this.filaSeleccionada = null;
  }

  actualizarPrueba(){

  }

  terminoBusqueda: any;

  buscarPruebas(){

  }

  

  cargarPruebas(prueba: IPruebaLab){

    this.myFormPruebaLab.patchValue({
      codPruebaLab: prueba.codPruebaLab,
      areaLab: prueba.areaLab,
      nombrePruebaLab: prueba.nombrePruebaLab,
      condPreAnalitPaciente: prueba.condPreAnalitPaciente,
      condPreAnalitRefer: prueba.condPreAnalitRefer,
      metodoPruebaLab: prueba.metodoPruebaLab,
      tiempoEntrega: prueba.tiempoEntrega,
      precioPrueba: prueba.precioPrueba,
      observPruebas: prueba.observPruebas,
      estadoPrueba: prueba.estadoPrueba,
      compuestaPrueba: prueba.compuestaPrueba,
      tipoResultado: prueba.tipoResultado,
      valorRefCuali: prueba.valorRefCuali,
      valorRefCuantiLimInf: prueba.valorRefCuantiLimInf,
      valorRefCuantiLimSup: prueba.valorRefCuantiLimSup,
      unidadesRef: prueba.unidadesRef,
      otrosValoresRef: prueba.otrosValoresRef

    });

    // Actualizar los checkboxes de tipoTuboEnvase
    const tipoTuboEnvaseFormGroup = this.myFormPruebaLab.get('tipoTuboEnvase') as FormGroup;
    Object.keys(tipoTuboEnvaseFormGroup.controls).forEach((key) => {
      tipoTuboEnvaseFormGroup.get(key)?.setValue(prueba.tipoTuboEnvase.includes(key));
    });

    // Actualizar los checkboxes de tipoTuboEnvase
    const tipoMuestraFormGroup = this.myFormPruebaLab.get('tipoMuestra') as FormGroup;
    Object.keys(tipoMuestraFormGroup.controls).forEach((key) => {
      tipoMuestraFormGroup.get(key)?.setValue(prueba.tipoMuestra.includes(key));
    });

  }

  filaSeleccionada: number | null = null;

  seleccionarFila(index: number): void {
    this.filaSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

}
