import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPaciente } from '../models/pages.models';

@Component({
  selector: 'app-mant-prueba-lab',
  templateUrl: './mant-prueba-lab.component.html',
  styleUrl: './mant-prueba-lab.component.scss'
})
export class MantPruebaLabComponent {


  constructor(
      private _fb: FormBuilder
  ) { }

  public myFormPruebaLab:FormGroup  = this._fb.group({
 
  });

  registraPruebaLab(){
    
  }

  formSubmitted = false;

  nuevaPrueba(){

  }

  actualizarPrueba(){

  }

  terminoBusqueda: any;

  buscarPruebas(){

  }

  pruebas: IPaciente[] = [];

  cargarPruebas(paciente: IPaciente){

  }

  filaSeleccionada: number | null = null;

  seleccionarFila(index: number): void {
    this.filaSeleccionada = index; // Guarda el índice de la fila seleccionada
  }

}
