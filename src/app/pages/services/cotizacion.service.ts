import { Injectable } from '@angular/core';
import { ICotizacion, ICotizacionPostDTO, IGetLastCotizacion } from '../models/pages.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { catchError, map, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  constructor(
    private _http: HttpClient
  ) { }

  public generarCotizacion(body: ICotizacion){
      console.log("Enviando valores desde servicio")
      
      return this._http
        .post<ICotizacionPostDTO>(
          `${environment.baseUrl}/api/cotizacion/newCotizacion`,body
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

  getLastCotizacion(cantidad:number): Observable<ICotizacion[]> {
    const params = new HttpParams().set('cant',cantidad) 
    return this._http
      .get<IGetLastCotizacion>(
        `${environment.baseUrl}/api/cotizacion/latest`,{params}
      )
      .pipe(map((data) => {
        return data.cotizaciones;
      }));        
  }


}
