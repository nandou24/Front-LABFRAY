import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPaciente, IPruebaLab } from '../models/pages.models';
import { PacienteService } from '../services/paciente.service';
import { PruebaLabService } from '../services/prueba-lab.service';

@Component({
  selector: 'app-gest-cotizacion',
  templateUrl: './gest-cotizacion.component.html',
  styleUrl: './gest-cotizacion.component.scss'
})
export class GestCotizacionComponent {

  constructor(
    private _fb: FormBuilder,
    private _pacienteService: PacienteService,
    private _pruebaService: PruebaLabService,
  ) { }

  public myFormCotizacion:FormGroup  = this._fb.group({
    codCliente: ['', [Validators.required]],
    nomCliente: [''],
    nroDoc: [''],
    pruebasCotizacion: this._fb.array([], Validators.required)
  })

  get pruebasCotizacion(): FormArray{
      return this.myFormCotizacion.get('pruebasCotizacion') as FormArray;
    }

  generarCotizacion(){
  }

  terminoBusquedaPaciente: any;
  pacientes: IPaciente[] = [];

  buscarPaciente(){
    if (this.terminoBusquedaPaciente.length >= 3) { 
      this._pacienteService.getPatient(this.terminoBusquedaPaciente).subscribe((res: IPaciente[]) => {
        this.pacientes = res;
      });
    }if (this.terminoBusquedaPaciente.length > 0) {
      this.pacientes = [];
    }
  }

  seleccionarPaciente(paciente: IPaciente){
    this.myFormCotizacion.patchValue({
      codCliente: paciente.hc,
      nomCliente: paciente.apePatCliente + " " + paciente.apeMatCliente + " " + paciente.nombreCliente
    });
  
    const closeButton = document.querySelector('#modalClientes .btn-close') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  terminoBusquedaPrueba: any;
  pruebas: IPruebaLab[] = [];

  buscarPrueba(){
    if (this.terminoBusquedaPrueba.length >= 3) { 
      this._pruebaService.getPruebaLab(this.terminoBusquedaPrueba).subscribe((res: IPruebaLab[]) => {
        this.pruebas = res;
      });
    }if (this.terminoBusquedaPrueba.length > 0) {
      this.pruebas = [];
    }
  }

  pruebaSeleccionada: any = null;

  seleccionarPrueba(prueba: any) {
    this.pruebaSeleccionada = { 
      ...prueba,
      cantidad: 1,
      precioUnitario: prueba.precio,
      descuento: 0 }
  }

  agregarPrueba(){

    if (!this.pruebaSeleccionada) return;

    /*
    const existe = this.pruebasCotizacion.controls.some(
      (control) => control.value.codPruebaLab === prueba.codItemLab
    );

    if (existe) {
      console.log('Item ya está agregado')
      return;
    }

    const pruebaForm = this._fb.group({
      codPruebaLab: [prueba.codPruebaLab],
      nombrePruebaLab: [prueba.nombrePruebaLab],
      cantidad: [1, [Validators.required, Validators.min(1)]], // Cantidad inicial = 1
      precioPrueba: [prueba.precioPrueba, [Validators.required, Validators.min(0)]], // Precio unitario por defecto
      descuento: [0, [Validators.min(0), Validators.max(100)]], // Descuento inicial = 0%
      //totalUnitario: this.cantidad * precioPrueba // Total inicial = precio * cantidad
    });

    this.pruebasCotizacion.push(pruebaForm);*/

    //this.pruebasCotizacion.push(this.crearItemFormGroup(item));
  }

  private crearItemFormGroup(prueba: IPruebaLab): FormGroup {
      return this._fb.group({
        codItemLab: [prueba.codPruebaLab, Validators.required],
        nombreItemLab: [prueba.nombrePruebaLab, Validators.required],
      });
    }

  calcularTotal(): void{

  }

  removerPrueba(index: number){
      this.pruebasCotizacion.removeAt(index);
  }

}
