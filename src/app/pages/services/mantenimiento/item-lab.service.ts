import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetLastItemsLab, IItemLab, IItemLabPostDTO } from '../../models/pages.models';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ItemLabService {

  constructor(
    private _http: HttpClient
  ) { }

  public registrarItemLab(body: IItemLab){
        console.log("Enviando valores desde servicio")
        console.log(body)
        
        return this._http
          .post<IItemLabPostDTO>(
            `${environment.baseUrl}/api/itemLab/newItemLab`,body
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
  
  getLastItemsLab(cantidad:number): Observable<IItemLab[]> {
    const params = new HttpParams().set('cant',cantidad) 
    return this._http
      .get<IGetLastItemsLab>(
        `${environment.baseUrl}/api/itemLab/last30`,{params}
      )
      .pipe(map((data) => {
        return data.itemsLab;
      }));        
  }

  getItem(terminoBusqueda : any): Observable<IItemLab[]> {
    const params = new HttpParams().set('search',terminoBusqueda)
    return this._http
      .get<IGetLastItemsLab>(
        `${environment.baseUrl}/api/itemLab/findTerm`,{params}
      )
      .pipe(map((data) => data.itemsLab));
  }
  
    
  public actualizarItem(codigo: string, body: IItemLab){
    
    return this._http
      .put<IItemLabPostDTO>(
        `${environment.baseUrl}/api/itemLab/${codigo}/updateItem`,body
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
