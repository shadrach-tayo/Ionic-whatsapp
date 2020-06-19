import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit, AfterViewInit {

  tabs: any;

  constructor(
    // private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router
  ) {

  }
  ngAfterViewInit(): void {
    this.tabs = this.navParams.get("tabs")
    // console.log(this.tabs)
  }

  ngOnInit() {
    // Get the Data from the popover page
    // this.tabs = this.navParams.get("tabs")
    // console.log(this.tabs)
  }

  eventFromPopover() {
    this.popoverController.dismiss();
  }

  settings() {
    this.router.navigateByUrl('/settings')
    this.eventFromPopover();
  }
  newGroup(){
    this.router.navigateByUrl('/newgroup')
    this.eventFromPopover();
  }


}
