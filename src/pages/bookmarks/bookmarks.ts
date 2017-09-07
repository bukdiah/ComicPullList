import { Component, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {ComicProvider} from '../../providers/comic/comic';
import {ComicDetailsPage} from '../../pages/comic-details/comic-details';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {
  bookmarks: Comic[];
  notifications: any[] = [];
  days: any[];
  newIssues: Comic[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
  private localNotifications: LocalNotifications,
  private platform: Platform, public alertCtrl: AlertController, 
  private comicProvider: ComicProvider, private elementRef: ElementRef) {
    this.bookmarks = [];
    this.newIssues = [];

    this.days = [
      {title: 'Monday', dayCode: 1, checked: false},
      {title: 'Tuesday', dayCode: 2, checked: false},
      {title: 'Wednesday', dayCode: 3, checked: false},
      {title: 'Thursday', dayCode: 4, checked: false},
      {title: 'Friday', dayCode: 5, checked: false},
      {title: 'Saturday', dayCode: 6, checked: false},
      {title: 'Sunday', dayCode: 0, checked: false}
    ];

    this.platform.ready().then(()=>{
      this.localNotifications.on("trigger", (notif,state)=>{

        console.log('notif.data',notif.data);
        let comic = JSON.parse(notif.data);
        console.log('comic',comic);
        console.log('comic.series',comic.series);

        let series = comic.series;

        let seriesID = comic.seriesID;

        console.log('seriesID trim', seriesID.trim());

        //Example of creators field: "(W) Gabby Rivera, Kelly Thompson (A) Ramon Villalobos (CA) Jen Bartel"
        let creators = comic.creators;

        let release_date = comic.release_date;
        console.log('release_date',release_date);

        //let start = creators.indexOf(')'); //Find the first ) symbol
        let creators_array = creators.split(" ");
        console.log('creators_array', creators_array);

        this.comicProvider.getSeries(series,creators_array[2]).subscribe((data)=>{
          let comic = data.comics[0];
          console.log(comic);
          let selector = "#"+seriesID.trim()+"_alert";
          console.log('selector',selector);

          let nowDate = moment(new Date()).format("YYYY-MM-DD");

          console.log('nowDate',nowDate);

          //New Issues Found
          if(nowDate === comic.release_date) {
            this.newIssues.push(comic); //add new issue to array
            this.elementRef.nativeElement.querySelector(selector).disabled = false;
          } 
          else
          {
            console.log('No new issues found for '+series);
            this.elementRef.nativeElement.querySelector(selector).disabled = true;  
          }

        });
      });
    }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');

    this.storage.get('bookmarks').then((data)=>{
      if (data != null)
        {
          this.bookmarks = data;
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

      this.storage.set('bookmarks', this.bookmarks);
  }

  itemSelected(event, item) {
    console.log('item = ', item);

    if(this.newIssues.length > 0)
    {
      this.newIssues.forEach((arrayItem)=>{
        //if your bookmarked series matches a series in newIssues array
        if (item.series === arrayItem.series) {
          this.navCtrl.push(ComicDetailsPage, {item: arrayItem});
        }
      });
    }
  }

  addNotification(event, item) {
    
    console.log('NOTIFIED');
    console.log('item',item);
    
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); //Sunday = 0, Monday =1, etc.

    //We gotta notify the user every WEDNESDAY = 3 if their series gets a new issue
    
    for (let day of this.days)
    {
          //If the current Day is Wednesday
          if (currentDay === 3)
          {
            let firstNotificationTime = new Date();
            let dayDifference = 0;
            /*
            if(dayDifference < 0)
            {
              dayDifference = dayDifference + 7; //for cases where the day is in the following week
            }*/

            firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));            
            //Will be notified at 12PM
            firstNotificationTime.setHours(12);
            firstNotificationTime.setMinutes(0);

            console.log('firstNotificationTime',firstNotificationTime)
            let notification = {
              id: day.dayCode,
              title: 'Hey!',
              text: 'There are new issues out! :)',
              //at: firstNotificationTime,
              //every: 'week',
              data: item
            };

          this.notifications.push(notification);
          }
          else
          {
            if(currentDay === day.dayCode)
            {
              let firstNotificationTime = new Date();
              //let dayDifference = day.dayCode - currentDay; //Find difference in days since Wednesday
              let dayDifference = 3 - currentDay;
              console.log("dayDifference", dayDifference);

              if(dayDifference < 0)
              {
                dayDifference = dayDifference + 7; //for cases where the day is in the following week
              }  
              firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
              //Will be notified at 12PM
              firstNotificationTime.setHours(12);
              firstNotificationTime.setMinutes(0);
  
              console.log('firstNotificationTime',firstNotificationTime)
              let notification = {
                id: day.dayCode,
                title: 'Hey!',
                text: 'There are new issues out! :)',
                //at: firstNotificationTime,
                //every: 'week',
                //data: {"series": item.series,"seriesID": item.seriesID, "creators": item.creators, "release_date": item.release_date}
                data: item
              };
  
            this.notifications.push(notification);
            }
          }
    }

    console.log("Notifications to be scheduled: ", this.notifications);

     
    if(this.platform.is('cordova')){
      
             // Cancel any existing notifications
             this.localNotifications.cancelAll().then(() => {
      
                 // Schedule the new notifications
                 this.localNotifications.schedule(this.notifications);
      
                 this.notifications = [];
      
                 let alert = this.alertCtrl.create({
                     title: 'Notifications set',
                     buttons: ['OK']
                 });
      
                 alert.present();
      
             });   
    }
  }

  cancelNotifications(item){
    this.localNotifications.cancelAll();
    
       let alert = this.alertCtrl.create({
           title: 'Notifications cancelled',
           buttons: ['OK']
       });
       alert.present();
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
  seriesID?: string
}
