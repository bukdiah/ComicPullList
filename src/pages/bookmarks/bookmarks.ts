import { Component, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController,ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {ComicProvider} from '../../providers/comic/comic';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
import {NotificationSettingsPage} from '../../pages/notification-settings/notification-settings';
import {ViewNotificationsPage} from '../../pages/view-notifications/view-notifications';

import * as moment from 'moment';
//import * as schedule from 'node-schedule';

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {

  bookmarks: Comic[];
  notifications: any[];
  newIssues: Comic[];
  chosenHours: number;
  chosenMinutes: number;
  cover_url ="http://cdn.nexternal.com/dreamland/images/"; //can find most covers using diamond id
  
  jobs: any[];

  constructor(public zone: NgZone,public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
  private localNotifications: LocalNotifications,
  private platform: Platform, public alertCtrl: AlertController, 
  private comicProvider: ComicProvider, public modalCtrl: ModalController) {
    this.bookmarks = [];
    this.newIssues = [];
    this.notifications = [];
    this.jobs = [];

    this.zone = new NgZone({enableLongStackTrace: false});

    this.platform.ready().then(()=>{

      this.localNotifications.on("trigger", (notif,state)=>{
        console.log("Notification triggered");
        console.log("notif.data = ",notif.data)

        let item = JSON.parse(notif.data);

        let series = item.series.trim();
        let creators = item.creators;
        let price = item.price;
        let seriesID = item.seriesID.trim();
        let creators_array = creators.split(" ");
        console.log('creators_array', creators_array);

        console.log('notification series value', series);

        this.comicProvider.getSeries(series,creators_array[2]).subscribe((data)=>{
          console.log('data getSeries',data);
          
          let results = data.comics;

          for (var arrayItem of results){

            if (arrayItem.title.includes(series)) {
              console.log("Truth 1")
            }

            if(arrayItem.creators === creators) {
              console.log("Truth 2")
            } else {
              console.log("arrayItem.creators = ",arrayItem.creators)
              console.log("creators = ", creators)
            }

            if (arrayItem.price === price) {
              console.log("Truth 3")
            }

            //arrayItem.creators and creators values may not always be the same for a comic
            //The creative team (writer and artist and inker etc) can change from issues
            //May be a good idea to remove it from the following if statement?
            
            if (arrayItem.title.includes(series) && arrayItem.creators === creators && arrayItem.price === price){
              console.log('Found correct comic!', arrayItem);
              arrayItem.cover_url = this.cover_url+arrayItem.diamond_id+".jpg";

              let nowDate = moment(new Date()).format("YYYY-MM-DD");
    
              console.log('nowDate',nowDate);

              //New Issues Found
              if(nowDate === arrayItem.release_date) {
                this.newIssues.push(arrayItem); //add new issue to array
                console.log('newIssues Array Notify',this.newIssues);

                for (let newIssue of this.newIssues) {
                  for (let book of this.bookmarks){
                    //If your bookmarked book matches an issue in newIssues
                    if(newIssue.title.includes(book.series) && newIssue.creators === book.creators && newIssue.price === book.price) {
                      this.zone.run(()=>{
                        book.disabled = false;
                      });
                      this.storage.set('bookmarks',this.bookmarks)
                    }
                  }
                }
              }
              else{
                console.log('No new issues found');
              }
              break;
            }         
          }

        },
        (e)=>{console.log('onError: %s', e)},
        ()=>{
          console.log('On Complete');
        });
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');

    this.storage.get('bookmarks').then((data)=>{
      if (data != null){
        this.bookmarks = data;
        console.log('BOOKMARKS',this.bookmarks);
      }
    });

    this.storage.get('notifications').then((data)=>{
      if (data != null) {
        this.notifications = data;
      }
    });
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter() BookmarksPage');
    this.storage.get('bookmarks').then((data)=>{
      if (data != null){
        this.bookmarks = data;
        console.log('BOOKMARKS',this.bookmarks);
      }
    });

    this.storage.get('notifications').then((data)=>{
      if (data != null) {
        this.notifications = data;
      }
    });
  }

  remove(item){
    console.log("Removing",item);

    //Remove object from items array and then push that array to storage
    for (var i=0; i< this.bookmarks.length; i++)
      {
        var comic = this.bookmarks[i];

        if(item === comic)
          {
            console.log('WHOOP THERE IT IS');
            item.bookmarked = false;
            this.bookmarks.splice(i,1);
          }
      }
    
      for (var j = 0; j<this.notifications.length; j++){
        let arrayItem = this.notifications[j];
        //let comic = JSON.parse(arrayItem.data);
        let comic = arrayItem;

        console.log('looping thru notifications in remove()',comic);
        
        if(comic.text.includes(item.series))
        {
          console.log("MATCH FOOL! cancelling notification # "+arrayItem.id);
          this.localNotifications.cancel(arrayItem.id);
          this.notifications.splice(j,1);
        }
      }

      for (var k=0; k<this.jobs.length; k++){
        let job = this.jobs[k];
        console.log('job.ID = ',job.ID)
    
        if(job.series === item.series){
          job.cancel();
          this.jobs.splice(k,1);
        }
      }

      //this.cancelNotifications(item);
      console.log("Notifications remaining: ", this.notifications);

      this.storage.set('notifications',this.notifications); //saving notifications to local storage

      this.storage.set('bookmarks', this.bookmarks);

      let alert = this.alertCtrl.create({
        title: 'Deleted '+item.series+' from bookmarks!',
        buttons: ['OK']
      });
      alert.present();
  }

  itemSelected(event, item) {
    console.log('item = ', item);
    console.log('newIssues',this.newIssues);
    
    for (let newIssue of this.newIssues){
      for (let book of this.bookmarks) {
        //If your bookmarked book matches an issue in newIssues
        if(newIssue.title.includes(book.series) && newIssue.creators === book.creators && newIssue.price === book.price) {
          book.disabled = true;
          this.storage.set('bookmarks',this.bookmarks);
          this.navCtrl.push(ComicDetailsPage,{item: newIssue});
        }     
      }
    }
    /*
    this.newIssues.forEach((arrayItem)=>{
      //if your bookmarked series matches a series in newIssues array
      if (arrayItem.title.includes(item.series) && arrayItem.creators === item.creators && arrayItem.price === item.price) {
        this.navCtrl.push(ComicDetailsPage, {item: item});
      }
    });*/
  }

  add(event,item){
    console.log('add() called');
    console.log('item = ',item);
    //Create modal to retrieve user inputed time!
    let ID = Math.floor(Math.random()*101);

    let modal = this.modalCtrl.create(NotificationSettingsPage,item);

    modal.present();

    modal.onDidDismiss((data)=>{
      console.log('Time Data',data);

      if (data != null) {
        let firstNotificationTime = new Date();
        let currentDay = firstNotificationTime.getDay(); //Sunday = 0, Monday =1, etc.
  
        //let ID;
        this.chosenHours = data.chosenHours;
        this.chosenMinutes = data.chosenMinutes;
        
        //WEDNESDAY = 3
        let dayDifference = 0;

        if(currentDay != 3) {
          dayDifference = 3 - currentDay;
        }
  
        if (dayDifference < 0 ){
          dayDifference = dayDifference + 7; //for cases where the day is in the following week
        }
  
        firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);
  
        let notification = {
          id: Math.floor(Math.random()*101),
          title: 'Hey!',
          text: 'New Issues for ' + item.series + '! :)',
          at: firstNotificationTime,
          every: 'week',
          data: item
        };
  
        this.notifications.push(notification);
        console.log("Notifications to be scheduled: ", this.notifications);
  
        this.storage.set('notifications',this.notifications);
  
        //Schedule the new notification
        this.localNotifications.schedule(notification);

        let alert = this.alertCtrl.create({
          title: 'Notification set for '+item.series,
          buttons: ['OK']
        });
        alert.present();
      }
      else {
        return;
      }
    });

  }

cancelNotification(item){
  for (var i = 0; i<this.notifications.length; i++){
    let arrayItem = this.notifications[i];
    let comic = arrayItem;
    console.log('looping thru notifications in cancelNotifications()',comic);
    
    if(comic.text.includes(item.series))
    {
      console.log("MATCH FOOL! cancelling notification # "+arrayItem.id);
      this.localNotifications.cancel(arrayItem.id);
      this.notifications.splice(i,1);
    }    
  }

  for (var k=0; k<this.jobs.length; k++){
    let job = this.jobs[k];
    console.log('job.ID = ',job.ID)

    if(job.series === item.series){
      job.cancel();
      this.jobs.splice(k,1);
    }
  }

  console.log("Notifications remaining: ", this.notifications);
  console.log('Jobs remaining in array: ',this.jobs);

  this.storage.set('notifications',this.notifications);

  let alert = this.alertCtrl.create({
      title: 'Notification cancelled for '+item.series,
      buttons: ['OK']
    });
  alert.present();
  }

  cancelAll()
  {
    console.log("Cancelling jobs")

    this.jobs.forEach((job)=>{
      job.cancel();
    });

    this.jobs = [];

    console.log('Jobs', this.jobs);
    
    this.localNotifications.cancelAll();
    this.notifications = [];
    this.newIssues = [];

    console.log('cancelAll() newIssues Array value ',this.newIssues);

    this.storage.set('notifications',this.notifications);

    let alert = this.alertCtrl.create({
        title: 'Notifications cancelled',
        buttons: ['OK']
    });
 
    alert.present();   
  }

  viewNotifications(){
    this.navCtrl.push(ViewNotificationsPage);
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
  cover_url?: string,
  added?: boolean,
  bookmarked?: boolean,
  series?: string,
  seriesID?: string,
  disabled?:boolean
}
