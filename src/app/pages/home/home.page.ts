import { SettingComponent } from './../../component/setting/setting.component';
import { CameraPage } from './../camera/camera.page';
import { CallPage } from './../call/call.page';
import { StatusPage } from './../status/status.page';
import { ChatPage } from './../chat/chat.page';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import { SuperTabs } from '@ionic-super-tabs/angular';
import { IonNav, PopoverController } from '@ionic/angular';
import { SuperTabChangeEventDetail } from '@ionic-super-tabs/core';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { ScrollHideConfig } from '../../directives/header-scroll.directive';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  @ViewChild('superTabs', { static: false }) st: SuperTabs;

  activeTabIndex: number;
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 60 };



  tabs = 'chat'

  camera: any = CameraPage
  chat: any = ChatPage;
  status: any = StatusPage;
  calls: any = CallPage;

  constructor(
    private popoverController: PopoverController
  ) {

  }

  ngOnInit() {
  }

  async showPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingComponent,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: { tabs: this.tabs },
      translucent: true
    });
    return await popover.present();
  }

  onTabChange(ev: CustomEvent<SuperTabChangeEventDetail>) {
    this.activeTabIndex = ev.detail.index;
  
    switch (this.activeTabIndex) {
      case 0:
        this.tabs = 'camera'
        break;
      case 1:
        this.tabs = 'chat'
        break;
      case 2:
        this.tabs = 'status'
        break;
      case 3:
        this.tabs = 'calls'
        break;
    }
  }


}
