import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { PopoverController, IonContent, ToastController, ActionSheetController } from '@ionic/angular';
import { ChatmoreComponent } from './../../component/chatmore/chatmore.component';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AngularFireObject, AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { EventService } from 'src/app/services/event.service';
import { ChatService } from 'src/app/services/chat.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-do-chat',
  templateUrl: './do-chat.page.html',
  styleUrls: ['./do-chat.page.scss'],
})
export class DoChatPage implements OnInit {

  list: AngularFireList<any>;


  message: any;
  userId: any;
  @ViewChild('IonContent', { static: true }) IonContent: IonContent
  users: AngularFireObject<any>;
  onlineStatus = 'Online';
  messagesToShow = [];
  user: any;
  image: any;
  nikeName: any;
  status: any;
  isOnline: any;
  lastSeen: any;
  currentUsername;
  sender: any;
  isBlock;
  blocks;
  me: any;
  currentUserId;
  isLoading = true;
  recording = false;
  private groupPhotoOption: CameraOptions;

  // message: string = "";
  // date: any;
  // conversation: any;
  // user: any;
  statusRecord: string;
  audioFile: MediaObject;

  constructor(
    private popoverController: PopoverController,
    public dataService: DataService,
    private camera: Camera,
    public eventService: EventService,
    public router: Router,
    public chatService: ChatService,
    private actRoute: ActivatedRoute,
    public ngZone: NgZone,
    private toast: ToastController,
    private afDB: AngularFireDatabase,
    private file: File,
    private media: Media,
    private afstorage: AngularFireStorage,
    private actionSheet: ActionSheetController,
    public loading: LoadingService,
    public userService: UserService,
  ) {
    this.audioFile = this.media.create(this.file.externalRootDirectory + '/audioRec.mp3')

    this.currentUserId = firebase.auth().currentUser.uid;
    // this.readMessage()
    this.groupPhotoOption = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
    // get the userId
    this.userId = this.actRoute.snapshot.paramMap.get('userId')
    // this.me = this.actRoute.snapshot.paramMap.get('me')
    setTimeout(() => {
      this.scrollToBottom()
    }, 10);
    // get messaging chat from chat Service
    this.eventService.subscribe('messages', () => {
      this.messagesToShow = [];
      this.ngZone.run(() => {
        this.messagesToShow = this.chatService.buddymessages;
        this.isLoading = false;
      })
    })
  }



  ngOnInit() {

    this.readMessage();


    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once("value", snap => {
      let me = snap.val();
      this.me = me.me;
      console.log("dataMe", me)
    });

    this.readMessageSender()
    // let invoke the user database from the firebase 
    // this will fet the data from the firebase
    this.dataService.getUser(this.userId).valueChanges().subscribe((user) => {
      this.user = user;
      this.nikeName = user.nikeName;
      this.isOnline = user.status;
      this.image = user.img;
      this.status = user.status;
      this.userId = user.userId;
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
      this.dataService.userBocks(firebase.auth().currentUser.uid).valueChanges().subscribe((blocks) => {
        this.blocks = _.findKey(blocks, block => {
          return block = this.userId;
        })
        if (this.blocks) {
          this.blocks = true;
        } else {
          this.blocks = false;
        }
      })
    })
  }

  scroll() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 10)
  }
  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    // this.interstitial();
    this.eventService.destroy('chat:received');
  }

  ionViewDidLeave() {
    // this.interstitial();
    this.eventService.subscribe('messages', () => { });
    this.readMessage();
    this.readMessageSender();

  }

  ionViewDidEnter() {
    // this.readMessage()
    this.readMessageSender();
    this.chatService.getMessage(this.userId);
    setTimeout(() => {
      this.scrollToBottom()
    }, 500)
    //  console.log('scrollBottom2');
  }

  readMessage() {
    var updateRead = {
      read: 'read'
    }
    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once("value", snap => {
      var res = snap.val();
      let key = Object.keys(res)
      this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).once("value", value => {
        let me = value.val();
        console.log("dataMe", me.me)
        if (me.me == 'you') {
          this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let key = Object.keys(res)
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).update({ read: 'read' })
            }
          }).then(() => {
            this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let key = Object.keys(res)
                this.afDB.database.ref('conversations').child(this.userId).child(key[0]).update(updateRead)
              }
            })
          })
        }
        else if (me.me = ! 'me') {
          this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let key = Object.keys(res)
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(key[0]).update(updateRead)
            }
          }).then(() => {
            this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let key = Object.keys(res)
                this.afDB.database.ref('conversations').child(this.userId).child(key[0]).update(updateRead)
              }
            })
          })

        }
      });
    })


  }

  readMessageSender() {
    var updateRead = {
      read: 'read'
    }
    // get the current data enter the message  throught base on the user
    this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
      var res = snapshot.val();
      if (res != null) {
        let key = Object.keys(res)
        for (let i = 0; i < key.length; i++) {
          // console.log(key[i])
          this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).child(key[i]).update(updateRead)
        }
      }
    }).then(() => {
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
        var res = snapshot.val();
        if (res != null) {
          let key = Object.keys(res)
          for (let i = 0; i < key.length; i++) {
            // console.log(key[i])
            this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(key[i]).update(updateRead)
          }
        }
      })
    })

  }

  animateMessage(message) {
    setTimeout(() => {
      var tick = message.querySelector('.tick');
      tick.classList.remove('tick-animation');
    }, 500);
  }

  async more(ev: any) {
    const popover = await this.popoverController.create({
      component: ChatmoreComponent,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: { userId: this.userId },
      translucent: true
    });
    return await popover.present();
  }

  sendMessage() {
    if (this.isBlock) {
      this.actionUnblock()
    } else {
      this.sendNewMessage(this.message).then(() => {
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
        this.message = '';
      })
    }
  }

  async sendPhoto() {
    const alert = await this.actionSheet.create({
      header: "Send Photo  Message",
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            //Upload the image and return pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.CAMERA).then((url) => {
              this.sendNewPhoto(url);
            })
          },
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            // Upload the image and retunr pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              //process photo massge on the database
              this.sendNewPhoto(url);
            })
          },
        },
        {
          text: 'Cancel',
          icon: 'help-circle',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    })
    alert.present();
  }

  async optionDelete(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from ' + this.nikeName,
      buttons: [
        {
          text: 'delete from me',
          handler: () => {
            this.deleteForMe(key)
          }
        },
        {
          text: 'delete from everyone',
          handler: () => {
            this.deleteForEveryOne(key)
          }
        },
        {
          text: 'cancel',
          handler: () => {
          }
        },

      ]

    })
    await alert.present();
  }
  async optionDeleteForMe(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from ' + this.nikeName,
      buttons: [
        {
          text: 'delete from me',
          handler: () => {
            this.deleteForMe(key)
          }
        },
        {
          text: 'cancel',
          handler: () => {
          }
        },

      ]

    })
    await alert.present();
  }

  //send message to user
  sendNewMessage(message) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'text',
          message: message,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          me: "me",
          message: message,
          type: 'text',
          read: 'unread',
          date: new Date().toString(),
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: message,
          me: "you",
          type: 'text',
          read: 'unread',
          date: new Date().toString(),
        }
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          })
          this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
            snap.update({
              key: keys
            })
            //clear the message
            message = "";
            // for the conversation 
            resolve(true);
            message = '';
            this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
              var res = snapshot.val();
              if (res != null) {
                let store = Object.keys(res)
                this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                  //send the conversation to the user base on the ID
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    // find the other user base on the user recieve
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                      var res = snapshot.val()
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }

                    }).catch((err) => {
                      reject(err);
                    })
                  })

                }).catch((err) => {
                  reject(err);
                })
              } else {
                this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                  this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                    var res = snapshot.val();
                    if (res != null) {
                      let store = Object.keys(res)
                      this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }).catch((err) => {
                        reject(err);
                      })
                    } else {
                      this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                        resolve(true);
                      })
                    }
                  }).catch((err) => {
                    reject(err);
                  })
                })
              }
            }).catch((err) => {
              reject(err);
            })
          })
        })
      })
      return promise;
    }
  }

  //send message to user
  sendNewPhoto(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'image',
          message: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          message: url,
          me: "me",
          type: 'image',
          date: new Date().toString(),
          read: 'unread',
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: url,
          me: "you",
          date: new Date().toString(),
          type: 'image',
          read: 'unread',
        }
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          }).then(() => {
            this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
              snap.update({
                key: keys
              })
              // for the conversation 
              resolve(true);
              //message = '';
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                var res = snapshot.val();
                if (res != null) {
                  let store = Object.keys(res)
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                    //send the conversation to the user base on the ID
                    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                      // find the other user base on the user recieve
                      this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                        var res = snapshot.val()
                        if (res != null) {
                          let store = Object.keys(res)
                          this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                            this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                              resolve(true);
                            })
                          }).catch((err) => {
                            reject(err);
                          })
                        } else {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }

                      }).catch((err) => {
                        reject(err);
                      })
                    })

                  }).catch((err) => {
                    reject(err);
                  })
                } else {
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                      var res = snapshot.val();
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }
                    }).catch((err) => {
                      reject(err);
                    })
                  })
                }
              }).catch((err) => {
                reject(err);
              })
            })
          })

        })
      })
      return promise;
    }
  }

  sendNewAudio(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'audio',
          message: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          message: url,
          type: 'audio',
          me: "me",
          date: new Date().toString(),
          read: 'unread',
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: url,
          me: "you",
          date: new Date().toString(),
          type: 'audio',
          read: 'unread',
        }
        this.afDB.database.ref('/messages').child(firebase.auth().currentUser.uid).child(this.userId).push(messages).then((snap) => {
          var keys = snap.key;
          snap.update({
            key: keys
          }).then(() => {
            this.afDB.database.ref('/messages/').child(this.userId).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
              snap.update({
                key: keys
              })
              // for the conversation 
              resolve(true);
              //message = '';
              this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                var res = snapshot.val();
                if (res != null) {
                  let store = Object.keys(res)
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove().then(() => {
                    //send the conversation to the user base on the ID
                    this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                      // find the other user base on the user recieve
                      this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
                        var res = snapshot.val()
                        if (res != null) {
                          let store = Object.keys(res)
                          this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                            this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                              resolve(true);
                            })
                          }).catch((err) => {
                            reject(err);
                          })
                        } else {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }

                      }).catch((err) => {
                        reject(err);
                      })
                    })

                  }).catch((err) => {
                    reject(err);
                  })
                } else {
                  this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).push(conversation).then(() => {
                    this.afDB.database.ref('conversations').child(this.userId).orderByChild('userId').equalTo(this.userId).once('value', snapshot => {
                      var res = snapshot.val();
                      if (res != null) {
                        let store = Object.keys(res)
                        this.afDB.database.ref('conversations').child(this.userId).child(store[0]).remove().then(() => {
                          this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                            resolve(true);
                          })
                        }).catch((err) => {
                          reject(err);
                        })
                      } else {
                        this.afDB.database.ref('conversations').child(this.userId).push(convasation).then(() => {
                          resolve(true);
                        })
                      }
                    }).catch((err) => {
                      reject(err);
                    })
                  })
                }
              }).catch((err) => {
                reject(err);
              })
            })
          })

        })
      })
      return promise;
    }
  }


  scrollToBottom() {
    this.IonContent.scrollToBottom(100)
  }

  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadPhotoMessage(sourceType) {
    return new Promise((resolve, reject) => {
      this.groupPhotoOption.sourceType = sourceType;
      this.camera.getPicture(this.groupPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        this.loading.showPro();
        const ref = this.afstorage.ref('/Messaging/' + firebase.auth().currentUser.uid + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((url) => {
              resolve(url);
              this.loading.hidePro();
            })
          })
        ).subscribe()
      })
    })
  }

  // get audio file recorded
  getRocordfile() {
    var promise = new promise((resolve, reject) => {

      resolve(true)
    })
    return promise;
  }

  // upload the recording voice to firebase
  uploadRec() {
    return new Promise((resolve, reject) => {
      const audioBlob = this.audioFile.getCurrentPosition()
      alert(audioBlob)
      // const fileName = this.file.applicationDirectory + '/audioRec.mp3'
      // let audioBlob = fileName;
      const metadata = {
        contentType: 'audio/mp3',
      };
      this.loading.showPro();
      const ref = this.afstorage.ref('/audio/' + firebase.auth().currentUser.uid + this.generateFilename())
      const task = ref.put(audioBlob, metadata)
      task.snapshotChanges().pipe(
        finalize(async () => {
          ref.getDownloadURL().subscribe((audioUrl) => {
            resolve(audioUrl);
            this.loading.hidePro();
          })
        })
      ).subscribe()
    })
  }

  record() {
    var promise = new promise((resolve, rejetc) => {
      this.audioFile.startRecord()
      resolve(true);
      this.statusRecord = "Recording..."
      this.recording = true;
    })
    return promise;

  }
  stopRec() {
    this.audioFile.stopRecord()
    this.statusRecord = "Stopped..."
    this.recording = false;
    this.uploadRec().then((audioUrl) => {
      this.sendNewAudio(audioUrl)
    })
  }

  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }
  // this handle for the conversation delete for only user
  deleteForMe(key) {
    this.loading.show();
    this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res)
      this.loading.hide();
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(store[0]).remove()
    })
  }

  // this handel for the deleting for everyone 
  deleteForEveryOne(key) {
    this.loading.show();
    this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res);
      this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).child(store[0]).remove();

      this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(key).once('value', snapKeys => {
        var ress = snapKeys.val();
        let store = Object.keys(ress)
        this.afDB.database.ref('messages').child(this.userId).child(firebase.auth().currentUser.uid).child(store[0]).remove();
        this.loading.hide()
      })
    }).then(() => {

    })
  }

  viewInfo() {
    this.router.navigate(['/user-info', { 'userId': this.userId }])
  }
  enlargeImage(image) {
    this.router.navigate(['enlarge-image/', { 'image': image }])

  }
  async option() {
    if (this.isBlock == true) {
      const actionShet = await this.actionSheet.create({
        header: 'Select option',
        buttons: [
          {
            text: 'UnBlock ' + this.nikeName,
            handler: () => {
              this.unblockUser()
            }
          },
          {
            text: 'Report ' + this.nikeName,
            handler: () => {
              this.router.navigate(['report/', { 'userId': this.userId }])
            }
          },
          {
            text: 'Cancel',
            handler: () => { }
          }
        ]
      })
      actionShet.present();
    } else if (!this.isBlock) {
      const actionShet = await this.actionSheet.create({
        header: 'Select option',
        buttons: [
          {
            text: 'Block ' + this.nikeName,
            handler: () => {
              this.blockUser();
            }
          },
          {
            text: 'Report ' + this.nikeName,
            handler: () => {
              this.router.navigate(['report/', { 'userId': this.userId }])
            }
          },
          {
            text: 'Cancel',
            handler: () => { }
          }
        ]
      })
      actionShet.present();
    }


  }
  blockUser() {
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }
  unblockUser() {
    this.loading.show()
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      this.loading.hide();
    })
  }

  sendMessageOption() {
    if (!this.isBlock) {
      this.toastBlock();
      this.message = '';
    } else {
      this.actionUnblock();
    }

  }

  // his handle if the has been block
  async toastBlock() {
    const block = await this.toast.create({
      header: 'Blocked',
      message: "Your can't send a message.",
      duration: 1000,
      position: "middle"
    })
    block.present();
  }

  // when empty the input, will handle the option decide?
  async messageOption() {
    const block = await this.toast.create({
      header: 'Empty',
      message: "Type your message .",
      duration: 1000,
      position: "middle"
    })
    block.present();
  }

  async actionUnblock() {
    const actionShet = await this.actionSheet.create({
      header: 'Unblock ' + this.nikeName + ' to send a message.',
      buttons: [
        {
          text: 'UnBlock',
          handler: () => {
            this.unblockUser()
          }
        },
        {
          text: 'Cancel',
          handler: () => {

          }
        }
      ]
    })
    actionShet.present();
  }

  async sendPhotoOption() {
    const actionShet = await this.actionSheet.create({
      header: 'Unblock ' + this.nikeName + ' to send a photo.',
      buttons: [
        {
          text: 'UnBlock',
          handler: () => {
            this.unblockUser()
          }
        },
        {
          text: 'Cancel',
          handler: () => {

          }
        }
      ]
    })
    actionShet.present();

  }
}
