import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '../../../services/weather.service';
import { WeatherData } from '../../../types/type';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, CommonModule],  
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent { 
  errorMessage: string = '';
  city: string = '';
  weatherData!: WeatherData;  
  private weatherService = inject(WeatherService);

  constructor() { }

  searchCityWeather() {
    this.getWeatherData(this.city);
  }

  getWeatherData(city: string): void {
    this.errorMessage = "";
    const data = this.weatherService.getCachedWeather(city);
    if (data) {
      this.weatherData = data as WeatherData;
      this.city = "";
    } 
    else {
      this.weatherService.getWeather(city).subscribe({
        next: (data) => {
          if (data) {
            this.weatherData = data;
            this.weatherService.setCachedWeather(city, this.weatherData);  
            this.city = "";
          } else {
            this.errorMessage = "City not found.";
          }
        },
        error: (error) => {
          console.error('Error fetching weather data', error);
        }
      });
    }
  }   
}