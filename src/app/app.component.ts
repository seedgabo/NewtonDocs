import { Api } from "./../providers/Api";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage;
  pages: Array<{ title: string; component: any; icon: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public api: Api) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: "HomePage", icon: "home" }
      // { title: 'Comunicado', component: 'TutorialPage', icon: 'information-circle' },
      // { title: 'List', component: ListPage, icon: 'list' }
    ];
    this.api.ready.then((data: any) => {
      if (data) {
        this.rootPage = "HomePage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout() {
    this.api.storage.remove("user");
    this.api.storage.remove("username");
    this.api.storage.remove("passowrd");
    this.api.user = null;
    this.api.username = null;
    this.api.password = null;
    this.api.saveUser(null);
    this.nav.setRoot("LoginPage");
  }
}
