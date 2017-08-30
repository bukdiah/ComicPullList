import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComicDetailsPage');
        // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = this.navParams.get('item');
    console.log('selectedItem',this.selectedItem)
  }

}
