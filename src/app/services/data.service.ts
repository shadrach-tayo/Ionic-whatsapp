import { Injectable } from '@angular/core';
import { AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  list: AngularFireList<any>;
  user: AngularFireObject<any>;

  constructor(
    public angularDb: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { }

  // get the current user, load all data from the Database
  getCurrentUser(user) {
    return this.user = this.angularDb.object('accounts/' + user);
  }
  chat(userId) {
    return this.list = this.angularDb.list('/conversations/' + userId)
  }
  // let invoke data from the firebase;
  groups(userId) {
    return this.user = this.angularDb.object('/groups/' + userId)
  }
  //Get user by userId
  getUser(userId) {
    return this.user = this.angularDb.object('accounts/' + userId)
  }
  userBock(userId) {
    return this.list = this.angularDb.list("/accounts/" + userId + "/userblocks/")
  }
  readSender(currerntUser) {
    return this.user = this.angularDb.object("/messages/" + firebase.auth().currentUser.uid + '/' + currerntUser)
  }
  userBocks(userId) {
    return this.list = this.angularDb.list("/accounts/" + userId + "/blocks/")
  }
  conversation(userId) {
    return this.list = this.angularDb.list("/conversations/" + userId)
  }
  postuserBock(userId) {
    return this.user = this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid + "/blocks/")
  }
  postsenderBock(userId) {
    return this.user = this.angularDb.object("/accounts/" + userId + "/blocks/")
  }
  userblocksBy(userId) {
    return this.user = this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid + "/userblocks/")
  }
  //get all users
  getUsers() {
    return this.list = this.angularDb.list('accounts', ref =>
      ref.orderByChild('username'));
  }

}
