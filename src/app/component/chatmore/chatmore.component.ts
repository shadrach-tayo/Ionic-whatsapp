import { UserService } from './../../services/user.service';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-chatmore',
  templateUrl: './chatmore.component.html',
  styleUrls: ['./chatmore.component.scss'],
})
export class ChatmoreComponent implements OnInit {

  userId: any;
  isBlock: any;
  currentUserId: any;
  nikeName: any;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router,
    private toastController: ToastController,
    public dataService: DataService,
    private loading: LoadingService,
    public userService: UserService,
    private alertCtrl: AlertController,
    public afDB: AngularFireDatabase,

  ) {
    this.userId = this.navParams.get("userId")
    this.currentUserId = firebase.auth().currentUser.uid;
    // console.log(this.userId)
  }

  ngOnInit() {
    this.dataService.getCurrentUser(this.userId).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
    })

    this.dataService.getUser(this.userId).valueChanges().subscribe((user) => {
      this.dataService.userBock(firebase.auth().currentUser.uid).valueChanges().subscribe((blocks) => {
        this.isBlock = _.findKey(blocks, block => {
          return block = firebase.auth().currentUser.uid;
        })
        if (this.isBlock) {
          this.isBlock = true;
        } else {
          this.isBlock = false;
        }
      })
    })

  }

  eventFromPopover() {
    this.popoverController.dismiss();
  }

  unBlock() {
    this.loading.show()
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
      this.eventFromPopover()
    })
  }

  block() {
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
      this.eventFromPopover();
    })
  }

  async report() {
    const alert = await this.alertCtrl.create({
      header: 'Report this contact to WhatsApp from Pagas',
      message: "Block contact and delete this chat's messages",
      buttons: [
        {
          text: "CANCEL",
          handler: () => {

          }
        },
        {
          text: "REPORT",
          handler: () => {
            this.loading.show()
            this.deleteChat().then(() => {
              this.presentToast()
              this.loading.hide();
              if (!this.isBlock) {
                this.block();
              }
            })
          }
        }
      ]
    })
    alert.present();

  }

  async deleteChat() {
    this.loading.show();
    this.eventFromPopover();
    await this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).remove().then(() => {
      this.deleteConversation();
      this.loading.hide();
    })
  }

  // this will delete the conversation content;
  async deleteConversation() {
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Report sent and' + this.nikeName + 'has been blocked',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  contacts() {
    this.router.navigate(['/contact', { 'userId': this.userId }])
    this.eventFromPopover();
  }


}
