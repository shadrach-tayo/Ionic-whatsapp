import { Platform, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-show-status',
  templateUrl: './show-status.page.html',
  styleUrls: ['./show-status.page.scss'],
})
export class ShowStatusPage implements OnInit {

  status: any;
  id: any;


  constructor(
    private statusBar: StatusBar,
    private platform: Platform,
    private element: ElementRef,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
    });

    var width = 0;
    var elem = document.getElementById("myBar");
    this.id = setInterval(loadProgress, 50);
    // this.id = setInterval(this.loadProgress, 50);
    function loadProgress() {
      if (width >= 100) {
        clearInterval(this.id);
        // that.app.goBack();
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
    console.log("ionViewDidLoad ShowStatusPage");

  }
  ionViewWillLeave() {
    clearInterval(this.id);
    // this.platform.ready().then(() => {
    //   this.statusBar.show();
    // });
  }

  loadProgress() {
    var width = 0;
    var elem = document.getElementById("myBar");

    if (width >= 100) {
      clearInterval(this.id);
      // that.app.goBack();
    } else {
      width++;
      elem.style.width = width + "%";
    }
  }

}
