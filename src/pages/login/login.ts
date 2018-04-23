import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, AlertController, IonicPage } from 'ionic-angular';

import { Storage } from '@ionic/storage';

/** 
 * Controller
 */
import { LoginProvider } from '../../providers/login';

/**
 * Interfaces
 */
import { UserOptions } from '../../interfaces/user-options';

/**
 * Pages
 */
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  HAS_LOGGED_IN = 'hasLoggedIn';
  submitted = false;
  responseData : any;
  loginForm: any;
  public backgroundImage: any = "http://rfacturacion.remisse21.com.pe/public/app/bg1.jpg";
  imgLogo: any = "http://rfacturacion.remisse21.com.pe/public/app/medium_150.70391061453px_1202562_easyicon.net.png";
  errorMessage: String;
  login: UserOptions = { username: '', password: '', imagen: '',idpersona: '',permiso:'',nombres:'',email:'',estado: '',nombrerol: '',dni:'' };

  constructor(
    public navCtrl: NavController,
    public loginProvider: LoginProvider,
    public alertController: AlertController,
    public storage: Storage
  ) {
    
  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Error',
      subTitle: 'Usuario o contraseña incorrectos',
      buttons: ['Ok']
    });
    alert.present();
  }

  getSession() {
    return this.loginProvider.getInt("idmovilmovil");
  }

  onLogin(form: NgForm) {
    let me = this;
    me.submitted = true;

    if (form.valid) {
      var userData = (
        'usuario=' + me.login.username +
        '&clave=' + me.login.password
      );
      me.loginProvider.postData(
        userData,
        'iniciarSesionMovil'
        ).then((response) => {
        me.responseData = response;
        if(response != false) {
          var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          };
      
          window["plugins"].OneSignal
            .startInit("c5cfe934-ddd2-42fd-b812-4be147d3f8a7", "149072525401")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
      
          window["plugins"].OneSignal
            .getIds(function(id) {
              var data = (
                'idusuario=' + me.responseData.idusuarioa +
                '&token=' + id.userId
              );

              me.loginProvider.postData(data, 'actualizarToken').then((response) => {
                console.log(response);
              });
            });
          me.storage.set(me.HAS_LOGGED_IN, true);
          me.loginProvider.setString('usernamemovil',me.login.username);
          me.loginProvider.setString('passwordmovil',me.login.username);
          me.loginProvider.setString('dnimovil',me.responseData.dni);
          me.loginProvider.setString('imagenmovil',me.responseData.imagen);
          me.loginProvider.setString('nombapelmovil',me.responseData.nombapel);
          me.loginProvider.setString('emailmovil',me.responseData.email);
          me.loginProvider.setInt('idpersonamovil',me.responseData.idpersona);
          me.loginProvider.setInt('estadomovil',me.responseData.estado);
          me.loginProvider.setInt('nomrolmovil',me.responseData.nom_rol);
          me.loginProvider.setInt('permisomovil',me.responseData.permiso);
          me.loginProvider.setInt('idmovilmovil',me.responseData.idmovil);
          me.loginProvider.events.publish('user:login');
          me.navCtrl.setRoot(TabsPage);
        } else {
          me.presentAlert();
        }
      });
    }
  }

  onSignup() {
    this.navCtrl.setRoot(TabsPage);
  }

}
