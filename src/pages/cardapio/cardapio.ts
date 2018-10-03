/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Cardapio


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { CurrencyPipe, DatePipe } from '@angular/common';

/***********************************************************
SERVICES
***********************************************************/
import { HttpService } from '../../globals/http';
import { StorageService } from '../../globals/storage';
import { GlobalsService } from '../../globals/globals';
import { AlertService } from '../../globals/alert';

/* import { ModalComandasPage } from '../../components/modal/modal-comandas'; */
import { ModalCategoriasPage } from '../../components/modal/modal-categorias';
import { ModalItensComandaPage } from '../../components/modal/modal-itens-comanda';

/***********************************************************
PAGES
***********************************************************/
import { HomePage } from '../home/home';
import { MesasPage } from './../mesas/mesas';

@Component({
  selector: 'page-cardapio',
  templateUrl: 'cardapio.html'
})
export class CardapioPage {

  urlImg: any;
  segmentoSelecionado: string;

  itemCarregado: any;
  itens: any;
  itensFull: any;
  combos: any;
  categorias: any;

  qtdInicial: number = 1;
  totalPedido: number = 0;

  exibeProdutosFiltrados: boolean = false;

  itensMesas: any = [];
  itensComanda: any = [];

  constructor(
    public navCtrl: NavController,
    public NavParams: NavParams,
    public LoadingController: LoadingController,
    public alertCtrl: AlertController,
    public ModalController: ModalController,
    private CurrencyPipe: CurrencyPipe,
    private DatePipe: DatePipe,
    private HttpService: HttpService,
    private StorageService: StorageService,
    private GlobalsService: GlobalsService,
    private AlertService: AlertService
  ) { }

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.urlImg = this.GlobalsService.getImgRandom();
    this.itemCarregado = this.GlobalsService.comandaSelecionada;
    this.getItens();
  }

  /************
  GET ITENS
  *************/
  getItens() {

    //EXECUTA JSON
    let loading = this.LoadingController.create({
      spinner: 'crescent',
      content: 'Carregando informações'
    });
    loading.present().then(() => {

      //CARREGANDO COMBOS
      this.HttpService.JSON_GET(`/combos`, false, true, 'json')
        .then(
          (res) => {
            this.combos = res.json();

            //CARREGANDO CATEGORIAS
            this.HttpService.JSON_GET(`/categorias/${this.StorageService.getItem('i')}`, false, true, 'json')
              .then(
                (res) => {
                  this.categorias = res.json();

                  //CARREGANDO PRODUTOS
                  this.HttpService.JSON_GET(`/produtos/${this.StorageService.getItem('i')}/comanda`, false, true, 'json')
                    .then(
                      (res) => {
                        this.itensFull = res.json();
                        
                        //CARREGANDO COMANDAS ABERTAS
                        this.HttpService.JSON_GET(`/comandas/${this.StorageService.getItem('i')}/atendente/${this.StorageService.getItem('u')}`, false, true, 'json')
                          .then(
                            (res) => {
                              this.itensMesas = res.json();
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
  EXIBIR ITENS COMANDA
  *************/
  exibirItensComanda() {
    let modalItensComanda = this.ModalController.create(ModalItensComandaPage, {comanda: this.itemCarregado});
    modalItensComanda.present();
  }

  /************
  SELECIONAR COMANDA
  *************/
  /* selecionarComanda() {
    let modalComanda = this.ModalController.create(ModalComandasPage, {itens: this.itensMesas});
    modalComanda.present();
  } */

  /************
  SELECIONA SEGMENTO DE BUSCA
  *************/
  selecionaSegmento(event){
    this.segmentoSelecionado = event.value;

    if(this.segmentoSelecionado === 'categorias'){
      let modalCategorias = this.ModalController.create(ModalCategoriasPage, {itens: this.categorias});
      modalCategorias.present();
      modalCategorias.onDidDismiss(()=>{
        let eventSelect = {
          target: {
            value: this.GlobalsService.categoriaSelecionada
          }
        };
        this.filtraProdutos(eventSelect, 'categorias', true);
      })
    }
  }

  /************
  FILTRA PRODUTOS
  *************/
  filtraProdutos(event, tipo, categoria) {

    let val = event.target.value;
    if (val === undefined) {
      this.itens = this.itensFull;
      this.exibeProdutosFiltrados = false;

    } else {

      if (val.length === 0) {
        this.itens = this.itensFull;
        this.exibeProdutosFiltrados = false;

      } else {

        val = val.toLowerCase();
        let filtro;

        //VERIFICANDO SE A BUSCA É POR CODIGO
        if(tipo === 'codigo'){
          filtro = this.itensFull.filter(function (o) {
            return o['codigo'].toString().toLowerCase().indexOf(val) != -1 || !val;
          })

          this.itens = filtro;

        }else if(categoria === true){

          filtro = this.itensFull.filter(function (o) {
            return o['categoria'].toString().toLowerCase().indexOf(val) != -1 || !val;
          })

          this.itens = filtro;
          
        }else{//OU GERAL

          filtro = this.itensFull.filter(function (o) {
            return Object.keys(o).some(function (k) {
              if(o[k] === null){}
              else{
                return o[k].toString().toLowerCase().indexOf(val) != -1 || !val;
              }
            })
          })

          this.itens = filtro;
        }

        this.exibeProdutosFiltrados = true;

      }
    }

  }

  /************
  ADICIONA ITEM COMANDA
  *************/
  addItem(item) {

    //CRIANDO OBJETO
    let objAdd = [{
      id: item.id,
      codigo: item.codigo,
      descricao: item.descricao,
      categoria: item.categoria,
      qtd: this.qtdInicial,
      vl_unit: item.valor,
      is_promotion: item.is_promotion,
      vl_promotion: item.vl_promotion,
      vl_rate_promotion: item.vl_rate_promotion,
      print_item: `${item.print_item}/${item.print_ip}`,
      obs: null
    }];
    this.itensComanda.push(objAdd[0]);

    this.itens = this.itensFull;
    this.exibeProdutosFiltrados = false;
  }

  /************
  REMOVE ITEM COMANDA
  *************/
  deleteItemComanda(index) {

    let alert = this.alertCtrl.create({
      title: 'Excluir item?',
      message: 'Tem certeza que deseja excluir o item do pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Excluir',
          handler: () => {
            this.itensComanda.splice(index, 1);
            
          }
        }
      ]
    });
    alert.present();
  }

  delQtd(index){
    if(this.itensComanda[index].qtd === 1){}
    else{
      this.itensComanda[index].qtd--;
      if(this.itensComanda[index].qtd === 0){ this.itensComanda[index].qtd = 1 }
    }
  }
  addQtd(index){
    this.itensComanda[index].qtd++;
  }

  /************
  SETA OBSERCACOES
  *************/
  setObservacoes(index) {
    let alert = this.alertCtrl.create({
      title: `Observações: ${this.itensComanda[index].descricao}`,
      inputs: [
        {
          name: 'obs',
          placeholder: 'Digite as observações',
          value: this.itensComanda[index].obs
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {}
        },
        {
          text: 'OK',
          handler: data => {
            if(data.obs === null || data.obs === ''){
              data.obs = null;
            }
            this.itensComanda[index].obs = data.obs;
          }
        }
      ]
    });
    alert.present();
  }

  /************
  CANCELAR PEDIDO
  *************/
  cancelarPedido() {

    let alert = this.alertCtrl.create({
      title: 'Cancelar pedido?',
      message: 'Tem certeza que deseja cancelar o pedido?',
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot(HomePage, {}, { animate: true, direction: 'back' });
          }
        }
      ]
    });
    alert.present();
  }

  /************
  CALCULA TOTAL
  *************/
  calculaTotal() {
    this.totalPedido = 0;
    return Promise.resolve(this.itensComanda.forEach(s => this.totalPedido += (s.vl_unit * s.qtd)))
      .then(() => { return Number((this.totalPedido).toFixed(2)) })
  }

  /************
  CONFIRMA PEDIDO
  *************/
  confirmarPedido(){

    if(this.itensComanda.length > 0){

      let alert = this.alertCtrl.create({
        title: 'Enviar pedido?',
        message: 'Confirme seu pedido para inciar o preparo!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Enviar',
            handler: () => {
              
              Promise.resolve(this.calculaTotal())
              .then(() => {

                //CRIANDO OBJETO COM TOTAL
                let objPost = [{
                  total: this.totalPedido,
                  itens: this.itensComanda
                }];

                //EXECUTA JSON
                let loading = this.LoadingController.create({
                  spinner: 'crescent',
                  content: 'Enviando pedido'
                });
                loading.present().then(() => {

                  this.HttpService.JSON_POST(`/comandas/${this.itemCarregado.id}/itens/${this.StorageService.getItem('i')}`, objPost, false, true, 'json')
                    .then(
                      (res) => {
                        this.enviaImpressao();
                        loading.dismiss();
                      },
                      (error) => {
                        loading.dismiss();
                        this.AlertService.showAlert('ERRO', JSON.parse(error._body));
                      }
                    )

                });

              })

            }
          }
        ]
      });
      alert.present();

    }else{
      this.AlertService.showAlert('ATENÇÃO', 'Você ainda não adicionou nenhum item ao pedido!');
    }

  }

  /************
  ENVIA IMPRESSAO
  *************/
  enviaImpressao(){

    let i;
    let countItens = 0;
    for(i=0;i<this.itensComanda.length;i++){

      //VERIFICANDO SALDO DO CLIENTE
      let saldoCliente;
      if(this.itemCarregado.credito - this.totalPedido <= 0){
        saldoCliente = 0;
      }else{
        saldoCliente = Number((this.itemCarregado.credito - this.totalPedido).toFixed(2));
      }

      let print_item;//IMPRESSORA DO ITEM
      print_item = this.itensComanda[i].print_item;

      let itemImpressao = {};
      itemImpressao['CONFIG'] = {};
      itemImpressao['CONFIG']['qtd_vias'] = this.GlobalsService.qtdVias;

      itemImpressao['Header'] = this.StorageService.getItem('n');
      
      itemImpressao['Content'] = {};
      itemImpressao['Content'][0] = `MESA ${this.itemCarregado.mesa} / ${this.itemCarregado.cliente}`;
      itemImpressao['Content'][3] = this.itensComanda[i].categoria;
      itemImpressao['Content'][1] = `(${this.itensComanda[i].qtd}x) - ${this.itensComanda[i].descricao}`;
      itemImpressao['Content'][2] = this.itensComanda[i].obs;

      let vlTotal;
      if(this.itensComanda[i].is_promotion === 1){
        vlTotal = this.itensComanda[i].qtd * this.itensComanda[i].vl_promotion;
      }else{
        vlTotal = this.itensComanda[i].qtd * this.itensComanda[i].vl_unit;
      }
      
      itemImpressao['Footer'] = {};
      itemImpressao['Footer'][0] = this.CurrencyPipe.transform(Number((vlTotal).toFixed(2)), 'BRL');
      itemImpressao['Footer'][1] = this.CurrencyPipe.transform(saldoCliente, 'BRL');
      itemImpressao['Footer'][2] = this.itemCarregado.atendente;
      itemImpressao['Footer'][3] = this.DatePipe.transform(Date.now(), 'dd/MM/yyyy, H:mm');

      countItens++;

      this.HttpService.JSON_POST(`/impressao/item-comanda/${print_item}`, itemImpressao, false, true, 'json')
        .then(
          (res) => {
            
          },
        (error) => {
          this.AlertService.showAlert('ERRO', error._body);
        })

        if(countItens===this.itensComanda.length){
          this.navCtrl.setRoot(MesasPage, {}, { animate: true, direction: 'back' });
          this.AlertService.showAlert('ENVIADO', 'Seu pedido foi enviado para o preparo!');
        }

    }

  }

  gerarQRCode() {

    let alert = this.alertCtrl.create({
        title: 'Gerar acesso ao App?',
        message: 'Tem certeza que deseja gerar o acesso ao APP do Cliente!',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Gerar',
            handler: () => {
              
              //IMPRESSAO QR CODE
              let itemImpressao = {};
              itemImpressao['Content'] = {};
              itemImpressao['Content'][0] = `MESA ${this.itemCarregado.mesa} / ${this.itemCarregado.cliente.toUpperCase()}`;
              itemImpressao['Content'][1] = this.itemCarregado.pedido;

              //EXECUTA JSON
              let loading = this.LoadingController.create({
                spinner: 'crescent',
                content: 'Gerando acesso'
              });
              loading.present().then(() => {

                this.HttpService.JSON_POST(`/impressao/qr-code/ELGIN-1/null`, itemImpressao, false, true, 'json')
                  .then(
                    (res) => {
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

}
