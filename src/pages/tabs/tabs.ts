import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ModalController, Refresher, ToastController, LoadingController, FabContainer, ItemSliding } from 'ionic-angular';

import { LoginProvider } from '../../providers/login';
import { ReservaProvider } from '../../providers/reserva/reserva';

import { ConferenceData } from '../../providers/conference-data';

import { PerfilPage } from '../../pages/perfil/perfil';

import { UserData } from '../../providers/user-data';

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
	  	public confData: ConferenceData,
	  	public loadingCtrl: LoadingController,
	  	public alertCtrl: AlertController,
	  	public user: UserData
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

	ionViewWillLeave(){
	    this.updateSchedule();
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

	addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

	removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

	doRefresh(refresher: Refresher) {
		let me = this;
    	this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      	this.shownSessions = data.shownSessions;
      	this.groups = data.groups;

		// simulate a network request that would take longer
		// than just pulling from out local json file
		setTimeout(() => {
			me.updateSchedule();
			refresher.complete();

			const toast = this.toastCtrl.create({
			  message: 'Reservas actualizadas.',
			  duration: 3000
			});
			toast.present();
		}, 1000);
    });
  }
}
