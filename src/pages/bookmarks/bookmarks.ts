import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {
  //bookmarks: string[];
  bookmarks: Comic[];
  notifications: any[] = [];
  days: any[];
  toggled: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
  private localNotifications: LocalNotifications,
  private platform: Platform, public alertCtrl: AlertController) {
    this.bookmarks = [];

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
        alert(state);
        alert(notif.comic)
      });
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarksPage');

    this.storage.get('bookmarks').then((data)=>{
      if (data != null)
        {
          this.bookmarks = data;
          //console.log(this.bookmarks);
/*
          for (var series of this.bookmarks)
            {
              console.log("Series",series)
            }
*/
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

  toggle(event, item)
  {
    console.log("event",event);
    //el.nativeElement.querySelector('#'+event.srcElement)
    this.toggled = !this.toggled;
  }
  addNotification(event, item) {
    
    console.log('NOTIFIED');
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
              at: firstNotificationTime,
              every: 'week',
              data: {comic: item}
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
                at: firstNotificationTime,
                every: 'minute',
                data: {title: item.series}
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

   /* 
    this.platform.ready().then(()=>{
      this.localNotifications.schedule({
        id:1,
        //sound: this.platform.is('Android') ? 'file://assets/sounds/arpeggio.mp3': 'file://assets/sounds/arpeggio.m4r',
        text: "NOTIFIED SUCKA",
        data: "test"
      });
    });*/
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
  series?: string
}
