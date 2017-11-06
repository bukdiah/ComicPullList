import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google:any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  
  constructor(public geolocation: Geolocation, public navCtrl: NavController, public navParams: NavParams, public ngZone: NgZone) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');

    //this.showMap();

    //this.findComicStores();
    
    this.geolocation.getCurrentPosition().then((position) => {
      console.log("POSITION"+ position);

      let location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

      this.showMap(location);
      
      this.findComicStores(location);

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  showMap(location) {
    //Location
    //const Location = new google.maps.LatLng(39.364966,-74.439034);
  
    //Map options
    const options = {
      center: location,
      zoom: 10
    }
    
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  findComicStores(location){
    //const Location = new google.maps.LatLng(39.364966,-74.439034);
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: location,
      keyword: 'comic book shop',
      //radius: 50000,
      //type: ['book_store'],
      rankBy:google.maps.places.RankBy.DISTANCE
    }, (results, status)=>{
      console.log("CALL BACK SUCKA")
      console.log("status",status);
      console.log("results", results)
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log('Result #'+i+" "+JSON.stringify(results[i]));
  
          this.createMarker(results[i]);
        }
      }
      else {
        console.log('SHIT')
      }   
    });

    console.log('FInd comic stores ended')
  }

  createMarker(place){
    console.log('place',place)
    let service = new google.maps.places.PlacesService(this.map);
    
    service.getDetails({
      placeId: place.place_id
    },(place,status)=>{
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: this.map,
        position: placeLoc
      });
      
      let formatted_address = place.formatted_address;
      var tokens = formatted_address.split(",");
      let infowindow = new google.maps.InfoWindow();
      
      google.maps.event.addListener(marker, 'click', ()=>{
        this.ngZone.run(()=>{
          //infowindow.setContent(place.name);
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          tokens[0] + '<br>' +
          tokens[1] + ',' + tokens[2]+ '<br>' +
          place.formatted_phone_number + '</div>');
          infowindow.open(this.map, marker);    
        });
      }); 
    });
    /*
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });

    let infowindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(marker, 'click', ()=>{
      this.ngZone.run(()=>{
        infowindow.setContent(place.name);
        infowindow.open(this.map, marker);    
      });
    });*/
  }

  
  addMarker(){
    
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>You are here!</h4>";          

    this.addInfoWindow(marker, content);
    
  }
    
  addInfoWindow(marker, content){
    
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.ngZone.run(() => {
        infoWindow.open(this.map, marker);
      });
    });
  }

}
