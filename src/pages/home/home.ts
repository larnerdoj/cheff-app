/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Home


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';
import { StorageService } from '../../globals/storage';

/***********************************************************
PAGES
***********************************************************/
import { MesasPage } from '../mesas/mesas';
import { NovaComandaPage } from '../nova-comanda/nova-comanda';
import { LoginPage } from './../login/login';
import { HttpService } from '../../globals/http';
import { AlertService } from '../../globals/alert';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  urlImg: any;
  nomeUser: string = '';

  constructor(
    public navCtrl: NavController,
    public LoadingController: LoadingController,
    private GlobalsService: GlobalsService,
    private StorageService: StorageService,
    private HttpService: HttpService,
    private AlertService: AlertService
  ){}

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.urlImg = this.GlobalsService.getImgRandom();
    this.nomeUser = this.StorageService.getItem('n');

    this.getConfiguracoes();
  }

  verMesas(){
    return this.navCtrl.push(MesasPage, {}, { animate: true, direction: 'forward' });
  }
  novaComanda(){
    return this.navCtrl.push(NovaComandaPage, {}, { animate: true, direction: 'forward' });
  }

  getConfiguracoes(){

    //EXECUTA JSON
    let loading = this.LoadingController.create({
      spinner: 'crescent',
      content: 'Carregando informações'
    });
    loading.present().then(() => {
      this.HttpService.JSON_GET(`/configuracoes/${this.StorageService.getItem('i')}`, false, true, 'json')
        .then(
          (res) => {
            
            this.GlobalsService.isTaxa = res.json().rate;
            this.GlobalsService.typeTaxa = res.json().rate_type;
            this.GlobalsService.vlTaxa = res.json().rate_vl;

            this.GlobalsService.isCouvert = res.json().couvert;
            this.GlobalsService.typeCouvert = res.json().couvert_type;
            this.GlobalsService.vlCouvert = res.json().couvert_vl;

            loading.dismiss();
          },
          (error) => {
            loading.dismiss();
            this.navCtrl.setRoot(LoginPage, {}, { animate: true, direction: 'back' });
            
            if(error.name && error.name === 'TimeoutError'){
              this.AlertService.showAlert('ERRO', 'Não foi possível se conectar ao servidor!');
            }else{
              this.AlertService.showAlert('ERRO', JSON.parse(error._body));
            }
          }
        )

    });
  }

}
