/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Page Home


COMPONENTS
***********************************************************/
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  urlImg: any;
  nomeUser: string = '';

  constructor(
    public navCtrl: NavController,
    private GlobalsService: GlobalsService,
    private StorageService: StorageService
  ){}

  ionViewDidLoad() {
    this.urlImg = this.GlobalsService.getImgRandom();
    this.nomeUser = this.StorageService.getItem('n');
  }

  verMesas(){
    return this.navCtrl.push(MesasPage, {}, { animate: true, direction: 'forward' });
  }
  novaComanda(){
    return this.navCtrl.push(NovaComandaPage, {}, { animate: true, direction: 'forward' });
  }

}
