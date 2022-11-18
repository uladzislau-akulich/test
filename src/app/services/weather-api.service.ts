import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class WeatherApiService {
  constructor(private http: HttpClient) {}

  getWeatherByName(city: string) {
    return this.http.get(environment.API_URL,{params: {q: city}});
  }
}
