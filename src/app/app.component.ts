import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginProvider } from '../providers/login';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  loggedInPages: PageInterface[] = [
    { title: 'Cerrar Sesión', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Cerrar Sesión', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];

  rootPage:any;
  @ViewChild(Nav) nav: Nav;
  constructor(
    public loginProvider: LoginProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public modalCtrl: ModalController
  ) {

    this.storage.get('usernamemovil').then((value) => {
      if(value !== null) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage; 
      }
    });

    this.platformReady();
  }

  platformReady() {
    let me = this;
    me.platform.ready().then(() => {
      me.statusBar.styleDefault();
      me.splashScreen.hide();
      var notificationOpenedCallback = function(json) {
        let jsonData = json["notification"]["payload"]["additionalData"];
        //let idreserva = jsonData["idreserva"];
        let idmovil = jsonData["idmovil"];
        let estado = jsonData["estado"];
        //let tipo = jsonData["tipo"];
        //if(tipo == "asignar") {
          let obj = {
            idmovil: idmovil,
            estado: estado
          };
          //me.nav.setRoot(PerfilPage, obj);
          let modal = me.modalCtrl.create(PerfilPage, obj);
          modal.present();
        //}
      };
  
      window["plugins"].OneSignal
        .startInit("c5cfe934-ddd2-42fd-b812-4be147d3f8a7", "149072525401")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    });
  }

  openPage(page: PageInterface) {
    let params = {};

    if (page.index) {
      params = { tabIndex: page.index };
    }
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.loginProvider.logout();
    }
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}

