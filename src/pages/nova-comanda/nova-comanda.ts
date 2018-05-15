/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Nova Comanda


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';
import { AlertService } from '../../globals/alert';

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
  isTaxa: boolean = false;
  isCouvert: boolean = false;

  urlImg: any;
  nameCli: string;
  mesaSelecionada = {
    id: null,
    txt: '(selecione a mesa)'
  };

  constructor(
    public navCtrl: NavController,
    public AlertController: AlertController,
    public LoadingController: LoadingController,
    private GlobalsService: GlobalsService,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private AlertService: AlertService
  ){}

  ionViewDidLoad() {
    this.urlImg = this.GlobalsService.getImgRandom();

    //CARREGANDO ITENS INICIAIS
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

              //CARREGANDO CONFIGURACOES
              this.HttpService.JSON_GET(`/configuracoes/${this.StorageService.getItem('i')}`, false, true, 'json')
                .then(
                  (res) => {
                    this.isTaxa = res.json().rate;
                    this.isCouvert = res.json().couvert;

                    //CARREGANDO MESAS
                    this.HttpService.JSON_GET(`/mesas/${this.StorageService.getItem('i')}/${this.StorageService.getItem('u')}`, false, true, 'json')
                      .then(
                        (res) => {
                          this.itensMesas = res.json();
                          this.selecionarMesa();

                          loading.dismiss();
                        },
                        (error) => {
                          loading.dismiss();
                          this.AlertService.showAlert('ERRO', error._body);
                        }
                      )
                  },
                  (error) => {
                    loading.dismiss();
                    this.AlertService.showAlert('ERRO', error._body);
                  }
                )
            }

          },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', error._body);
          }
        )

    });

  }

  /************
  SELECT MESA
  *************/
  selecionarMesa(){
    let alert = this.AlertController.create();
    alert.setTitle('Selecione a mesa');

    let check_radio: boolean;
    this.itensMesas.forEach((item, i) => {
      if (i == 0) { check_radio = true; } else { check_radio = false; }
      alert.addInput({
        type: 'radio',
        label: `${item.mesa} - ${item.status}`,
        value: `${i}`,
        checked: check_radio
      });      
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.mesaSelecionada.id = this.itensMesas[data].id;
        this.mesaSelecionada.txt = this.itensMesas[data].mesa;
      }
    });
    alert.present();

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
              this.AlertService.showAlert('ERRO', error._body);
            }
          )

      });

    }

  }

}
