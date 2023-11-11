import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private ngZone: NgZone) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.ngZone.run(() => {
      });
    });
  }
}
