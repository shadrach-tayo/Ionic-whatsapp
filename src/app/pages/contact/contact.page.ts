import { UserService } from './../../services/user.service';
import { LoadingService } from './../../services/loading.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  userId: any;

  nikeName: any;
  phoneNumber: any;
  image: any;
  description: any;
  dateDec: any;

  isBlock;
  currentUserId


  constructor(
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    public afDB: AngularFireDatabase,
    public userService: UserService,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {
    this.userId = this.actRoute.snapshot.paramMap.get('userId')
    this.currentUserId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    this.dataService.getCurrentUser(this.userId).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
      this.phoneNumber = user.phoneNumber;
      this.image = user.img;
      this.description = user.description;
      this.dateDec = user.dateDec;
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
  async block() {
    if (!this.isBlock) {
      const alert = await this.alertCtrl.create({
        message: "Block" + this.nikeName + "Blocked contacts will no longer be able to call you or send messages.",
        buttons: [
          {
            text: "CANCEL",
            handler: () => {

            }
          },
          {
            text: "BLOCK",
            handler: () => {
              this.blockUser()
            }
          }
        ]
      })
      alert.present();
    }

  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Report sent and' + this.nikeName + 'has been blocked',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  unBlock() {
    this.loading.show()
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }

  blockUser() {
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }

  async deleteChat() {
    this.loading.show();
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

  back() {
    this.navCtrl.pop()
  }

}
