import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import {DcPage} from '../pages/dc/dc';
import {ComicDetailsPage} from '../pages/comic-details/comic-details';
import {PullListPage} from '../pages/pull-list/pull-list';
import {AllPage} from '../pages/all/all';
import {MarvelPage} from '../pages/marvel/marvel';
import {ImagePage} from '../pages/image/image';
import {BookmarksPage} from '../pages/bookmarks/bookmarks';
import {NotificationSettingsPage} from '../pages/notification-settings/notification-settings';
import {ViewNotificationsPage} from '../pages/view-notifications/view-notifications';
import {MapPage} from '../pages/map/map';
import {TabsPage} from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ComicProvider } from '../providers/comic/comic';

import{HttpModule} from '@angular/http';

import { LocalNotifications } from '@ionic-native/local-notifications';
import {Geolocation} from '@ionic-native/geolocation';

import { IonicStorageModule } from '@ionic/storage';

import {ScreenOrientation} from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    DcPage,
    ComicDetailsPage,
    PullListPage,
    AllPage,
    MarvelPage,
    ImagePage,
    BookmarksPage,
    NotificationSettingsPage,
    ViewNotificationsPage,
    MapPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    DcPage,
    ComicDetailsPage,
    PullListPage,
    AllPage,
    MarvelPage,
    ImagePage,
    BookmarksPage,
    NotificationSettingsPage,
    ViewNotificationsPage,
    MapPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ComicProvider,
    Geolocation,
    ScreenOrientation
  ]
})
export class AppModule {}
