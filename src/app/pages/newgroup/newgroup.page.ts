import { ImageService } from './../../services/image.service';
import { DataService } from './../../services/data.service';
import { ToastController, IonNav, ActionSheetController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingService } from 'src/app/services/loading.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.page.html',
  styleUrls: ['./newgroup.page.scss'],
})
export class NewgroupPage implements OnInit {

  public group: any;

  searchUser: any;
  accounts: any;
  account: any;
  currentUserId: any;
  public groupMembers = [];
  processe = false;
  groupName: any;
  public formGroup: FormGroup;



  groupPhotoOptionCamera: CameraOptions;
  groupPhotoOptionGallery: CameraOptions;


  constructor(
    private toastController: ToastController,
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private imageService: ImageService,
    private loading: LoadingService,
    public angularDb: AngularFireDatabase,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController
  ) {
    this.currentUserId = firebase.auth().currentUser.uid;

    this.groupPhotoOptionCamera = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      // allowEdit: true
    }
    this.groupPhotoOptionGallery = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      // allowEdit: true
    }   // for ali erroe side 
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]))

    });


  }

  ngOnInit() {
    // Initialize the imagbe fro ther group 
    this.group = {
      img: ''
    };
    //Initialized
    this.searchUser = "";
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;


      this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((account) => {
        this.groupMembers = [account]
        //add own userId as excludedIds.
        this.account = account;
        //   console.log("current User", account)
        //  if (this.excludedIds.indexOf(account.userId) == -1) {
        //    this.excludedIds.push(account.userId);
        //  }
      })
    })
  }

  async presentToast() {
    if (this.groupMembers.length <= 1) {
      const toast = await this.toastController.create({
        message: 'At least 1 user must be selected',
        position: "middle",
        duration: 2000
      });
      toast.present();
    } else {
      this.processe = true;
    }
  }

  processed() {
    this.presentToast()
  }

  // Check if friend is already added to the group or not.
  inGroup(friend) {
    for (var i = 0; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].userId == friend.userId) {
        return true;
      }
    }
    return false;
  }

  //Add friend to member of groups
  addToGroup(friend) {
    this.groupMembers.push(friend)
  }
  // Remove friend from members of group.
  removeFromGroup(friend) {
    var index = -1;
    for (var i = 1; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].userId == friend.userId) {
        index = i;
      }
    }
    if (index > -1) {
      this.groupMembers.splice(index, 1);
    }
  }


  // set the image to group photo 
  setImageCamera() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.groupPhotoOptionCamera).then((url) => {
        this.group = "data:image/jpeg;base64," + url;
        resolve(true)
      })
    })
  }
  setImageGallery() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.groupPhotoOptionGallery).then((url) => {
        this.group = "data:image/jpeg;base64," + url;
        resolve(true)
      })
    })
  }


  // action sheet for setPhoto image
  async setGroupPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Profile Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.imageService.setGroupPhoto(this.group, this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.imageService.setGroupPhoto(this.group, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }]
    });
    await actionSheet.present();
  }
  async showToast(message: string) {
    const toastPresent = await this.toastController.create({
      message: message,
      duration: 300,
      position: 'top'
    })
    toastPresent.present();
  }

  newGroup() {
    var promise = new Promise((resolve, reject) => {
      this.loading.show();
      var messages = []
      //add system message that group is created
      messages.push({
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'system',
        message: 'This group has been created.',
        icon: 'chatbubbles'
      });
      // Add members of the group
      var members = [];
      for (let i = 0; i < this.groupMembers.length; i++) {
        //let push the group member to member with only userId
        members.push(this.groupMembers[i].userId);
      }

      //Add group information and date
      this.group.dateCreated = new Date().toString(),
        this.group.messages = messages;
      this.group.members = members;
      if (this.group.img == '') {
        this.group.img = "assets/profile.png";
      }
      this.group.name = this.formGroup.value["name"];
      this.group.admin = [firebase.auth().currentUser.uid];

      // Lets add to firebase database
      this.angularDb.list('/groups/').push(this.group).then((success) => {
        var groupId = success.key;
        var conversation = {
          key: groupId,
          me: "me",
          // message: 'This group has been created.',
          type: 'group',
          // read: 'unread',
          date: new Date().toString(),
        }
        var convasation = {
          key: groupId,
          // message: 'This group has been created.',
          me: "you",
          type: 'group',
          // read: 'unread',
          date: new Date().toString(),
        }
        //update the key
        success.update({
          key: groupId
        });
        for (let i = 0; i < this.groupMembers.length; i++) {
          // this.angularDb.database.ref('conversations').child(this.groupMembers[0].userId).push(conversation).then(() => {
          this.angularDb.database.ref('conversations').child(this.groupMembers[i].userId).orderByChild('key').equalTo(groupId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let store = Object.keys(res)
              this.angularDb.database.ref('conversations').child(this.groupMembers[i].userId).child(store[0]).remove().then(() => {
                this.angularDb.database.ref('conversations').child(this.groupMembers[i].userId).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.angularDb.database.ref('conversations').child(this.groupMembers[i].userId).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).catch((err) => {
            reject(err);
          }).then(() => {
            this.showToast('Your groups has been created')
            this.loading.hide();
            this.navCtrl.pop();
          })

        }
      })
    })
    return promise;


  }



}
