import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarvelPage } from './marvel';

@NgModule({
  declarations: [
    MarvelPage,
  ],
  imports: [
    IonicPageModule.forChild(MarvelPage),
  ],
})
export class MarvelPageModule {}
