import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-changenumber',
  templateUrl: './changenumber.page.html',
  styleUrls: ['./changenumber.page.scss'],
})
export class ChangenumberPage implements OnInit {

  constructor(
    private toast : ToastController
  ) { }

  ngOnInit() {
  }

   //pop a notification
   async toastShow() {
    const toast = await this.toast.create({
      message: 'Oops, This feature is not availabe on this version.',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

}
