import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.services';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [
  ]
})
export class ByCountryPageComponent implements OnInit {
  public countries: Country [] = [];
  public inicialValue: string = '';

  constructor(public countriesService: CountriesService){

  }
  ngOnInit(): void {
      this.countries = this.countriesService.cacheStore.byCountries.countries;
      this.inicialValue = this.countriesService.cacheStore.byCountries.term;
  }

  searchByCountry(term: string):void {
    this.countriesService.searchCountry(term)
    .subscribe(countries => {
      this.countries = countries;
    });
  }


}
