  import { Component, ViewChild, ElementRef } from '@angular/core';
  import { IonicPage, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
  import { OnInit } from '@angular/core';

/**
 * Data
 */
import { ReservaProvider } from '../../providers/reserva/reserva';
import { LoginProvider } from '../../providers/login';

/**
 * Pages
 */
import { InfoPage } from '../info/info';

import SlidingMarker from "marker-animate-unobtrusive";

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage implements OnInit{
  public map;
  public movPos;
  public posMov;
  public marker;
  public idmovil;
  public estado;
  error: string;
  travelMode = "WALKING";
  directionsService;
  directionsDisplay;
  public icons = {
    start: new google.maps.MarkerImage(
      // URL
      'http://rfacturacion.remisse21.com.pe/public/markers/home-2.png',
      // (width,height)
      new google.maps.Size(40, 40),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(22, 32)),
      end: new google.maps.MarkerImage(
      // URL
      'http://rfacturacion.remisse21.com.pe/public/markers/finish.png',
      // (width,height)
      new google.maps.Size(40, 40),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(22, 32)),
      car: new google.maps.MarkerImage(
      // URL
      'http://rfacturacion.remisse21.com.pe/public/markers/car.png',
      // (width,height)
      new google.maps.Size(40, 40),
      // The origin point (x,y)
      new google.maps.Point(0, 0),
      // The anchor point (x,y)
      new google.maps.Point(22, 32))
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public reservaProvider:ReservaProvider,
    public loginProvider:LoginProvider,
    public alertCtrl:AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    
  }

  ngOnInit() {
    let me = this;
    me.idmovil = this.navParams.get('idmovil');
    me.estado = this.navParams.get('estado');
    this.map = this.iniciarMapa();

    me.getData(me.idmovil);

    setInterval(() => { 
      me.updateMap();
    }, 120000);
  }

  iniciarMapa() {
    let location = new google.maps.LatLng(-16.4039671, -71.5740312);
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    let map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    return map;
  }

  updateMap() {
    let me = this;
      let data = (
        "idmovil=" + me.idmovil
      );

      me.reservaProvider.getData(data, 'getPositionMov').then((response) => {
        me.actualizarMapa(response["movil_latitude"], response["movil_longitude"]);
      });
  }

  actualizarMapa(movlat, movlon) {
    let me = this;
    me.recalculateMarkers(movlat, movlon);
  }

  recalculateMarkers(mov_lat, mov_lon) {
    let me = this;
    
    let location = new google.maps.LatLng(mov_lat, mov_lon);

    // First, remove any existing markers from the map.
    //me.posMov.setMap(null);
    me.posMov.setPosition(location);
  }

  getData(idmovil) {
    let me = this;
    let data = (
      'idmovil=' + idmovil
    );

    me.directionsService = new google.maps.DirectionsService;
    me.directionsDisplay = new google.maps.DirectionsRenderer({
      map: me.map,
      suppressMarkers: true
    });

    me.reservaProvider.getData(data, 'getService').then((response) => {
      if(response == false ) {
        //me.navCtrl.setRoot('MessagePage');
      } else {
        let origen = response["reserva_destinolat"];
        let destino = response["reserva_destinolng"];
        me.construirMapa(
          data,
          response["reserva_origenlat"],
          response["reserva_origenlng"],
          origen,
          destino
        );
      }
    });
  }

  construirMapa(data, origenlat, origenlng, destinolat, destinolng) {
    let me = this;

    me.reservaProvider.getData(data, 'getPositionMov').then((response) => {
      let origen = origenlat + "," + origenlng;
      let destino = destinolat + "," + destinolng;
      me.route(origen, destino, response["movil_latitude"], response["movil_longitude"]);
    });
  }

  route(origen, destino, movlat, movlng) {
    let me = this;
    let dir = movlat + "," + movlng;
    let waypts = [];

    waypts.push({
      location: origen,
      stopover: true
    });

    me.directionsService.route({
      origin: dir,
      destination: destino,
      travelMode: me.travelMode,
      waypoints: waypts,
      optimizeWaypoints: true
    }, function(response, status) {
      if(status === 'OK') {
        var _route = response.routes[0].legs[0];
        var _route2 = response.routes[0].legs[1];
        me.directionsDisplay.setDirections(response);

        me.posMov = me.makeMarker(_route.start_location, me.icons.car, "Inicio", me.map, 'car');
        me.makeMarker(_route.end_location, me.icons.start, 'Destino', me.map, 'inicio');
        me.makeMarker(_route2.end_location, me.icons.end, 'Fin', me.map, 'destino');
      }
    });
  }

  finalizarReserva(diferido, observacion) {
    let me = this;
    var data = (
      'idmovil=' + me.idmovil +
      '&diferido=' + diferido +
      '&observacion=' + observacion

    );

    me.reservaProvider.finalizarReserva(data,'finalizarReserva');

    me.viewCtrl.dismiss();
  }

  dismiss() {
    let me = this;
    me.viewCtrl.dismiss();
  }

  notificarLlegadaMov() {
    let me = this;
    var data = (
      'mensaje=' + "Su móvil acaba de llegar" +
      '&idmovil=' + me.idmovil
    );
    me.reservaProvider.notificarLlegada(data,'notificarLlegada');
  }

  detalles() {
    let me = this;
    let detalle;
    me.reservaProvider.getDetalle(me.idmovil, 'detalleReserva').then((response) => {
      detalle = response;
      let infoModal = me.modalCtrl.create(InfoPage, {data: detalle});
      infoModal.present();
    });
  }

  notificarLlegada() {
    let me = this;
    let alert = this.alertCtrl.create({
      title: 'Notificar llegada',
      message: 'Está seguro de enviar una notificación?',
      buttons: [
        {
          text: 'Aceptar',
          handler: data => {
            me.notificarLlegadaMov();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

  confirm() {
    let me = this;
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro de finalizar este viaje?',
      inputs: [
        {
          name: 'diferido',
          placeholder: 'N° diferido'
        },
        {
          name: 'observacion',
          placeholder: 'Observación'
        }
      ],
      buttons: [
        {
          text: 'Aceptar',
          handler: data => {
            let diferido = data.diferido;
            let observacion = data.observacion;
            if(data.diferido = "") {
              let error = me.alertCtrl.create({
                title: 'Error',
                message: 'Debe ingresar el n° diferido',
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {

                    }
                  }
                ]
              });
              error.present();
            } else {
              me.finalizarReserva(diferido, observacion);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

  makeMarker(position, icon, title, map, id = null) {
    let me = this;
    me.marker = new SlidingMarker({
      position: position,
      map: map,
      icon: icon,
      title: title,
      easing: "linear"
    });

    me.marker.set('id', id);
    me.marker.setDuration(2000);
    
    return me.marker;
  }

  cerrarSesion() {
    let me = this;
    me.loginProvider.logout();
    me.navCtrl.setRoot('LoginPage');
  }
}
