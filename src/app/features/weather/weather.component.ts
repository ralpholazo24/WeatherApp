import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WeatherService } from '../../../services/weather.service';
import { WeatherData } from '../../../types/type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [WeatherService],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent { 
  errorMessage: string = '';
  city: string = 'Copenhagen';
  weatherData!: WeatherData;
  
  constructor(private weatherService: WeatherService) {
    this.searchCityWeather();
  }

  searchCityWeather() {
    this.getWeatherData(this.city);
  }

  getWeatherData(city: string): void {
    const data = this.weatherService.getCachedWeather(city);
    if (data) {
      this.weatherData = data as WeatherData;
      this.city = "";
      this.errorMessage = "";
    } 
    else {
      this.weatherService.getWeather(city).subscribe(
        data => {
          this.weatherData = data;
          this.weatherService.setCachedWeather(city, this.weatherData);  
          this.city = "";
          this.errorMessage = "";
        },
        error => {
          console.error('Error fetching weather data', error);
          this.errorMessage = "City not found."
        }
      );
    }
  }   
}