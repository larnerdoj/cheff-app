/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Login


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    public LoadingController: LoadingController,
    private GlobalsService: GlobalsService,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private AlertService: AlertService
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

        this.HttpService.JSON_POST('/atendentes/auth/user', form.value, false, true, 'json')
          .then(
            (res) => {

              //armazenando valores no storage
              this.StorageService.setItem('i', res.json().user_id);
              this.StorageService.setItem('u', res.json().id);
              this.StorageService.setItem('n', res.json().name);
              this.StorageService.setItem('l', true);

              //redirecionando
              this.navCtrl.setRoot(HomePage, {}, { animate: true, direction: 'forward' });
              loading.dismiss();
            },
            (error) => {
              loading.dismiss();
              this.AlertService.showAlert('ERRO', error._body);
            }
          )

      });

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
