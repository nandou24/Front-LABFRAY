import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { MantPacienteComponent } from './mantenimiento/mant-paciente/mant-paciente.component';
import { MantPruebaLabComponent } from './mantenimiento/mant-prueba-lab/mant-prueba-lab.component';
import { MantItemLabComponent } from './mantenimiento/mant-item-lab/mant-item-lab.component';
import { MantServicioComponent } from './mantenimiento/mant-servicio/mant-servicio.component';
import { GestCotiPersonalComponent } from './gestionar/gest-cotizacion/gest-coti-personal/gest-coti-personal.component';
import { MantRecursoHumanoComponent } from './mantenimiento/mant-recurso-humano/mant-recurso-humano.component';
import { GestPagoPersonasComponent } from './gestionar/gest-pagos/gest-pago-personas/gest-pago-personas.component';

const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'mantPaciente',
        component: MantPacienteComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'mantPruebaLab',
        component: MantPruebaLabComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'mantItemLab',
        component: MantItemLabComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'mantServicio',
        component: MantServicioComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'gestCotiPersona',
        component: GestCotiPersonalComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'mantRecursoHumano',
        component: MantRecursoHumanoComponent,
        /*canActivate: [PagesGuard]*/
      },
      {
        path: 'gestPagoPersona',
        component: GestPagoPersonasComponent,
        /*canActivate: [PagesGuard]*/
      },
      /*{
        path: 'favorites',
        //component: FavoritesComponent,
        //canActivate: [PagesGuard]
      },
      {
        path: '',
        redirectTo: 'characteres',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'characteres',
        pathMatch: 'full'
      }*/
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
