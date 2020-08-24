import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-enlarge-image',
  templateUrl: './enlarge-image.page.html',
  styleUrls: ['./enlarge-image.page.scss'],
})
export class EnlargeImagePage implements OnInit {

  image

  constructor(
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
  ) { 
    
    this.image = this.actRouter.snapshot.paramMap.get('image');
  }

  ngOnInit() {
  }

  close() {
    this.navCtrl.pop();
  }

}
