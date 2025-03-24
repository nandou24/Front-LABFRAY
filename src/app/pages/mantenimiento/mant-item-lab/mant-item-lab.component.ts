import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IItemLab } from '../../models/pages.models';
import { ItemLabService } from '../../services/mantenimiento/item-lab.service';

@Component({
  selector: 'app-mant-item-lab',
  templateUrl: './mant-item-lab.component.html',
  styleUrl: './mant-item-lab.component.scss'
})
export class MantItemLabComponent implements OnInit {

  constructor(
        private _fb: FormBuilder,
        private _itemLabService: ItemLabService,
    ) { }


  ngOnInit(): void {

    this.ultimosItems(30);
    this.onEdadIndistintaChange();
    this.onDescripcionReglaChange();

  }

  public myFormItemLab:FormGroup  = this._fb.group({

    codItemLab:'',
    nombreItemLab:['',[Validators.required]],
    metodoItemLab:['',[Validators.required]],
    plantillaValores:['',[Validators.required]],
    unidadesRef:['',[Validators.required]],
    observItem:['',[Validators.required]],
    poseeValidacion: [false],
    paramValidacion: this._fb.array([])

  })

  onEdadIndistintaChange(): void {
    this.edadIndistinta?.valueChanges.subscribe((indistinta) => {
      if (indistinta) {
        // Si la edad es indistinta, deshabilitar y resetear los rangos de edad
        this.edadMin?.reset();
        this.edadMin?.disable();
        this.edadMax?.reset();
        this.edadMax?.disable();
      } else {
        // Si la edad no es indistinta, habilitar los rangos de edad
        this.edadMin?.enable();
        this.edadMax?.enable();
      }
    });
  }

  onDescripcionReglaChange(): void {
    this.descRegla?.valueChanges.subscribe((regla) => {
      if (regla == "Entre") {
        this.valor1?.reset();
        this.valor1?.enable();
        this.valor2?.reset();
        this.valor2?.enable();
      } else if (regla == "0") {
        this.valor1?.reset();
        this.valor1?.disable();
        this.valor2?.reset();
        this.valor2?.disable();
      } else {
        this.valor1?.reset();
        this.valor1?.enable();
        this.valor2?.reset();
        this.valor2?.disable();
      }
    });
  }

  get paramValidacion(): FormArray {
      return this.myFormItemLab.get('paramValidacion') as FormArray;
  }

  descrValidacionControl = new FormControl('', Validators.required);
  sexo =new FormControl('0', [Validators.required, Validators.pattern('^[MFU]$')]);
  edadIndistinta =new FormControl(true);
  edadMin = new FormControl({value: '', disabled: true});
  edadMax = new FormControl({value: '', disabled: true});
  descRegla = new FormControl('0');
  valor1 = new FormControl({value: '', disabled: true});
  valor2 = new FormControl({value: '', disabled: true});

  public addValidator: boolean = false;

  agregarReferencia(): void {

    this.addValidator = true

    const descrValidacion = this.descrValidacionControl
    const sexo = this.sexo
    const edadIndistinta = this.edadIndistinta
    const edadMin = this.edadMin
    const edadMax = this.edadMax
    const descRegla = this.descRegla
    const valor1 = this.valor1
    const valor2 = this.valor2

    if (descrValidacion?.valid && sexo?.valid ){

      const nuevaReferencia = this._fb.group({
        descrValidacion: [descrValidacion.value],
        sexo: [sexo.value],
        edadIndistinta: [edadIndistinta.value],
        edadMin: [edadMin.value],
        edadMax: [edadMax.value],
        descRegla: [descRegla.value],
        valor1: [valor1.value],
        valor2: [valor2.value],
        
      });

      
      this.paramValidacion.push(nuevaReferencia);
  
      this.descrValidacionControl.reset();
      this. sexo.setValue("0");
      this. edadIndistinta?.setValue(true);
      this. edadMin.reset();
      this. edadMax.reset();
      this. descRegla.setValue("0");
      this. valor1.reset();
      this. valor2.reset();

      this.addValidator = false;

    } else {
      // Marca los controles como "touched" para mostrar mensajes de error si están incompletos
      this.descrValidacionControl?.markAsTouched();
      this.sexo?.markAsTouched();
      this.edadIndistinta?.markAsTouched();
      this.edadMin?.markAsTouched();
      this.edadMax?.markAsTouched();
      this.descRegla?.markAsTouched();
      this.valor1?.markAsTouched();
      this.valor2?.markAsTouched();

    } 
  
  }

  removerReferencia(index: number): void {
    this.paramValidacion.removeAt(index);
  }

  validarArrayValores(): boolean{

    const poseeVal  = this.myFormItemLab.get('poseeValidacion')?.value;
    const valoresArray = this.myFormItemLab.get('paramValidacion') as FormArray;

    if(poseeVal===true){      

      if((valoresArray.length === 0)){
        return false
      }

    }

    return true

  }


  formSubmitted = false;

  registraItemLab(){

    this.formSubmitted = true;
            
    if(this.myFormItemLab.valid && this.validarArrayValores()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la creación de este item?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        
        if (result.isConfirmed) {

          console.log('Procede registro')
          const formValue  = this.myFormItemLab.value;

          const body: IItemLab = {
            ...formValue,
          }
          console.log("capturando valores en component.ts")
                          
          this._itemLabService.registrarItemLab(body).subscribe((res) => {
            if (res !== 'ERROR') {
              Swal.fire({
                title: 'Confirmado',
                text: 'Item Registrado',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.ultimosItems(30);
              this.nuevoItem();
            }else{

            }
          });
        }
      })
    }else{
      console.log('No Procede')
    }

  }

  actualizarItem(){

    this.formSubmitted = true;
      
    if(this.myFormItemLab.valid && this.validarArrayValores()){

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas confirmar la actualización de este item?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
      
        const body: IItemLab = this.myFormItemLab.value; //capturando los valores del component.ts

        this._itemLabService.actualizarItem(body.codItemLab,body).subscribe((res) => {
          if (res !== 'ERROR') {
            Swal.fire({
              title: 'Confirmado',
              text: 'Item Actualizado',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.ultimosItems(30);
            this.myFormItemLab.reset();
            this.formSubmitted = false;
            this.nuevoItem();
          }else{

          }
        });
      })
      }else{
        console.log('No Procede Actualización')
      }
  }

  items: IItemLab[] = [];

  // Método últimos 20* pacientes
  ultimosItems(cantidad: number): void {
    this._itemLabService.getLastItemsLab(cantidad).subscribe({
      next: (res: IItemLab[]) => {
        this.items = res;
      },
      error: (err) => {
        console.error('Error al obtener las pruebas:', err);
      },
    });
  }
  
  
  nuevoItem(){
    this.myFormItemLab.reset(); // Reinicia todos los campos del formulario
    this.formSubmitted = false; // Restablece el estado de validación del formulario
    this.paramValidacion.clear();
    this.myFormItemLab.patchValue({
      poseeValidacion: false,      
    });
    this.sexo.setValue("0");
    this.edadIndistinta?.setValue(true);
    this.descRegla.setValue("0");
    this.filaSeleccionada = null;
  }

  filaSeleccionada: number | null = null;

  seleccionarFila(index: number): void {
    this.filaSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

  terminoBusqueda: any;

  buscarItems(){
    if (this.terminoBusqueda.length >= 3) { 
      this._itemLabService.getItem(this.terminoBusqueda).subscribe((res: IItemLab[]) => {
        this.items = res;
      });
    }if (this.terminoBusqueda.length > 0) {
      this.items = [];
    }else{
      this.ultimosItems(30);
    }
  }
  
  cargarItems(item: IItemLab){
  
      this.myFormItemLab.patchValue({
        codItemLab: item.codItemLab,
        nombreItemLab: item.nombreItemLab,
        metodoItemLab: item.metodoItemLab,
        plantillaValores: item.plantillaValores,
        unidadesRef: item.unidadesRef,
        observItem: item.observItem,
        poseeValidacion: item.poseeValidacion,

      });

      this.paramValidacion.clear();

      // Agregar cada teléfono al FormArray
      item.paramValidacion.forEach((paramValidacion: any) => {
        this.paramValidacion.push(this.crearValidacionGroup(paramValidacion));
      });   
  }

  private crearValidacionGroup(paramValidacion: any): FormGroup {
    return this._fb.group({
      descrValidacion: [paramValidacion.descrValidacion],
      sexo: [paramValidacion.sexo],
      edadIndistinta: [paramValidacion.edadIndistinta],
      edadMin: [paramValidacion.edadMin],
      edadMax: [paramValidacion.edadMax],
      descRegla: [paramValidacion.descRegla],
      valor1: [paramValidacion.valor1],
      valor2: [paramValidacion.valor2]
    });
  }


  

}
