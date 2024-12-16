import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

}
