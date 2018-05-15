/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Mesas


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';

/***********************************************************
PAGES
***********************************************************/
import { CardapioPage } from '../cardapio/cardapio';
import { AlertService } from '../../globals/alert';

@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html'
})
export class MesasPage {

  itens: any;

  constructor(
    public navCtrl: NavController,
    public LoadingController: LoadingController,
    public AlertService: AlertService,
    private HttpService: HttpService,
    private StorageService: StorageService
  ) { }

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.getMesas();
  }

  /************
  REFRESHER
  *************/
  pullRefresher(event) {
    this.getMesas();

    setTimeout(() => {
      event.complete();
    }, 100);
  }

  /************
  GET MESAS
  *************/
  getMesas() {

    //EXECUTA JSON
    let loading = this.LoadingController.create({
      spinner: 'crescent',
      content: 'Carregando mesas'
    });
    loading.present().then(() => {

      this.HttpService.JSON_GET(`/comandas/${this.StorageService.getItem('i')}/atendente/${this.StorageService.getItem('u')}`, false, true, 'json')
        .then(
          (res) => {
            this.itens = res.json();
            loading.dismiss();
          },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', error._body);
          }
        )

    });

  }

  carregaItem(event, item) {
    this.navCtrl.push(CardapioPage, { item: item });
  }

}
