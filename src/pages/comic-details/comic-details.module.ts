import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComicDetailsPage } from './comic-details';

@NgModule({
  declarations: [
    ComicDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComicDetailsPage),
  ],
})
export class ComicDetailsPageModule {}
