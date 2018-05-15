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

    constructor(
        public DomSanitizer: DomSanitizer,
    ) { }

    //GERANDO IMAGEM LOIN
    getImgLogin(){
        return this.DomSanitizer.bypassSecurityTrustStyle(`url(assets/imgs/back-${Math.floor(Math.random() * (5 - + 1)) + 1}.jpg)`);
    }

    //GERANDO IMAGEM ALEATORIA
    getImgRandom(){
        return `assets/imgs/bg-header-${Math.floor(Math.random() * (5 - + 1)) + 1}.png`;
    }

}