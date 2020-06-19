import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { EventService } from '../../services/event.service';
import { LoadingService } from '../../services/loading.service';
import { ChatService } from '../../services/chat.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataService } from '../../services/data.service';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  Conversations = [];
  allUser = [];
  isLoading = true;
  userList: any;
  user: any;
  userLength: any;
  conversations: any
  currentUserId: any;
  lenght
  userId: any;
  private subscription: any;
  groups: any;



  constructor(
    private router: Router,
    public alertService: AlertService,
    // public events: Events,
    public events: EventService,
    public ngZone: NgZone,
    public loading: LoadingService,
    public chatService: ChatService,
    public afDB: AngularFireDatabase,
    public dataService: DataService,
    private toast: ToastController
  ) {
    // this.currentUserId = firebase.auth().currentUser.uid;
    // //let invoke the parameter from the chatService 
    // this.events.subscribe('conversations', () => {
    //   this.ngZone.run(() => {
    //     this.Conversations = this.chatService.Conversations;
    //     this.allUser = this.chatService.boddyUser;
    //     this.lenght = this.chatService.lenght;
    //     this.isLoading = false;
    //     console.log(this.lenght)
    //   })
    // })

  }

  ngOnInit() {
    this.viewMessaging()

    //get the conversations length
    this.dataService.conversation(firebase.auth().currentUser.uid).valueChanges().subscribe((lengths) => {
      this.conversations = lengths;
      this.isLoading = false;
    })
    this.dataService.getUsers().valueChanges().subscribe((userlist) => {
      this.userList = userlist.slice(0, 5)
    })

  }
  // this will delete the conversation content;
  async deleteConversation(item) {
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(item.userId).once('value', snap => {
      var res = snap.val()
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }

  // after leave the page from chat will be
  ionViewDidLeave() {
    this.events.subscribe('conversations', () => { })
  }

  ionViewDidEnter() {
    // this will initial the conversation item for the list
    // this.chatService.getConversations()
  }

  doChat(userId) {
    if (userId === this.currentUserId) {
      this.router.navigateByUrl("/profile")
    } else {
      this.router.navigate(['/do-chat', { 'userId': userId }])
    }
  }

  // user can navigate form other page//
  userpagas() {
    this.router.navigateByUrl("/userpage")
  }

  // this will notify the option
  async notification() {
    const toast = await this.toast.create({
      message: 'Oops, wait for the developer update for next version.',
      duration: 3000,
    });
    toast.present();
  }


  viewMessaging() {
    // let the message  chat bot with the group chat
    this.userId = firebase.auth().currentUser.uid;
    this.subscription = this.dataService.chat(this.userId).valueChanges().subscribe((groupIds) => {
      if (groupIds.length) {
        // let get the length of the group
        if (this.groups && this.groups.length > groupIds.length) {
          this.groups = [];
        }
        // let make list forEach of item from the list
        groupIds.forEach((groupId) => {
          // let get the user database from the firebase 
          this.dataService.groups(groupId.key).valueChanges().subscribe((data) => {
            console.log("userData", data)
          })
        })
      }
    })

  }


}
