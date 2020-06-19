import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatsetting',
  templateUrl: './chatsetting.page.html',
  styleUrls: ['./chatsetting.page.scss'],
})
export class ChatsettingPage implements OnInit {


  darkMode: any = true;


  constructor(
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.darkMode = false;

  }

  cambio() {
    if (this.darkMode = !this.darkMode) {
      // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark');
      window.localStorage.setItem('dark', this.darkMode);
      let get = window.localStorage.getItem('dark')
      // console.log("get", get)
    } else {
      // document.body.classList.toggle('dark');
      window.localStorage.clear()
      window.localStorage.removeItem('dark');
      let get = window.localStorage.getItem('dark')
      // console.log("clear", get)
    }
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
