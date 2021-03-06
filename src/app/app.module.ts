/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Modulo principal da aplicacao


COMPONENTS
***********************************************************/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from "@ionic-native/push";
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

/***********************************************************
GLOBALS - SHAREDS
***********************************************************/
import { TopoComponent } from '../components/topo/topo';
import { ModalMesasPage } from '../components/modal/modal-mesas';
import { ModalComandasPage } from '../components/modal/modal-comandas';
import { ModalCategoriasPage } from '../components/modal/modal-categorias';
import { ModalItensComandaPage } from '../components/modal/modal-itens-comanda';

/***********************************************************
SERVICES
***********************************************************/
import { GlobalsService } from '../globals/globals';
import { StorageService } from '../globals/storage';
import { HttpService } from '../globals/http';
import { AlertService } from '../globals/alert';

/***********************************************************
PAGES
***********************************************************/
import { CheffApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MesasPage } from '../pages/mesas/mesas';
import { NovaComandaPage } from '../pages/nova-comanda/nova-comanda';
import { CardapioPage } from '../pages/cardapio/cardapio';

@NgModule({
  declarations: [
    CheffApp,
    LoginPage,
    HomePage,
    MesasPage,
    NovaComandaPage,
    CardapioPage,

    TopoComponent,
    ModalMesasPage,
    ModalComandasPage,
    ModalCategoriasPage,
    ModalItensComandaPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(CheffApp,{
      activator: 'ripple',
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back-outline',
      iconMode: 'ios',
      menuType: 'push',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'top',
      tabsHighlight: true,
      pageTransition: 'ios-transition'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CheffApp,
    LoginPage,
    HomePage,
    MesasPage,
    NovaComandaPage,
    CardapioPage,

    ModalMesasPage,
    ModalComandasPage,
    ModalCategoriasPage,
    ModalItensComandaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'pt-BR'},

    CurrencyPipe,
    DatePipe,

    TopoComponent,
    GlobalsService,
    StorageService,
    HttpService,
    AlertService,

    Push
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CheffModule {}
