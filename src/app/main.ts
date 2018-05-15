import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CheffModule } from './app.module';
import { enableProdMode } from '@angular/core';

enableProdMode();
platformBrowserDynamic().bootstrapModule(CheffModule);
