import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

import { LoginProvider } from '../login';

let apiUrl = 'http://rfacturacion.remisse21.com.pe/apk/';

@Injectable()
export class ReservaProvider {
  response: any;
  constructor(
    public http: Http,
    public loginProvider: LoginProvider
  ) {}

  getData(data, method) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise((resolve, reject) => {
      headers = new Headers();
      this.http.post(apiUrl + method, data, options)
          .subscribe(res => {
              resolve(res.json());
          }, (err) => {
              reject(err);
          });
    });
  }

  getDetalle(idmovil, method) {
    var data = (
      'idmovil=' + idmovil
    );

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    });

    let options = new RequestOptions({
      headers: headers
    });

    return new Promise((resolve,reject) => {
      headers = new Headers();
      this.http.post(apiUrl + method, data, options)
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          })
    });
  }

  notificarLlegada(data, method) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise((resolve, reject) => {
      headers = new Headers();
      this.http.post(apiUrl + method, data, options)
          .subscribe(res => {
              resolve(res.json());
          }, (err) => {
              reject(err);
          });
    });
  }

  finalizarReserva(data, method) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });

    return new Promise((resolve, reject) => {
      headers = new Headers();
      this.http.post(apiUrl + method, data, options)
          .subscribe(res => {
              resolve(res.json());
          }, (err) => {
              reject(err);
          });
    });
  }
}
