import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
/**
 * Generated class for the PullListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pull-list',
  templateUrl: 'pull-list.html',
})
export class PullListPage {
  items : Comic[];
  //cover_small_url='http://d2lzb5v10mb0lj.cloudfront.net/covers_tfaw/200/';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.items = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PullListPage');
    this.storage.get('pull-list').then((data)=>{
      if (data != null)
        {
          this.items = data;

          for (var comic of this.items)
            {
              console.log("Comic",comic)
            }
        }
    });
  }

  itemSelected(event, item) {
    console.log('item = ', item);
    this.navCtrl.push(ComicDetailsPage, {
      item: item
    });
  }

  remove(item){
    console.log("Removing",item);
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
  cover_url?: string
}
