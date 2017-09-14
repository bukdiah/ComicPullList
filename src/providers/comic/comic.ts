import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ComicProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ComicProvider {
  base_url;
  current_week_url;
  dc_current_week_url;
  marvel_current_week_url;
  image_current_week_url;

  constructor(public http: Http) {
    console.log('Hello ComicProvider Provider');

    this.base_url = "http://api.shortboxed.com";
    this.current_week_url = this.base_url+"/comics/v1/new"; //All Comics
    this.dc_current_week_url = this.base_url+"/comics/v1/query?publisher=dc";
    this.marvel_current_week_url = this.base_url+"/comics/v1/query?publisher=marvel";
    this.image_current_week_url = this.base_url+"/comics/v1/query?publisher=image"
  }

  getAllComics() {
    return this.http.get(this.current_week_url)
    .map((res)=> res.json());
  }

  getDCComics() {
    return this.http.get(this.dc_current_week_url)
    .map(res=>res.json());
  }

  getMarvelComics() {
    return this.http.get(this.marvel_current_week_url)
    .map(res=>res.json());
  }

  getImageComics() {
    return this.http.get(this.image_current_week_url)
    .map(res=>res.json());
  }

  getSeries(title,creators)
  {
    let query_url = this.base_url+"/comics/v1/query?tile="+title+"&creators="+creators;
    console.log('query_url',query_url.trim());
    return this.http.get(query_url.trim())
    .map(res=>res.json());
  }
}
