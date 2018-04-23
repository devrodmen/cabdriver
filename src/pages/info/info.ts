import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  public data;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() {
    console.log(this.data);
  }

  retroceder() {
    this.viewCtrl.dismiss();
  }
}
