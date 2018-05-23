/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Modal Categorias


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../../globals/globals';

@Component({
  selector: 'modal-categorias',
  templateUrl: 'modal-categorias.html'
})
export class ModalCategoriasPage {

  itensCategoria: any;
  categoriaSelecionada: string = null;

  constructor(
    public NavController: NavController,
    public NavParams: NavParams,
    private GlobalsService: GlobalsService,
  ){}

  ionViewDidLoad() {

    //CARREGANDO ITENS INICIAIS
    this.itensCategoria = this.NavParams.get('itens');
    this.categoriaSelecionada = this.GlobalsService.categoriaSelecionada;
  }

  fechaModal() {
    this.NavController.pop();
  }

}
