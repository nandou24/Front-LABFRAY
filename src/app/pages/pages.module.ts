import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { MantPacienteComponent } from './mant-paciente/mant-paciente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MantPruebaLabComponent } from './mant-prueba-lab/mant-prueba-lab.component';
import { MantItemLabComponent } from './mant-item-lab/mant-item-lab.component';
import { MantServicioComponent } from './mant-servicio/mant-servicio.component';
import { GestCotiPersonalComponent } from './gest-cotizacion/gest-coti-personal/gest-coti-personal.component';
import { GestCotiEmpresasComponent } from './gest-cotizacion/gest-coti-empresas/gest-coti-empresas.component';
import { MantPersonalComponent } from './mant-personal/mant-personal.component';


@NgModule({
  declarations: [
    PagesComponent,
    MantPacienteComponent,
    MantPruebaLabComponent,
    MantItemLabComponent,
    MantServicioComponent,
    GestCotiPersonalComponent,
    GestCotiEmpresasComponent,
    MantPersonalComponent
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
