import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HelloIonicPage } from '../../pages/hello-ionic/hello-ionic';
import {PullListPage} from '../../pages/pull-list/pull-list';
import {BookmarksPage} from '../../pages/bookmarks/bookmarks';
import {MapPage} from '../../pages/map/map';



/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  //this tells the tabs component which pages should be each tab's root Page
  tab1Root: any = HelloIonicPage;
  tab2Root: any = PullListPage;
  tab3Root: any = BookmarksPage;
  tab4Root: any = MapPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
