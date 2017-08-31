import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import {DcPage} from '../pages/dc/dc';
import {ComicDetailsPage} from '../pages/comic-details/comic-details';
import {PullListPage} from '../pages/pull-list/pull-list';
import {AllPage} from '../pages/all/all';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ComicProvider } from '../providers/comic/comic';

import{HttpModule} from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    DcPage,
    ComicDetailsPage,
    PullListPage,
    AllPage
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
    AllPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ComicProvider
  ]
})
export class AppModule {}
