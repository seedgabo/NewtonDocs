
import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { trigger, state, transition, style, animate } from '@angular/core';
import { RequestOptions, ResponseContentType } from '@angular/http';
declare var saveAs: any;
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: '0', left: "-200px", position: 'absolute' })),
      state('*', style({ opacity: '1', left: '0px' })),
      transition('void <=> *', animate('300ms ease-in'))
    ])
  ]
})
export class ListPage {
  categorias: any = [];
  documentos: any = [];
  categoria: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.categoria = this.navParams.get('categoria');
  }

  ionViewDidLoad() {
    this.getDocumentos()
    this.getCategorias()
  }
  getCategorias() {
    this.api.get(`categorias-documentos?where[parent_id]=${this.categoria.id}`)
      .then((cats) => {
        this.categorias = cats
      })
      .catch(console.error)
  }

  getDocumentos() {
    this.api.get(`documentos?where[categoria_id]=${this.categoria.id}&where[activo]=1`)
      .then((docs) => {
        this.documentos = docs
      })
      .catch(console.error)
  }

  goToCategoria(categoria) {
    this.navCtrl.push(ListPage, { categoria: categoria })
  }
  openDocument(documento) {
    // window.open(this.api.url + 'api/getDocumento/' + documento.id, '__system')
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    options.headers = this.api.setHeaders()
    var reader = new FileReader();
    this.api.http.get(this.api.url + '/api/getDocumento/' + documento.id, options)
      // .map(res => res.blob())
      .subscribe((res) => {
        var blob = new Blob([res.blob()], /*{ type: "text/plain;charset=utf-8" }*/);
        saveAs(blob, documento.archivo || documento.titulo);
      }, console.error)

    // reader.onloadend = function (e) {
    //   // window.open("data:application/octet-stream," + reader.result, '__system');
    //   var blob = new Blob([reader.result], { type: "text/plain;charset=utf-8" });
    //   saveAs(blob, documento.archivo);
    // }
  }
}
