import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import Swal from 'sweetalert2';
import { IDetallePago, IGetDetallePago, IGetLastPagos, IPago, IPagoPostDTO } from '../../models/pages.models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(
    private _http: HttpClient
  ) { }

  registrarPago(body: IPago){
    console.log("Enviando valores desde servicio")

    return this._http
        .post<IPagoPostDTO>(
          `${environment.baseUrl}/api/pagos/newPagoPersona`,body
        )
        .pipe(
          map((data) => {
            if (data.ok) {
              return data;
            } else {
              throw new Error(data.msg || 'Error desconocido');
            }
          }),
          catchError((err) => {
            return throwError(() => err);
          })
        );

  }

  getDetallePago(codCoti:string): Observable<IDetallePago[]> {
    const params = new HttpParams().set('codCoti',codCoti) 
    return this._http
      .get<IGetDetallePago>(
        `${environment.baseUrl}/api/pagos/findPayDetail`,{params}
      )
      .pipe(
        map((data) => {
        return data.detallePago;
      }),
      catchError((err) => {
        return throwError(() => err);
      })

    );      
  }

  getPagos(cantidad:number): Observable<IPago[]> {
    const params = new HttpParams().set('cant',cantidad) 
    return this._http
      .get<IGetLastPagos>(
        `${environment.baseUrl}/api/pagos/latest`,{params}
      )
      .pipe(
        map((data) => {
        return data.pagos;
      })
    );      
  }

}

