/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Modal Itens de Comanda


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { CurrencyPipe, DatePipe } from '@angular/common';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';
import { AlertService } from '../../globals/alert';

@Component({
  selector: 'modal-itens-comanda',
  templateUrl: 'modal-itens-comanda.html'
})
export class ModalItensComandaPage {

  comandaSelecionada: any;
  dadosComanda: any;
  itensComanda: any;

  totalPedido: number = 0;

  constructor(
    public NavController: NavController,
    public NavParams: NavParams,
    public alertCtrl: AlertController,
    public LoadingController: LoadingController,
    private CurrencyPipe: CurrencyPipe,
    private DatePipe: DatePipe,
    private GlobalsService: GlobalsService,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private AlertService: AlertService
  ){}

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.comandaSelecionada = this.NavParams.get('comanda');
    this.getDadosComanda();
  }

  fechaModal() {
    this.NavController.pop();
  }

  /************
  GET DADOS COMANDA
  *************/
  getDadosComanda() {

    //EXECUTA JSON
    let loading = this.LoadingController.create({
      spinner: 'crescent',
      content: 'Carregando informações'
    });
    loading.present().then(() => {

      this.HttpService.JSON_GET(`/comandas/${this.comandaSelecionada.id}/${this.StorageService.getItem('i')}`, false, true, 'json')
        .then(
          (res) => {
            this.dadosComanda = res.json();
            
            //CARREGANDO ITENS DA COMANDA
            this.HttpService.JSON_GET(`/comandas/${this.comandaSelecionada.id}/itens/${this.StorageService.getItem('i')}`, false, true, 'json')
              .then(
                (res) => {

                  //AGRUPANDO ITENS
                  let itensComandaPrintGroup = [];
                  let itensAtivos = [];
                  itensAtivos = res.json().filter(function (d) {
                    if (d.sts === 'ATIVO') { d.sts = '*ATIVO*' }
                    return d.sts.indexOf('*ATIVO*') !== -1 || !d;
                  });
                  itensAtivos.reduce(function (res, value) {
                    if (!res[value.prod_code]) {
                      res[value.prod_code] = {
                        id: value.id,
                        com_id: value.com_id,
                        obs: value.obs,
                        prod_desc: value.prod_desc,
                        prod_code: value.prod_code,
                        prod_id: value.prod_id,
                        qtd: 0,
                        vl_unit: value.vl_unit,
                        print_item: value.print_item,
                      };
                      itensComandaPrintGroup.push(res[value.prod_code])
                    }

                    res[value.prod_code].qtd += value.qtd;
                    return res;
                  }, {});

                  this.itensComanda = itensComandaPrintGroup;
                  loading.dismiss();
                },
                (error) => {
                  loading.dismiss();
                  this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                }
              )
          },
          (error) => {
            loading.dismiss();
            this.AlertService.showAlert('ERRO', JSON.parse(error._body));
          }
        )

    });

  }

  /************
  ADD ITEM NO PEDIDO
  *************/
  addItemPedido(index) {

    let alert = this.alertCtrl.create({
      title: 'Efetuar pedido?',
      message: `Adicionar mais um: ${this.itensComanda[index].prod_desc} ao pedido?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirmar',
          handler: () => {

            //CRIANDO OBJETO
            let objAdd = [{
              id: this.itensComanda[index].prod_id,
              codigo: this.itensComanda[index].prod_code,
              descricao: this.itensComanda[index].prod_desc,
              qtd: 1,
              vl_unit: this.itensComanda[index].vl_unit,
              print_item: this.itensComanda[index].print_item,
              obs: this.itensComanda[index].obs
            }];
            let itensComanda = [];
            itensComanda.push(objAdd[0]);

            //CRIANDO OBJETO COM TOTAL
            this.itensComanda[index].qtd = 1;
            let objPost = [{
              total: Number((this.totalPedido + this.itensComanda[index].vl_unit).toFixed(2)),
              itens: itensComanda
            }];

            //EXECUTA JSON
            let loading = this.LoadingController.create({
              spinner: 'crescent',
              content: 'Enviando pedido'
            });
            loading.present().then(() => {

              this.HttpService.JSON_POST(`/comandas/${this.dadosComanda.id}/itens/${this.StorageService.getItem('i')}`, objPost, false, true, 'json')
                .then(
                  (res) => {
                    this.enviaImpressao(objAdd);
                    loading.dismiss();
                  },
                  (error) => {
                    loading.dismiss();
                    this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                  }
                )

            });

          }
        }
      ]
    });
    alert.present();

  }

  /************
  ENVIA IMPRESSAO
  *************/
  enviaImpressao(obj){
    
    //VERIFICANDO SALDO DO CLIENTE
    let saldoCliente;
    if(this.dadosComanda.credit - this.totalPedido <= 0){
      saldoCliente = 0;
    }else{
      saldoCliente = Number((this.dadosComanda.credit - this.totalPedido).toFixed(2));
    }

    let print_item;//IMPRESSORA DO ITEM
    print_item = obj[0].print_item;

    let itemImpressao = {};
    itemImpressao['Header'] = this.StorageService.getItem('n');
    
    itemImpressao['Content'] = {};
    itemImpressao['Content'][0] = `MESA ${this.dadosComanda.mesa} / ${this.dadosComanda.name}`;
    itemImpressao['Content'][1] = `(${obj[0].qtd}x) - ${obj[0].descricao}`;
    itemImpressao['Content'][2] = obj[0].obs;
    
    itemImpressao['Footer'] = {};
    itemImpressao['Footer'][0] = this.CurrencyPipe.transform(obj[0].qtd * obj[0].vl_unit, 'BRL');
    itemImpressao['Footer'][1] = this.CurrencyPipe.transform(saldoCliente, 'BRL');
    itemImpressao['Footer'][2] = this.dadosComanda.atendente;
    itemImpressao['Footer'][3] = this.DatePipe.transform(Date.now(), 'dd/MM/yyyy, H:mm');

    this.HttpService.JSON_POST(`/impressao/item-comanda/${print_item}`, itemImpressao, false, true, 'json')
      .then(
        (res) => {

          this.AlertService.showAlert('ENVIADO', 'Seu pedido foi enviado para o preparo!');
          this.fechaModal();
          
        },
      (error) => {
        this.AlertService.showAlert('ERRO', error._body);
      })

  }

}