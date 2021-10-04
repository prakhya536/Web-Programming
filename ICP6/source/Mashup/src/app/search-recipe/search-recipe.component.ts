import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  @ViewChild('recipe') recipes: ElementRef;
  @ViewChild('place') places: ElementRef;
  recipeValue: any;
  placeValue: any;
  venueList = [];
  recipeList = [];
  formattedaddress = [];
  currentLat: any;
  currentLong: any;
  geolocationPosition: any;

  constructor(private _http: HttpClient) {
  }

  ngOnInit() {

    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.geolocationPosition = position;
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
      });
  }

  getVenues() {                                /* For retrieving details of the item*/
    this.recipeValue = this.recipes.nativeElement.value;
    this.placeValue = this.places.nativeElement.value;
    if (this.recipeValue !== null) {             /* For retrieving food which matches with the search*/
      this._http.get('https://api.edamam.com/search?q=' + this.recipeValue +
        '&app_id=815f4432&app_key=\n' + '542f51f83d57b576611c4511b3889602').subscribe((recipes: any) => {
        this.recipeList = Object.keys(recipes.hits).map(function (rec) {
          const recipe = recipes.hits[rec].recipe;
          console.log(recipe.digest[0].schemaOrgTag);
          return {name: recipe.label, content: recipe.digest[0].schemaOrgTag, icon: recipe.image, add: recipe.address, url: recipe.url};
        });
      });
    }
    if (this.placeValue != null) {                   /* For retrieving location of the item*/
      if (this.placeValue !== '') {
        this._http.get('https://api.foursquare.com/v2/venues/search?client_id=110XPHGA4Z5Q2V2CV2WMWCO5WR0ABBD4UEMJWWX1CG5BMQEK' +
            // tslint:disable-next-line:max-line-length
            '&client_secret=GMBPX3JJK51NJKGZWJ1QQ4DBTXJWLY3UYKL4TAOQND3CPAPK&v=20200625&near=' + this.placeValue + '&query=' + this.recipeValue).subscribe((restaurants: any) => {
          this.venueList = Object.keys(restaurants.response.venues).map(function (input) {
            const restaurant = restaurants.response.venues[input];
            return {
              name: restaurant.name,
              currentLat: restaurant.location.labeledLatLngs[0].lng,
              currentLong: restaurant.location.labeledLatLngs[0].lat,
              formattedAddress: restaurant.location.formattedAddress
            };

          });
        }, error => {
        });
      }
    }
  }
}
