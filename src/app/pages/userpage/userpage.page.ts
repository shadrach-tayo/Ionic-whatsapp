import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { DataService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.page.html',
  styleUrls: ['./userpage.page.scss'],
})
export class UserpagePage implements OnInit {

  excludedIds: any;
  searchUser: any;
  accounts: any;
  account: any;
  currentUserId: any;

  constructor(
    public loading: LoadingService,
    public dataService: DataService,
    // private network: Network,
    private toast: ToastController,
    private router: Router,
  ) {
    this.currentUserId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    //Initialized
    this.searchUser = "";
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;

      this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((account) => {
        //add own userId as excludedIds.
        this.excludedIds = [];
        this.account = account;
        //   console.log("current User", account)
        if (this.excludedIds.indexOf(account.userId) == -1) {
          this.excludedIds.push(account.userId);
        }
      })
    })
  }

  chat(userId) {
    if (userId === this.currentUserId) {
      this.router.navigateByUrl("/profile")
    } else {
      this.router.navigate(['/do-chat', { 'userId': userId }])
    }
  }


}
