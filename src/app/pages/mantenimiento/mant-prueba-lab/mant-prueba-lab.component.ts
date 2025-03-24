import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IItemLab, IPruebaLab } from '../../models/pages.models';
import Swal from 'sweetalert2';
import { PruebaLabService } from '../../services/mantenimiento/prueba-lab.service';
import { ItemLabService } from '../../services/mantenimiento/item-lab.service';

@Component({
  selector: 'app-mant-prueba-lab',
  templateUrl: './mant-prueba-lab.component.html',
  styleUrl: './mant-prueba-lab.component.scss'
})
export class MantPruebaLabComponent implements OnInit {

  constructor(
      private _fb: FormBuilder,
      private _pruebaLabService: PruebaLabService,
      private _itemLabService: ItemLabService
  ) { }

  ngOnInit(): void {
    this.ultimasPruebas();
    this.ultimosItems(5);
  }

  public myFormPruebaLab:FormGroup  = this._fb.group({
          codPruebaLab:'',
          areaLab:['00',[Validators.required, validarAreaLab()]],
          nombrePruebaLab: ['',[Validators.required]],
          condPreAnalitPaciente: ['',[Validators.required]],
          condPreAnalitRefer: ['',[Validators.required]],
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
          tiempoEntrega:['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
          observPruebas: [''],
          estadoPrueba: ['0', [Validators.required, Validators.pattern('^[12]$')]],
          itemsCompenentes: this._fb.array([])
  });


  get itemsCompenentes(): FormArray {
    return this.myFormPruebaLab.get('itemsCompenentes') as FormArray;
  }


  mostrarAlerta: boolean = false;

  agregarItem(item: any): void {

    const existe = this.itemsCompenentes.controls.some(
      (control) => control.value.codItemLab === item.codItemLab
    );

    if (existe) {
      console.log('Item ya está agregado')
      return;
    }

    this.itemsCompenentes.push(this.crearItemFormGroup(item));
  
  }

  private crearItemFormGroup(item: IItemLab): FormGroup {
    return this._fb.group({
      codItemLab: [item.codItemLab, Validators.required],
      nombreItemLab: [item.nombreItemLab, Validators.required],
      observItem: [item.observItem],
    });
  }
  
  removerItem(index: number): void {
    this.itemsCompenentes.removeAt(index);
  }

  terminoItemBusqueda: any;
  items: IItemLab[] = [];

  buscarItems(){

    if (this.terminoItemBusqueda.length >= 2) { 
      this._itemLabService.getItem(this.terminoItemBusqueda).subscribe((res: IItemLab[]) => {
        this.items = res;
      });
    }if (this.terminoItemBusqueda.length > 0) {
      this.items = [];
    }else{
      this.ultimosItems(5);
    }

  }

  validarArrayItems(): boolean{

    const valoresArray = this.myFormPruebaLab.get('itemsCompenentes') as FormArray;

      if((valoresArray.length === 0)){
        return false
      }

    return true

  }


  validarTipoMuestra(): boolean{

    const formValue  = this.myFormPruebaLab.value;
                
    // Filtrar solo los checkboxes seleccionados de tipo muestra
    const tipoMuestraSeleccionado = Object.keys(formValue.tipoMuestra)
    .filter((key) => formValue.tipoMuestra[key])
    .map((key) => key); // Devuelve un array con las claves marcadas

    if(tipoMuestraSeleccionado.length > 0){
      return true
    }

    return false
  }

  validarTipoEnvase(): boolean{

    const formValue  = this.myFormPruebaLab.value;
                
    // Filtrar solo los checkboxes seleccionados de tipo muestra
    const tipoEnvaseSeleccionado = Object.keys(formValue.tipoTuboEnvase)
    .filter((key) => formValue.tipoTuboEnvase[key])
    .map((key) => key); // Devuelve un array con las claves marcadas

    if(tipoEnvaseSeleccionado.length > 0){
      return true
    }

    return false
  }

  formSubmitted = false;

  registraPruebaLab(){

    this.formSubmitted = true;
        
    if(this.myFormPruebaLab.valid && this.validarArrayItems() && this.validarTipoMuestra() && this.validarTipoEnvase()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la creación de esta prueba?',
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
              this.nuevaPrueba();
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

  // Método últimos 20* pruebas
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

  // Método últimos 20* pacientes
  ultimosItems(cantidad:number): void {
    this._itemLabService.getLastItemsLab(cantidad).subscribe({
      next: (res: IItemLab[]) => {
        this.items = res;
      },
      error: (err) => {
        console.error('Error al obtener las pruebas:', err);
      },
    });
  }


  nuevaPrueba(){
    this.myFormPruebaLab.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario
    this.itemsCompenentes.clear();
    this.myFormPruebaLab.get('nombrePruebaLab')?.enable();
    this.myFormPruebaLab.get('areaLab')?.enable();
    this.myFormPruebaLab.patchValue({
      areaLab: '00',
      estadoPrueba: '0'
    });

    this.filaSeleccionadaPruebas = null;
    this.pruebaSeleccionada = false
  }

  actualizarPrueba(){

    this.formSubmitted = true;
      
    if(this.myFormPruebaLab.valid && this.validarArrayItems() && this.validarTipoMuestra() && this.validarTipoEnvase()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la actualización de esta prueba?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
      
      if (result.isConfirmed) {
      
        console.log('Procede actualización')
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

        this._pruebaLabService.actualizarPruebaLab(body.codPruebaLab,body).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Prueba Actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimasPruebas();
            this.myFormPruebaLab.reset();
            this.formSubmitted = false;
            this.nuevaPrueba();
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

  terminoBusquedaPrueba: any;

  buscarPruebas(){
    if (this.terminoBusquedaPrueba.length >= 2) { 
          this._pruebaLabService.getPruebaLab(this.terminoBusquedaPrueba).subscribe((res: IPruebaLab[]) => {
            this.pruebas = res;
          });
    }if (this.terminoBusquedaPrueba.length > 0) {
      this.pruebas = [];
    }else{
      this.ultimasPruebas();
    }
  }

  pruebaSeleccionada = false;

  cargarPruebas(prueba: IPruebaLab){

    this.pruebaSeleccionada = true

    this.myFormPruebaLab.get('nombrePruebaLab')?.disable();
    this.myFormPruebaLab.get('areaLab')?.disable();

    this.myFormPruebaLab.patchValue({
      codPruebaLab: prueba.codPruebaLab,
      areaLab: prueba.areaLab,
      nombrePruebaLab: prueba.nombrePruebaLab,
      condPreAnalitPaciente: prueba.condPreAnalitPaciente,
      condPreAnalitRefer: prueba.condPreAnalitRefer,
      tiempoEntrega: prueba.tiempoEntrega,
      observPruebas: prueba.observPruebas,
      estadoPrueba: prueba.estadoPrueba
    });

    // Actualizar los checkboxes de tipoTuboEnvase
    const tipoMuestraFormGroup = this.myFormPruebaLab.get('tipoMuestra') as FormGroup;
    Object.keys(tipoMuestraFormGroup.controls).forEach((key) => {
      tipoMuestraFormGroup.get(key)?.setValue(prueba.tipoMuestra.includes(key));
    });

    // Actualizar los checkboxes de tipoTuboEnvase
    const tipoTuboEnvaseFormGroup = this.myFormPruebaLab.get('tipoTuboEnvase') as FormGroup;
    Object.keys(tipoTuboEnvaseFormGroup.controls).forEach((key) => {
      tipoTuboEnvaseFormGroup.get(key)?.setValue(prueba.tipoTuboEnvase.includes(key));
    });

    this.itemsCompenentes.clear();

    // Agregar cada teléfono al FormArray
    prueba.itemsCompenentes.forEach((item: any) => {
      this.itemsCompenentes.push(this.crearItemFormGroup(item));
    });

  }


  filaSeleccionadaPruebas: number | null = null;

  seleccionarFilaPruebas(index: number): void {
    this.filaSeleccionadaPruebas = index; // Guarda el índice de la fila seleccionada
  }

}

export function validarAreaLab(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value !== '00' ? null : { areaInvalida: true };
  };
}
