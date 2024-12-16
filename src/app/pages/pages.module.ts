import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { MantPacienteComponent } from './mant-paciente/mant-paciente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MantPruebaLabComponent } from './mant-prueba-lab/mant-prueba-lab.component';


@NgModule({
  declarations: [
    PagesComponent,
    MantPacienteComponent,
    MantPruebaLabComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class PagesModule { }
