import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../interfaces/country.interface';

import { catchError, tap, map, Observable, of } from "rxjs";
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';


@Injectable({providedIn: 'root'})
export class CountriesService  {

  private APIURL : string = 'https://restcountries.com/v3.1'

  public cacheStore: CacheStore = {
    byCapital: { term: '' , countries: [] },
    byCountries: { term: '' , countries: []},
    byRegion: { countries: []}
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(){
    if(!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest (url : string): Observable <Country[]>{
    return this.http.get<Country[]>(url)
    .pipe(

      catchError( error => {
        console.log(error);
        return of([])
      }),

    );
  }


  searchCapital(query: string): Observable<Country[]>{
    const url = `${this.APIURL}/capital/${query}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCapital = {term: query, countries: countries }),
      tap( ()=>this.saveToLocalStorage() ),
    );
  }

  searchCountry( query : string): Observable<Country[]>{
    const url = `${this.APIURL}/name/${query}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCountries = {term: query, countries: countries }),
      tap( ()=>this.saveToLocalStorage() ),
    );
  }

  searchRegion( query : Region): Observable<Country[]>{
    const url = `${this.APIURL}/region/${query}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byRegion = {region: query, countries: countries }),
      tap( ()=>this.saveToLocalStorage() ),
    );

  }

  searchCountryByAphaCode( code : string): Observable<Country | null>{
    const url = `${this.APIURL}/alpha/${code}`;
    return this.http.get<Country[]>(url)
    .pipe(
      map( countries => countries.length > 0 ? countries[0]: null),
      catchError ( () => of(null) )
    );
  }
}
