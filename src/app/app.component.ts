/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Componente principal da aplicacao


COMPONENTS
***********************************************************/
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from "@ionic-native/push";

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../globals/globals';
import { StorageService } from '../globals/storage';
import { HttpService } from '../globals/http';
import { AlertService } from '../globals/alert';

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
    public push: Push,
    private GlobalsService: GlobalsService,
    private StorageService: StorageService,
    private HttpService: HttpService,
    private AlertService: AlertService,
    public alertCtrl: AlertController,
    public LoadingController: LoadingController
  ){

    this.platform = platform;

    //VERIFICANDO VERSAO DO APP
    let loading = this.LoadingController.create({
      spinner: 'crescent'
    });
    loading.present().then(() => {

      this.HttpService.JSON_GET(`/versao`, true, true, 'json')
        .then(
          (res) => {
            loading.dismiss();
            if(res.json().APPGARCOM === this.GlobalsService.VersaoAPP){
              
              //VERIFICANDO SE USUARIO ESTA LOGADO E TOKEN VALIDO
              if(!this.StorageService.getItem('l')
                || this.StorageService.getItem('l') === null
                || !this.StorageService.getItem('i')
                || this.StorageService.getItem('i') === null
                || !this.StorageService.getItem('u')
                || this.StorageService.getItem('u') === null
                || !this.StorageService.getItem('p_init')
                || this.StorageService.getItem('p_init') === null
                || !this.StorageService.getItem('p_finish')
                || this.StorageService.getItem('p_finish') === null
              ){
                this.rootPage = LoginPage;
                this.StorageService.clear();

              }else{

                //EXECUTA JSON
                let loading = this.LoadingController.create({
                  spinner: 'crescent',
                  content: 'Verificando usuário'
                });
                loading.present().then(() => {

                  this.HttpService.JSON_GET(`/atendentes/auth/token/${this.StorageService.getItem('u')}`, true, true, 'json')
                    .then(
                      (res) => {
                        if(res.json() === true){ this.rootPage = HomePage }
                        else{
                          this.StorageService.clear();
                          this.rootPage = LoginPage;
                        }
                        loading.dismiss();
                      },
                      (error) => {
                        loading.dismiss();
                        this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                      }
                    )

                });

              }

            }else{
              this.rootPage = LoginPage;

              //REDIRECIONANDO PARA LOJA
              let alert = this.alertCtrl.create({
                title: 'Aplicativo desatualizado?',
                message: 'Clique em ATUALIZAR para realiazar a atualização?',
                buttons: [
                  {
                    text: 'Atualizar',
                    handler: () => {
                      
                      if(this.platform.is('android')){
                        window.open(this.GlobalsService.lojaAndroid, '_system');

                      }else if(this.platform.is('ios')){}
                      else if(this.platform.is('windows')){}
                      else{}

                      this.StorageService.clear();
                      this.platform.exitApp();
                    }
                  }
                ]
              });
              alert.present();
            }
          },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', JSON.parse(error._body));
          }
        )

    });
    
    platform.ready().then(() => {
      //statusBar.styleDefault();
      statusBar.backgroundColorByHexString('#00d900');
      splashScreen.hide();
    });
  }

  /************************
  INICIANDO PUSH
  ************************/  
  pushStart() {
    let options: PushOptions = {};
    let pushObject: PushObject = this.push.init(options);

    pushObject.on("registration").subscribe((registration: any) => { });
    pushObject.on("notification").subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let alertPush = this.alertCtrl.create({
          title: notification.label,
          message: notification.message
        });
        alertPush.present();
      }
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

            this.StorageService.clear();

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

