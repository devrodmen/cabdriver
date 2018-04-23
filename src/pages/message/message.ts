import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginProvider } from '../../providers/login';
import { ReservaProvider } from '../../providers/reserva/reserva';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public loginProvider:LoginProvider,
  	public reservaProvider:ReservaProvider
  	) {
  	let me = this;
    me.getIdMovil().then((idmovil) => {
      me.getData(idmovil);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  getIdMovil() {
    return this.loginProvider.getInt('idmovilmovil');
  }

  getData(idmovil) {
    let me = this;
    let data = (
      'idmovil=' + idmovil
    );

    me.reservaProvider.getData(data, 'getService').then((response) => {
      	if(response != false ) {
      		me.navCtrl.setRoot('PerfilPage');
        }
    });
  }

}
