import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import {DcPage} from '../pages/dc/dc';
import {PullListPage} from '../pages/pull-list/pull-list';
import {MarvelPage} from '../pages/marvel/marvel';
import {ImagePage} from '../pages/image/image';
import {BookmarksPage} from '../pages/bookmarks/bookmarks';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AllPage} from '../pages/all/all';
import {MapPage} from '../pages/map/map';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HelloIonicPage;
  activePage : any;
  //rootPage = AllPage;
  pages: Array<{title: string, component: any, icon?: String}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: HelloIonicPage, icon: 'home' },
      {title: 'All', component: AllPage, icon: 'book'},
      {title: 'DC', component: DcPage, icon: 'appname-dc'},
      {title: 'Marvel', component: MarvelPage, icon: 'appname-marvel'},
      {title: 'Image', component: ImagePage, icon: 'appname-image'},
      {title: 'My Pull List', component: PullListPage, icon: 'list-box'},
      {title: 'My Bookmarks', component: BookmarksPage, icon: 'bookmarks'},
      {title: 'Locate Comic Shops', component: MapPage, icon: 'map'}
    ];

    this.activePage = this.pages[0];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page){
    return page === this.activePage;
  }
}
