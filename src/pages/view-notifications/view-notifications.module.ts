import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewNotificationsPage } from './view-notifications';

@NgModule({
  declarations: [
    ViewNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewNotificationsPage),
  ],
})
export class ViewNotificationsPageModule {}
