import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {ComicProvider} from '../../providers/comic/comic';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
/**
 * Generated class for the AllPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all',
  templateUrl: 'all.html',
})
export class AllPage {
  items : Comic[];
  //cover_small_url='http://d2lzb5v10mb0lj.cloudfront.net/covers_tfaw/200/'; //doesn't use diamond id for indie titles
  cover_url ="http://cdn.nexternal.com/dreamland/images/"; //can find most covers using diamond id

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
  private comicProvider: ComicProvider) {
    this.items = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllPage');

    //Create the loading popup
    let loadingPopup = this.loadingCtrl.create({
      content: 'Loading Comics...'
    });

    //Show the pop up
    loadingPopup.present();

    this.comicProvider.getAllComics().subscribe((data)=>{
      this.items = data.comics;
      loadingPopup.dismiss();
    },
    err=>console.log(err),
    ()=>{
      for (var comic of this.items) {
        //let d_id_slice = comic.diamond_id.slice(0,2);
        //console.log(d_id_slice);
        //comic.cover_url = this.cover_small_url+d_id_slice+"/"+comic.diamond_id+".jpg";
        comic.cover_url = this.cover_url+comic.diamond_id+".jpg";
        //console.log('Cover URL',comic.cover_url);
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
