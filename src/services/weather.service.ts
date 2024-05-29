import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { WeatherData } from '../types/type';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {  
  private localStorage: Storage | undefined;
  private localStorageKey = 'weatherData';
  private baseUrl: string = environment.apiurl;
  private http = inject(HttpClient);
  
  constructor(@Inject(DOCUMENT) private document: Document) { 
    this.localStorage = document.defaultView?.localStorage;
  }

  public getWeather(location: string): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?city=${location}`;
    return this.http.get<WeatherData>(url);
  }

  private getWeatherData(): WeatherData[] | null {
    const dataString = this.localStorage?.getItem(this.localStorageKey);
    if (dataString) {
      return JSON.parse(dataString);
    }
    return null;
  }

  private setWeatherData(weatherDataList: WeatherData[]): void {
    this.localStorage?.setItem(this.localStorageKey, JSON.stringify(weatherDataList));
  }

  public getCachedWeather(city: string): WeatherData | null {
    const weatherDataList = this.getWeatherData();
    if (weatherDataList) {
      const foundEntry = weatherDataList.find(data => data.city?.toLowerCase() === city.toLowerCase());
      if (foundEntry) {        
        return this.isSameDay(foundEntry.currentDate * 1000) ? foundEntry : null;
      }
    }
    return null;
  }

  public setCachedWeather(city: string, weatherData: WeatherData): void {
    const weatherDataList = this.getWeatherData() || [];
    const existingIndex = weatherDataList.findIndex(data => data.city?.toLowerCase() === city.toLowerCase());

    if (existingIndex !== -1) {      
      weatherDataList.splice(existingIndex, 1);
    }

    weatherDataList.push(weatherData);
    this.setWeatherData(weatherDataList);
  }

  private isSameDay(timestampInMilliseconds: number): boolean {
    const today = new Date();
    const storedDate = new Date(timestampInMilliseconds);
    
    return today.getDate() === storedDate.getDate() &&
           today.getMonth() === storedDate.getMonth() &&
           today.getFullYear() === storedDate.getFullYear();
  }


}
