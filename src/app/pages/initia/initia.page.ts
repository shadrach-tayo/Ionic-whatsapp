import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-initia',
  templateUrl: './initia.page.html',
  styleUrls: ['./initia.page.scss'],
})
export class InitiaPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/verify')
    }, 5000);
  }

}
