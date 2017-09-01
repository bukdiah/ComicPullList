import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the BookmarksPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {
  bookmarks: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
  private localNotifications: LocalNotifications,
  private platform: Platform) {
    this.bookmarks = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');

    this.storage.get('bookmarks').then((data)=>{
      if (data != null)
        {
          this.bookmarks = data;
          //console.log(this.bookmarks);

          for (var series of this.bookmarks)
            {
              console.log("Series",series)
            }
        }
    });
  }

  remove(item){
    console.log("Removing",item);

    //Remove object from items array and then push that array to storage
    for (var i=0; i< this.bookmarks.length; i++)
      {
        var series = this.bookmarks[i];

        if(item === series)
          {
            console.log('WHOOP THERE IT IS');
            this.bookmarks.splice(i,1);
          }
      }

      this.storage.set('bookmarks', this.bookmarks);
  }

  notify(item) {
    
    this.platform.ready().then(()=>{
      this.localNotifications.schedule({
        id:1,
        sound: this.platform.is('Android') ? 'file://assets/sounds/arpeggio.mp3': 'file://assets/sounds/arpeggio.m4r',
        text: "NOTIFIED SUCKA",
        data: "test"
      });
    });
  }

}
