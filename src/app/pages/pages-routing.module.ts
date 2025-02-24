import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { MantPacienteComponent } from './mant-paciente/mant-paciente.component';
import { MantPruebaLabComponent } from './mant-prueba-lab/mant-prueba-lab.component';
import { MantItemLabComponent } from './mant-item-lab/mant-item-lab.component';
import { MantServicioComponent } from './mant-servicio/mant-servicio.component';
import { GestCotiPersonalComponent } from './gest-cotizacion/gest-coti-personal/gest-coti-personal.component';
import { MantRecursoHumanoComponent } from './mant-recurso-humano/mant-recurso-humano.component';

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
