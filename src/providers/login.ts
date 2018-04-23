import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

let apiUrl = 'http://rfacturacion.remisse21.com.pe/apk_login/';

@Injectable()
export class LoginProvider{
    public movil;
  responseData : any;
  err : any;
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
    public http: Http
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username: string, password: string) {
    //let me = this;
    var userData = (
      'usuario=' + username +
      '&clave=' + password
    );

    this.postData(userData, 'iniciarSesionMovil')
      .then((result) => {
        this.responseData = result;
        if(this.responseData != false) {
          this.storage.set(this.HAS_LOGGED_IN, true);
          this.setString('usernamemovil',username);
          this.setString('passwordmovil',password);
          this.setString('dnimovil',this.responseData.dni);
          this.setString('imagenmovil',this.responseData.imagen);
          this.setString('nombapelmovil',this.responseData.nombapel);
          this.setString('emailmovil',this.responseData.email);
          this.setInt('idpersonamovil',this.responseData.idpersona);
          this.setInt('estadomovil',this.responseData.estado);
          this.setInt('nomrolmovil',this.responseData.nom_rol);
          this.setInt('permisomovil',this.responseData.permiso);
          this.setInt('idmovilmovil',this.responseData.idmovil);
          this.events.publish('user:login');
        }
      }, (err) => {
        err = 0 ;
        return err;
        /**
         * Conexón fallida
         */
      });
  };

  setString(campo, variable):void {
    this.storage.set(campo, variable);
  }

  setInt(campo,variable):void{
    this.storage.set(campo, variable);
  }

  getString(variable): Promise<string> {
    return this.storage.get(variable).then((value) => {
        return value;
    });
  }

  getInt(variable): Promise<number> {
    return this.storage.get(variable).then((value) => {
        return value;
    });
  }

  postData(data, type) {
    let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    });
    let options = new RequestOptions({
        headers: headers
    });

    return new Promise((resolve, reject) => {
        headers = new Headers();
        this.http.post(apiUrl + type, data, options)
            .subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);
            });
    });
  }

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('usernamemovil');
    this.storage.remove('passwordmovil');
    this.storage.remove('dnimovil');
    this.storage.remove('imagenmovil');
    this.storage.remove('nombapelmovil');
    this.storage.remove('emailmovil');
    this.storage.remove('idpersonamovil');
    this.storage.remove('estadomovil');
    this.storage.remove('nomrolmovil');
    this.storage.remove('permisomovil');
    this.storage.remove('idmovilmovil');
    this.events.publish('user:logout');
  };
}