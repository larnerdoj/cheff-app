/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Componente principal da aplicacao


COMPONENTS
***********************************************************/
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/***********************************************************
SERVICES
***********************************************************/
import { StorageService } from '../globals/storage';

/***********************************************************
PAGES
***********************************************************/
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MesasPage } from './../pages/mesas/mesas';
import { NovaComandaPage } from './../pages/nova-comanda/nova-comanda';

@Component({
  templateUrl: 'app.html'
})
export class CheffApp {
  
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;

  platform;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private StorageService: StorageService,
    public alertCtrl: AlertController
  ){

    this.platform = platform;

    //VERIFICANDO SE USUARIO ESTA LOGADO
    (this.StorageService.getItem('l') && this.StorageService.getItem('l') !== null)?
    this.rootPage = HomePage:this.rootPage = LoginPage;
    
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  /************************
  ROTEAMENTO MENU LATERAL
  ************************/
  voltarRoot(){
    return this.nav.setRoot(HomePage, {}, { animate: true, direction: 'forward' });
  }
  verMesas(){
    return this.nav.push(MesasPage, {}, { animate: true, direction: 'forward' });
  }
  novaComanda(){
    return this.nav.push(NovaComandaPage, {}, { animate: true, direction: 'forward' });
  }
  
  /************
  GET LOGOUT
  *************/
  getLogout(){

    let alert = this.alertCtrl.create({
      title: 'Sair da conta?',
      message: 'Tem certeza que deseja sair de sua conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Sair',
          handler: () => {

            this.StorageService.deleteItem('i');
            this.StorageService.deleteItem('u');
            this.StorageService.deleteItem('n');
            this.StorageService.deleteItem('l');

            this.rootPage = LoginPage;
            this.nav.setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
            
          }
        }
      ]
    });
    alert.present();

  }

  /************
  SAIR DO APP
  *************/
  exitApp(){
    let alert = this.alertCtrl.create({
      title: 'Sair do aplicativo?',
      message: 'Tem certeza que deseja sair do aplicativo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Sair',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }
  
}

