import { Component, ElementRef, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController,ModalController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {ComicProvider} from '../../providers/comic/comic';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
import {NotificationSettingsPage} from '../../pages/notification-settings/notification-settings';
import {ViewNotificationsPage} from '../../pages/view-notifications/view-notifications';

import * as moment from 'moment';
import * as schedule from 'node-schedule';

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
  //toggleSeries: Comic;
  //toggleSeries: String = "x";
  jobs: any[];

  constructor(public zone: NgZone,public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
  private localNotifications: LocalNotifications,
  private platform: Platform, public alertCtrl: AlertController, 
  private comicProvider: ComicProvider, private elementRef: ElementRef, public modalCtrl: ModalController) {
    this.bookmarks = [];
    this.newIssues = [];
    this.notifications = [];
    this.jobs = [];
    //this.toggleSeries = null;
    //this.toggleSeries="x";

    this.zone = new NgZone({enableLongStackTrace: false});

    this.platform.ready().then(()=>{
      
      this.localNotifications.on("trigger", (notif, state)=>{
        console.log('Notification TRIGGERED');
        //console.log('notif.data',notif.data);

        let comic = JSON.parse(notif.data);

        this.newIssues.push(comic); //add new issue to array
        console.log('newIssues notify',this.newIssues);
        
        for (let newIssue of this.newIssues){
          for (let book of this.bookmarks){
            //If your bookmarked book matches an issue in newIssues
            if(newIssue.title.includes(book.series) && newIssue.creators === book.creators && newIssue.price === book.price){
              this.zone.run(()=>{
                book.disabled = false;
              });
            }
          }
        }

        //OLD - DID not work
        /*this.newIssues.forEach((arrayItem)=>{
          //if your bookmarked series matches a series in newIssues array
          if(arrayItem.title.includes(comic.series) && arrayItem.creators === comic.creators && arrayItem.price === comic.price) {
            this.zone.run(()=>{
              //this.toggleSeries = arrayItem;
              //this.toggleSeries = arrayItem.seriesID;
            })
            //this.toggleSeries = arrayItem;
            //console.log('toggleSeries variable = ',this.toggleSeries);
          }          
        });*/
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');
    //this.toggleSeries="x";
    
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
      console.log("Notifications remaining: ", this.notifications);

      this.storage.set('notifications',this.notifications); //saving notifications to local storage

      this.storage.set('bookmarks', this.bookmarks);
  }

  itemSelected(event, item) {
    console.log('item = ', item);
    console.log('newIssues',this.newIssues);

    this.newIssues.forEach((arrayItem)=>{
      //if your bookmarked series matches a series in newIssues array
      if (arrayItem.title.includes(item.series) && arrayItem.creators === item.creators && arrayItem.price === item.price) {
        this.navCtrl.push(ComicDetailsPage, {item: item});
      }
    });
  }

  add(event,item){
    console.log('add() called');
    console.log('item = ',item);

    //Create modal to retrieve user inputed time!
    
    let modal = this.modalCtrl.create(NotificationSettingsPage,item);

    modal.present();

    modal.onDidDismiss((data)=>{
      console.log('Time Data',data);

      this.chosenHours = data.chosenHours;
      this.chosenMinutes = data.chosenMinutes;

      //WEDNESDAY = 3
      let rule = new schedule.RecurrenceRule();
      rule.hour = this.chosenHours;
      rule.minute = this.chosenMinutes;
      rule.dayOfWeek = 2;

      let job = schedule.scheduleJob(rule, ()=>{
        let series = item.series.trim();
        let creators = item.creators;
        let price = item.price;
        let seriesID = item.seriesID.trim();
        let creators_array = creators.split(" ");
        console.log('creators_array', creators_array);

        this.comicProvider.getSeries(series,creators_array[2]).subscribe((data)=>{
          console.log('data getSeries',data);

          let results = data.comics;

          for (var arrayItem of results){
            if (arrayItem.title.includes(series) && arrayItem.creators === creators && arrayItem.price === price){
              console.log('Found correct comic!', arrayItem);

              //let selector = "#"+seriesID.trim()+"_alert";
              //console.log('selector',selector);
    
              let nowDate = moment(new Date()).format("YYYY-MM-DD");
    
              console.log('nowDate',nowDate);

              //New Issues Found
              //Used to be nowDate === comic.release_date
              if(nowDate === arrayItem.release_date) {
                arrayItem.seriesID = seriesID;
                arrayItem.series = series;

                let notification = {
                  id: Math.floor(Math.random()*101),
                  title: 'Hey!',
                  text: 'New issues for '+item.series+'! :)',
                  data: arrayItem
                };
          
                this.notifications.push(notification);
                //this.newIssues.push(arrayItem); //add new issue to array
                console.log("Notifications to be scheduled: ", this.notifications);
          
                this.storage.set('notifications',this.notifications);
          
                //Schedule the new notification
                this.localNotifications.schedule(notification);
              } 
              else
              {
                console.log('No new issues found for '+series); //Testing Only
                arrayItem.seriesID = seriesID;
                arrayItem.series = series;
                
                let notification = {
                  id: Math.floor(Math.random()*101),
                  title: 'Hey!',
                  text: 'New issues for '+item.series+'! :)',
                  data: arrayItem
                };
          
                this.notifications.push(notification);
                //this.newIssues.push(arrayItem); //add new issue to array
                console.log("Notifications to be scheduled: ", this.notifications);
          
                this.storage.set('notifications',this.notifications);
          
                //Schedule the new notification
                this.localNotifications.schedule(notification);
              }
              break;
            }            
          }
        },
        (e)=>{console.log('onError: %s', e)},
        ()=>{
          console.log('On Complete');
          console.log('job = ',job);
          this.jobs.push(job);
        });
      });
      //this.jobs.push(job);

      let alert = this.alertCtrl.create({
        title: 'Notification set for '+item.series,
        buttons: ['OK']
      });
      alert.present();
    });


  }

  addNotification(event, item) {
    
    console.log('NOTIFIED');
    console.log('item',item);

    //Create modal to retrieve user inputed time!
    let modal = this.modalCtrl.create(NotificationSettingsPage, item);

    modal.present();
    
    modal.onDidDismiss((data)=>{
      console.log(data);

      this.chosenHours = data.chosenHours;
      this.chosenMinutes = data.chosenMinutes;

      let currentDate = new Date();
      let currentDay = currentDate.getDay(); //Sunday = 0, Monday =1, etc.

      //We gotta notify the user every WEDNESDAY = 3 if their series gets a new issue
      
      let dayDifference = 0;
      
      if(currentDay != 3)
      {
        dayDifference = 3 - currentDay;
      }

      if (dayDifference < 0)
      {
        dayDifference = dayDifference + 7;
      }

      let firstNotificationTime = new Date();

      firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));            
      //Will be notified at this time
      firstNotificationTime.setHours(this.chosenHours);
      firstNotificationTime.setMinutes(this.chosenMinutes);

      console.log('firstNotificationTime',firstNotificationTime)
      let notification = {
        id: Math.floor(Math.random()*101),
        title: 'Hey!',
        text: 'New issues for '+item.series+'! :)',
        at: firstNotificationTime,
        every: 'week',
        data: item
      };

      this.notifications.push(notification);

      console.log("Notifications to be scheduled: ", this.notifications);

      this.storage.set('notifications',this.notifications);

      //Schedule the new notifications
      //this.localNotifications.schedule(this.notifications);
      this.localNotifications.schedule(notification);
      //this.notifications = [];

      let alert = this.alertCtrl.create({
        title: 'Notification set for '+item.series,
        buttons: ['OK']
      });
      alert.present();
    });
    
}

cancelNotifications(item){
  for (var i = 0; i<this.notifications.length; i++){
    let arrayItem = this.notifications[i];
    //let comic = JSON.parse(arrayItem.data);
    let comic = arrayItem;
    console.log('looping thru notifications in cancelNotifications()',comic);
    
    if(comic.text.includes(item.series))
    {
      console.log("MATCH FOOL! cancelling notification # "+arrayItem.id);
      this.localNotifications.cancel(arrayItem.id);
      this.notifications.splice(i,1);
    }    
  }
  //this.localNotifications.cancelAll();
  console.log("Notifications remaining: ", this.notifications);
  this.storage.set('notifications',this.notifications);

      let alert = this.alertCtrl.create({
          title: 'Notification cancelled for '+item.series,
          buttons: ['OK']
      });
      alert.present();
  }

  cancelAll()
  {
    //this.job.cancel();
    this.jobs.forEach((job)=>{
      job.cancel();
    });

    this.jobs = [];

    console.log('Jobs', this.jobs);
    
    this.localNotifications.cancelAll();
    this.notifications = [];
    this.newIssues = [];

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
