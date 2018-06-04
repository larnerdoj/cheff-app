/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Funcoes e compartilhamentos globais


COMPONENTS
***********************************************************/
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class GlobalsService {

    VersaoAPP = '1.0.8';
    lojaAndroid = 'https://play.google.com/store/apps/details?id=innsere.app.cheff.com.br';
    lojaApple = '';
    lojaWindows = '';

    isTaxa: boolean = null;
    typeTaxa: string = null;
    vlTaxa: number = null;

    isCouvert: boolean = null;
    typeCouvert: string = null;
    vlCouvert: number = null;

    mesaSelecionada = {
        id: null,
        txt: null
    };

    comandaSelecionada: any;
    categoriaSelecionada: string = null;

    constructor(
        public DomSanitizer: DomSanitizer,
    ) { }

    //GERANDO IMAGEM LOIN
    getImgLogin() {
        return this.DomSanitizer.bypassSecurityTrustStyle(`url(assets/imgs/back-${Math.floor(Math.random() * (5 - + 1)) + 1}.jpg)`);
    }

    //GERANDO IMAGEM ALEATORIA
    getImgRandom() {
        return `assets/imgs/bg-header-${Math.floor(Math.random() * (5 - + 1)) + 1}.png`;
    }

}