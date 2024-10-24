import { Injectable } from '@angular/core';
import { IPaciente, IPacientePostDTO } from '../models/pages.models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) { }

  public registrarPaciente(body: IPaciente){
    console.log("Enviando valores desde servicio")
    
    return this._http
      .post<IPacientePostDTO>(
        `${environment.baseUrl}/api/paciente/newPaciente`,body
      )
      .pipe(
        map((data) => {
          if (data.ok) {
            return data.ok;
          } else {
            throw new Error('ERROR');
          }
        }),
        catchError((err) => {
          console.log(err.error.msg);
          Swal.fire({
            title: 'ERROR!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
          return of('ERROR');
        })
      );
  }

}
