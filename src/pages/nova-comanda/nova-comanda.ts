/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Nova Comanda


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';
import { AlertService } from '../../globals/alert';

import { ModalMesasPage } from '../../components/modal/modal-mesas';

/***********************************************************
PAGES
***********************************************************/
import { MesasPage } from '../mesas/mesas';

@Component({
  selector: 'page-nova-comanda',
  templateUrl: 'nova-comanda.html'
})
export class NovaComandaPage {

  caixaAtual: string = null;

  itensMesas: any;
  tipo_credito: string = '00000000011';

  urlImg: any;
  nameCli: string;

  constructor(
    public navCtrl: NavController,
    public AlertController: AlertController,
    public LoadingController: LoadingController,
    public ModalController: ModalController,
    private GlobalsService: GlobalsService,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private AlertService: AlertService
  ){}

  ionViewDidLoad() {
    this.urlImg = this.GlobalsService.getImgRandom();

    //CARREGANDO ITENS INICIAIS
    this.GlobalsService.mesaSelecionada.id = null;
    this.GlobalsService.mesaSelecionada.txt = '(selecione a mesa)';
    this.getCaixaAtual();
  }

  /************
  GET CAIXA ATUAL
  *************/
  getCaixaAtual() {

    //EXECUTA JSON
    let loading = this.LoadingController.create({
      spinner: 'crescent',
      content: 'Carregando informações'
    });
    loading.present().then(() => {

      this.HttpService.JSON_GET(`/caixa/${this.StorageService.getItem('i')}`, false, true, 'json')
        .then(
          (res) => {
            
            if (res.json().length === 0) {
              this.caixaAtual = '';
              loading.dismiss();

            } else {
              this.caixaAtual = res.json()[0].id;

              //CARREGANDO MESAS
              this.HttpService.JSON_GET(`/mesas/${this.StorageService.getItem('i')}/atendente/${this.StorageService.getItem('u')}/${this.StorageService.getItem('p_init')}/${this.StorageService.getItem('p_finish')}`, false, true, 'json')
                .then(
                  (res) => {
                    this.itensMesas = res.json();
                    this.selecionarMesa();

                    loading.dismiss();
                  },
                  (error) => {
                    loading.dismiss();
                    this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                  }
                )
            }

          },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', JSON.parse(error._body));
          }
        )

    });

  }

  /************
  SELECT MESA
  *************/
  selecionarMesa(){
    let carregaModal = this.ModalController.create(ModalMesasPage, {itens: this.itensMesas});
    carregaModal.present();
  }

  /************
  POST COMANDA
  *************/
  postComanda(form) {

    if (form.value.mesa == null || form.value.mesa == '') {
        this.AlertService.showAlert('ATENÇÃO', 'Selecione uma mesa para o cliente');

    }else if (form.value.nome == null || form.value.nome == '') {
        this.AlertService.showAlert('ATENÇÃO', 'Digite o nome do cliente');

    } else {

      //EXECUTA JSON
      let loading = this.LoadingController.create({
        spinner: 'crescent',
        content: 'Criando comanda'
      });
      loading.present().then(() => {

        this.HttpService.JSON_POST(`/comandas/${this.StorageService.getItem('i')}`, form.value, false, true, 'json')
          .then(
            (res) => {
              loading.dismiss();

              //redirecionando
              this.navCtrl.setRoot(MesasPage, {}, { animate: true, direction: 'forward' });
            },
            (error) => {
              loading.dismiss();
              this.AlertService.showAlert('ERRO', JSON.parse(error._body));
            }
          )

      });

    }

  }

}
