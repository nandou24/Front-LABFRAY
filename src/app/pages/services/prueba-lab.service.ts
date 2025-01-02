import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import Swal from 'sweetalert2';
import { IGetLastPruebasLab, IPruebaLab, IPruebaLabPostDTO } from '../models/pages.models';

@Injectable({
  providedIn: 'root'
})
export class PruebaLabService {

  constructor(
    private _http: HttpClient
  ) { }


  public registrarPruebaLab(body: IPruebaLab){
      console.log("Enviando valores desde servicio")
      
      return this._http
        .post<IPruebaLabPostDTO>(
          `${environment.baseUrl}/api/pruebaLab/newPruebaLab`,body
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

  getLastPruebasLab(): Observable<IPruebaLab[]> {
      return this._http
        .get<IGetLastPruebasLab>(
          `${environment.baseUrl}/api/pruebaLab/last30`
        )
        .pipe(map((data) => {
          return data.pruebasLab;
        }));        
  }

}
