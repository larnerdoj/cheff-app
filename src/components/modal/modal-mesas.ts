/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Modal Mesas


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';

@Component({
  selector: 'modal-mesas',
  templateUrl: 'modal-mesas.html'
})
export class ModalMesasPage {

  itensMesas: any;
  mesaSelecionada: string = null;

  constructor(
    public NavController: NavController,
    public NavParams: NavParams,
    private GlobalsService: GlobalsService,
  ){}

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.itensMesas = this.NavParams.get('itens');
    this.mesaSelecionada = this.GlobalsService.mesaSelecionada.id;
  }

  fechaModal() {
    this.NavController.pop();
  }

}
