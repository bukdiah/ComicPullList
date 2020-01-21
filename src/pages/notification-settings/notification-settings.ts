import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-notification-settings',
  templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {
  notifyTime: any;
  chosenHours: number;
  chosenMinutes: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    
    this.notifyTime = moment(new Date()).format();
    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationSettingsPage');
  }

  dismiss() {

    let data = {
      "notifyTime": this.notifyTime,
      "chosenHours": this.chosenHours,
      "chosenMinutes": this.chosenMinutes
    }

    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  timeChange(time) {
    console.log('timeChange called',time);
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

}
