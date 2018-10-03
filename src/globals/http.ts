/*--------------
V 1.0.0 - Criado por Larner Diogo - PADRONIZADO

DESCIÇÃO:
Servico global de requisicoes http


COMPONENTS
***********************************************************/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

/***********************************************************
SERVICES
***********************************************************/
import { StorageService } from './storage';

@Injectable()
export class HttpService {

    URL_api: string;
    URL_REQUEST: string;
    timeOutMs: number = 5000;

    constructor(
        private http: Http,
        private StorageService: StorageService
    ) {
        //this.URL_api = 'http://192.168.2.214:13579/api';
        this.URL_api = 'http://121.122.123.2:13579/api';//RASP
    }

    /************
    HEADER
    *************/
    getHeader(auth: boolean, tipo_obj) {
        let headers = new Headers();

        //TIPOS DE OBJETOS
        if (tipo_obj === 'json') { headers.append('Content-Type', 'application/json'); }

        //HEADER COM AUTHORIZATION
        if (auth == true) {
            headers.append('Authorization', this.StorageService.getItem('tokenUser'));
        }
        return headers
    }

    /************
    POST
    *************/
    JSON_POST(url, fields, auth: boolean, use_url_api: boolean, tipo_obj: string): Promise<any> {
        if (use_url_api === true) { this.URL_REQUEST = this.URL_api + url } else { this.URL_REQUEST = url }
        return this.http.post(this.URL_REQUEST, fields, { headers: this.getHeader(auth, tipo_obj) })
        .timeout(this.timeOutMs)
        .toPromise()
    }

    /************
    GET
    *************/
    JSON_GET(url, auth: boolean, use_url_api: boolean, tipo_obj: string): Promise<any> {
        if (use_url_api === true) { this.URL_REQUEST = this.URL_api + url } else { this.URL_REQUEST = url }
        return this.http.get(this.URL_REQUEST, { headers: this.getHeader(auth, tipo_obj) })
        .timeout(this.timeOutMs)
        .toPromise()
    }

    /************
    PUT
    *************/
    JSON_PUT(url, fields, auth: boolean, use_url_api: boolean, tipo_obj: string): Promise<any> {
        if (use_url_api === true) { this.URL_REQUEST = this.URL_api + url } else { this.URL_REQUEST = url }
        return this.http.put(this.URL_REQUEST, fields, { headers: this.getHeader(auth, tipo_obj) })
        .timeout(this.timeOutMs)
        .toPromise()
    }

    /************
    DELETE
    *************/
    JSON_DELETE(url, auth: boolean, use_url_api: boolean, tipo_obj: string): Promise<any> {
        if (use_url_api === true) { this.URL_REQUEST = this.URL_api + url } else { this.URL_REQUEST = url }
        return this.http.delete(this.URL_REQUEST, { headers: this.getHeader(auth, tipo_obj) })
        .timeout(this.timeOutMs)
        .toPromise()
    }

}