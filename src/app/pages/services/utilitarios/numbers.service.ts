import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor() { }

  validarEntradaEntero(event: KeyboardEvent) {
    
    const key = event.key;
    
    // Permitir solo números (0-9) y evitar signos, letras o espacios
    if (!/^\d$/.test(key)) {
      event.preventDefault(); // Bloquea la tecla si no es un número
    }
  }
  
  corregirEntero(control: any, campo: string) {

    let valor = parseInt(control.value, 10) || 0; // Si es NaN, lo fuerza a 0

    // Ajustar los valores según el campo
    if (campo === 'cantidad') {
      control.setValue(Math.max(1, valor)); // Mínimo 1
    } else if (campo === 'descuentoPorcentaje') {
      control.setValue(Math.min(100, Math.max(0, valor))); // Rango entre 0 y 100
    }
  
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

    // Validar que no haya más de dos decimales
    const valorActual = input.value;
    const cursorPos = input.selectionStart ?? valorActual.length;

    // Simular cómo quedaría el nuevo valor
    const nuevoValor =
      valorActual.substring(0, cursorPos) + charCode + valorActual.substring(cursorPos);

    const partes = nuevoValor.split('.');
    if (partes.length === 2 && partes[1].length > 2) {
      event.preventDefault();
      return;
    }

  }
  
  corregirDecimal(control: any) {

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


}
