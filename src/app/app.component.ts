import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.darkMode = window.localStorage.getItem('dark');

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#054D44');
      // this.checkDarkTheme()
      this.splashScreen.hide();
    });
  }

  checkDarkTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      document.body.classList.toggle('dark');
      this.statusBar.backgroundColorByHexString('#0F1D24');
    } else if (this.darkMode) {
      document.body.classList.toggle('dark');
      this.statusBar.backgroundColorByHexString('#0F1D24');
    } else {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#054D44');

    }
  }
}
