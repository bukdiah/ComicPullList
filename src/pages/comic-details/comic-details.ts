import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the ComicDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comic-details',
  templateUrl: 'comic-details.html',
})
export class ComicDetailsPage {
  selectedItem: any;
  list: Comic[];
  added: boolean;
  isSeries: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private localNotifications: LocalNotifications, public alertController: AlertController, private platform: Platform) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    //this.list = [];
    console.log('indexof returned',this.selectedItem.title.indexOf('#') );
    if(this.selectedItem.title.indexOf('#')=== -1) //returns -1 if it cannot find # symbol. Means it is NOT an ongoing comic series, but rather a TPB or something
    {
        this.isSeries = false;
    }
    else
    {
        this.isSeries = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComicDetailsPage');

    this.storage.get('pull-list').then((data)=>{
      if (data != null)
        {
          this.list = data;

          for (var comic of this.list)
            {
              if(this.selectedItem.title === comic.title)
                {
                  console.log("TITLE SAVED IN PULL LIST ALREADY", comic.title);
                  this.selectedItem.added = true;
                  this.added = this.selectedItem.added;
                }
            }
        }
      else{
        this.list = [];
        //console.log('added =', this.added)
        this.added = false;
      }
    });
  }

  addToPullList(){
   // this.selectedItem.added = false;

   // this.added = this.selectedItem.added;
    this.added = true;
    this.list.push(this.selectedItem);
    
    //this.storage.set('pull-list', JSON.stringify(this.selectedItem));
    this.storage.set('pull-list', this.list);
  }

  notify(item) {
    console.log("CLICK")
    this.platform.ready().then(()=>{
      this.localNotifications.schedule({
        id:1,
        text: "NOTIFIED SUCKA",
        data: "test"
      });
    });
    /*
      this.localNotifications.schedule({
        id:1,
        text: "NOTIFIED SUCKA",
        data: "test"
      });

      let alert = this.alertController.create({
        title: 'Notification Set',
        buttons: ['OK']
      });

      alert.present();*/
  }

}

interface Comic {
  publisher: string,
  title: string, 
  price: string, 
  description: string, 
  creators: string, 
  release_date: string, 
  diamond_id: string,
  cover_url?: string,
  added?: boolean
}
