import { Api } from "./../../providers/Api";
import { Component } from "@angular/core";
import { NavController, IonicPage } from "ionic-angular";
import { ListPage } from "../list/list";
import { trigger, state, transition, style, animate } from "@angular/core";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  animations: [
    trigger("fadeInOut", [
      state("void", style({ opacity: "0", left: "-200px", position: "absolute" })),
      state("*", style({ opacity: "1", left: "0px" })),
      transition("void <=> *", animate("300ms ease-in"))
    ])
  ]
})
export class HomePage {
  categorias;
  cliente;
  constructor(public navCtrl: NavController, public api: Api) {}
  ionViewDidLoad() {
    this.api.ready.then(() => {
      if (this.api.user) {
        this.getCategorias();
        this.getCliente();
      }
    });
  }

  getCliente() {
    if (this.api.user.cliente_id)
      this.api
        .get(`clientes/${this.api.user.cliente_id}`)
        .then((data: any) => {
          this.cliente = data;
        })
        .catch(console.error);
  }

  getCategorias() {
    this.api
      .get(`users/${this.api.user.id}?with[]=categoriasdocumentos`)
      .then((data: any) => {
        console.log(data);
        this.categorias = data.categoriasdocumentos.filter((cat) => {
          return cat.parent_id == null || cat.parent_id == 0;
        });
      })
      .catch(console.error);
  }

  goToCategoria(categoria) {
    this.navCtrl.push(ListPage, { categoria: categoria });
  }
}
