/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Servico global de alert utilizando componente sweetalert2


COMPONENTS
***********************************************************/
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

    constructor(
        public alertCtrl: AlertController
    ) { }

    /************
    ALERT
    *************/
    showAlert(titulo, msg) {
        let alert = this.alertCtrl.create({
            title: titulo,
            message: msg,
            buttons: ['Fechar']
        });
        alert.present();
    }

}