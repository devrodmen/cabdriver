import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Refresher, ToastController } from 'ionic-angular';

import { LoginProvider } from '../../providers/login';
import { ReservaProvider } from '../../providers/reserva/reserva';

import { ConferenceData } from '../../providers/conference-data';

import { PerfilPage } from '../../pages/perfil/perfil';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
	dayIndex = 0;
	queryText = '';
	segment = 'all';
	excludeTracks: any = [];
	shownSessions: any = [];
	groups: any = [];
	confDate: string;
	reservas: any = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
	  	public loginProvider:LoginProvider,
	  	public toastCtrl: ToastController,
	  	public reservaProvider:ReservaProvider,
	  	public modalCtrl: ModalController,
	  	public confData: ConferenceData
	  	) {
		let me = this;
	    me.getIdMovil().then((idmovil) => {
	      me.getData(idmovil);
	    });
	    me.updateSchedule();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TabsPage');
	}

	getIdMovil() {
		return this.loginProvider.getInt('idmovilmovil');
	}

	getData(idmovil) {
	    let me = this;
	    let data = (
	      'idmovil=' + idmovil
	    );

	    me.reservaProvider.getData(data, 'getServices').then((response) => {
	      	if(response != false ) {
	      		me.reservas = response;
	        } else {
	        	me.reservas = [];
	        }
	    });
	}

	getReservaDetail(idmovil, estado) {
		let me = this;
		let modal = this.modalCtrl.create(PerfilPage, {
			idmovil: idmovil,
			estado: estado
		});
		modal.onDidDismiss(data => {
			me.updateSchedule();
		});
    	modal.present();
	}

	updateSchedule() {
		let me = this;
	    me.getIdMovil().then((idmovil) => {
	    	let data = (
		      'idmovil=' + idmovil
		    );

		    me.reservaProvider.getData(data, 'getServices').then((response) => {
		      	if(response != false ) {
		      		me.reservas = response;
		        } else {
		        	me.reservas = [];
		        }
		    });
	    });
	}

	doRefresh(refresher: Refresher) {
		let me = this;
    	this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;

      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();
        me.updateSchedule();

        const toast = this.toastCtrl.create({
          message: 'Reservas actualizadas.',
          duration: 3000
        });
        toast.present();
      }, 1000);
    });
  }
}
