import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetLastServicio, IServicio, IServicioPostDTO } from '../models/pages.models';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(
    private _http: HttpClient
  ) { }

  getExamenesPorTipo(tipoExamen: string): Observable<any[]> {
    const params  = new HttpParams().set('search',tipoExamen)
    
    return this._http.get<any>(
        `${environment.baseUrl}/api/servicio/tipoExamen`,{params }
      )
      .pipe(map((data) => data?.examenes || []),
      catchError((error) => {
        console.error('Error al obtener exámenes:', error);
        return []; // Retorna un array vacío en caso de error
      })
    );

  }

  public registrarServicio(body: IServicio){
    console.log("Enviando valores desde servicio")
    
    return this._http
      .post<IServicioPostDTO>(
        `${environment.baseUrl}/api/servicio/newServicio`,body
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

  getLastServicio(cantidad:number): Observable<IServicio[]> {
    const params = new HttpParams().set('cant',cantidad) 
    return this._http
      .get<IGetLastServicio>(
        `${environment.baseUrl}/api/servicio/latest`,{params}
      )
      .pipe(map((data) => {
        return data.servicios;
      }));        
  }

  getServicio(terminoBusqueda : any): Observable<IServicio[]> {
    const params = new HttpParams().set('search',terminoBusqueda)
    return this._http
      .get<IGetLastServicio>(
        `${environment.baseUrl}/api/servicio/findTerm`,{params}
      )
      .pipe(map((data) => data.servicios));
  }

  public actualizarServicio(codServicio: string, body: IServicio){
      
      console.log(body)
      console.log(codServicio)
      return this._http
        .put<IServicioPostDTO>(
          `${environment.baseUrl}/api/servicio/${codServicio}/updateServicio`,body
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
