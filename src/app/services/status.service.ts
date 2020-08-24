import { DataService } from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    public dataService : DataService,
    public afDB: AngularFireDatabase

  ) { }

  view(key) {
    return new Promise((resolve, reject) => {
      this.dataService.postView(key).valueChanges().pipe(take(1)).subscribe((view) => {
        var views = view;
        if (!views) {
          views = [firebase.auth().currentUser.uid];
        } else {
          views.push(firebase.auth().currentUser.uid);
        }

        this.dataService.postView(key).update(views).then((success) => {
          resolve(true)
        }).catch((error) => {
          reject(false)
        })
      })
    })
  }


  offlineStatus(){
    var promise = new Promise((resolve, reject) =>{
      var ref = this.afDB.database.ref('accounts').child( firebase.auth().currentUser.uid )
      ref.onDisconnect().update({
        status:new Date().toString()
      }).then(() =>{
        resolve(true);
      }).catch((err) =>{
        reject(err);
      })
    })
    return promise;
  }

  offlineStatusLog(){
    var promise = new Promise((resolve, reject) =>{
      this.afDB.database.ref('accounts').child( firebase.auth().currentUser.uid ).update({
       status: new Date().toString()
     }).then(() =>{
       resolve(true);
     }).catch((err) =>{
       reject(err);
     })
   })
   return promise;
  }

  onlineStatus(){
    var promise = new Promise((resolve, reject) =>{
       this.afDB.database.ref('accounts').child( firebase.auth().currentUser.uid ).update({
        status: 'Online'
      }).then(() =>{
        resolve(true);
      }).catch((err) =>{
        reject(err);
      })
    })
    return promise;
  }
}



