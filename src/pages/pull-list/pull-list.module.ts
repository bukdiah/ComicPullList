import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PullListPage } from './pull-list';

@NgModule({
  declarations: [
    PullListPage,
  ],
  imports: [
    IonicPageModule.forChild(PullListPage),
  ],
})
export class PullListPageModule {}
