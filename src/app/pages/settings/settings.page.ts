import { DataService } from './../../services/data.service';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  nikeName: any;
  image: any;
  description: any

  constructor(
    private router: Router,
    private toast: ToastController,
    public dataService: DataService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) =>{  
      this.nikeName = user.nikeName;
      this.image = user.img
      this.description = user.description;
    })
    
  }

  profile(){
    this.router.navigateByUrl('/profile')
  }

  account() {
    this.router.navigateByUrl('/account')
  }

  chatsetting() {
    this.router.navigateByUrl('/chatsetting')
  }

  notification() {
    this.toastShow()
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

  help(){
    this.router.navigateByUrl("/help")
  }

  back(){
    this.navCtrl.pop();
  }
}
