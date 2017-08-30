import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ComicProvider} from '../../providers/comic/comic';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
/**
 * Generated class for the DcPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dc',
  templateUrl: 'dc.html',
})
export class DcPage {

  //items: Array<{publisher: string,title: string, price: string, desc: string, creators: string, release_date: string, diamond_id: string}>;
  items : Comic[];
  cover_small_url='http://d2lzb5v10mb0lj.cloudfront.net/covers_tfaw/200/';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private comicProvider: ComicProvider) {
    this.items = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DcPage');

    this.comicProvider.getDCComics().subscribe((data)=>{
      this.items = data.comics;
    },
    err=>console.log(err),
    ()=>{
      for (var comic of this.items) {
        let d_id_slice = comic.diamond_id.slice(0,2);
        //console.log(d_id_slice);
        comic.cover_url = this.cover_small_url+d_id_slice+"/"+comic.diamond_id+".jpg";
        console.log('Cover URL',comic.cover_url);
      }
    });
  }

    itemSelected(event, item) {
    console.log('item = ', item);
    this.navCtrl.push(ComicDetailsPage, {
      item: item
    });
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
