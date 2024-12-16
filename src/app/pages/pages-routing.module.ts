import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { MantPacienteComponent } from './mant-paciente/mant-paciente.component';

const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'registrarPaciente',
        component: MantPacienteComponent,
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
