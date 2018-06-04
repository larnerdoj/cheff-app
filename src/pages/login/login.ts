/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Login


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';
import { AlertService } from '../../globals/alert';
import { GlobalsService } from '../../globals/globals';

/***********************************************************
PAGES
***********************************************************/
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  urlImg: any;
  userUpp: string;

  showPass: boolean = false;
  changeTypeInput: string = 'password';
  changeIconView: string = 'ios-eye-outline';

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public LoadingController: LoadingController,
    private GlobalsService: GlobalsService,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private AlertService: AlertService,
    public alertCtrl: AlertController,
  ) { }

  ionViewDidLoad() {
    this.urlImg = this.GlobalsService.getImgLogin();
  }

  /************
  GET LOGIN
  *************/
  getLogin(form) {

    if (form.value.usuario == null || form.value.usuario == '' ||
      form.value.senha == null || form.value.senha == '') {
      this.AlertService.showAlert('ATENÇÃO', 'Preencha todos os campos!');

    } else {

      //EXECUTA JSON
      let loading = this.LoadingController.create({
        spinner: 'crescent',
        content: 'Verificando usuário'
      });
      loading.present().then(() => {

        //VERIFICA VERSAO
        this.HttpService.JSON_GET(`/versao`, true, true, 'json')
          .then(
            (res) => {
              
              if (res.json().APPGARCOM === this.GlobalsService.VersaoAPP) {

                //VERIFICA TOKEN
                this.HttpService.JSON_POST('/atendentes/auth/user', form.value, false, true, 'json')
                  .then(
                    (res) => {

                      //armazenando valores no storage
                      this.StorageService.setItem('i', res.json().user_id);
                      this.StorageService.setItem('u', res.json().id);
                      this.StorageService.setItem('n', res.json().name);
                      this.StorageService.setItem('p_init', res.json().square_init);
                      this.StorageService.setItem('p_finish', res.json().square_finish);
                      this.StorageService.setItem('l', true);

                      //redirecionando
                      loading.dismiss();
                      this.navCtrl.setRoot(HomePage, {}, { animate: true, direction: 'forward' });
                    },
                    (error) => {
                      loading.dismiss();
                      this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                    }
                  )

              } else {

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

            });

        },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', JSON.parse(error._body));
          }
        )

    }

  }

  exibePass() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.changeTypeInput = 'text';
      this.changeIconView = 'ios-eye-off-outline';

    } else {
      this.changeTypeInput = 'password';
      this.changeIconView = 'ios-eye-outline';
    }

  }

}
