import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowStatusPageRoutingModule } from './show-status-routing.module';

import { ShowStatusPage } from './show-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowStatusPageRoutingModule
  ],
  declarations: [ShowStatusPage]
})
export class ShowStatusPageModule {}
