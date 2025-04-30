import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { MantPacienteComponent } from './mantenimiento/mant-paciente/mant-paciente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MantPruebaLabComponent } from './mantenimiento/mant-prueba-lab/mant-prueba-lab.component';
import { MantItemLabComponent } from './mantenimiento/mant-item-lab/mant-item-lab.component';
import { MantServicioComponent } from './mantenimiento/mant-servicio/mant-servicio.component';
import { GestCotiPersonalComponent } from './gestionar/gest-cotizacion/gest-coti-personal/gest-coti-personal.component';
import { GestCotiEmpresasComponent } from './gestionar/gest-cotizacion/gest-coti-empresas/gest-coti-empresas.component';
import { MantRecursoHumanoComponent } from './mantenimiento/mant-recurso-humano/mant-recurso-humano.component';
import { GestPagoPersonasComponent } from './gestionar/gest-pagos/gest-pago-personas/gest-pago-personas.component';
import { GestPagoEmpresasComponent } from './gestionar/gest-pagos/gest-pago-empresas/gest-pago-empresas.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    PagesComponent,
    MantPacienteComponent,
    MantPruebaLabComponent,
    MantItemLabComponent,
    MantServicioComponent,
    GestCotiPersonalComponent,
    GestCotiEmpresasComponent,
    MantRecursoHumanoComponent,
    GestPagoPersonasComponent,
    GestPagoEmpresasComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    HttpClientModule,
    
  ]
})
export class PagesModule { }
