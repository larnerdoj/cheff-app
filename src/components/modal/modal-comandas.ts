/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Modal Comandas


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';

@Component({
  selector: 'modal-comandas',
  templateUrl: 'modal-comandas.html'
})
export class ModalComandasPage {

  itensComandas: any;
  comandaSelecionada: string = null;

  constructor(
    public NavController: NavController,
    public NavParams: NavParams,
    private GlobalsService: GlobalsService,
  ){}

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.itensComandas = this.NavParams.get('itens');
    this.comandaSelecionada = this.GlobalsService.comandaSelecionada.id;
  }

  fechaModal() {
    this.NavController.pop();
  }

}
