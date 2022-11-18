import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin} from "rxjs";
import {WeatherApiService} from "./weather-api.service";
import {NotificationModes, NotificationService} from "./notification.service";

export interface Widget {
  cityId: number,
  cityName: string,
  weather: string,
  minTemp: number,
  maxTemp: number,
  humidity: number,
  windSpeed: number,
  windDirection: number
}

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  widgets: BehaviorSubject<Widget[]> = new BehaviorSubject<Widget[]>([]);

  constructor(private weatherService: WeatherApiService, private notificationService: NotificationService) {}

  addWidget(weatherInfo: any) {
    const widget = this.createWidgetObj(weatherInfo);
    localStorage.setItem('widgets', JSON.stringify([...this.widgets.value, widget]));
    this.widgets.next([...this.widgets.value, widget]);
    this.notificationService.showNotification('Widget added', NotificationModes.Success);
  }

  updateWidgets() {
    const widgets = JSON.parse(localStorage.getItem('widgets') as string);
    if(localStorage.getItem('widgets') && widgets.length) {
      forkJoin(widgets.map((widget: Widget) => this.weatherService.getWeatherByName(widget.cityName)))
        .subscribe(
        (res: any) => {
          const widgets: Widget[] = [];
          res.forEach( (widget: any) => {
            widgets.push(this.createWidgetObj(widget));
          })
          localStorage.setItem('widgets', JSON.stringify(widgets));
          this.widgets.next(widgets);
        }
      )
    }
  }

  createWidgetObj(weatherInfo: any) {
    return {
      cityId: weatherInfo.id,
      cityName: weatherInfo.name,
      weather: weatherInfo.weather[0].description,
      minTemp: +(weatherInfo.main.temp_min - 273).toFixed(1),
      maxTemp: +(weatherInfo.main.temp_max - 273).toFixed(1),
      humidity: weatherInfo.main.humidity,
      windSpeed: weatherInfo.wind.speed,
      windDirection: weatherInfo.wind.deg
    }
  }

  deleteWidget(id: number) {
    const widgets = this.widgets.value.filter( (widget: Widget) => widget.cityId !==id);
    localStorage.setItem('widgets', JSON.stringify(widgets));
    this.widgets.next(widgets);
    this.notificationService.showNotification('Widget deleted', NotificationModes.Success);
  }

  updateWidget(id: number) {
    let index = this.widgets.value.findIndex(el => el.cityId === id);
    this.weatherService.getWeatherByName(this.widgets.value[index].cityName).subscribe(
      weatherInfo => {
        const widget = this.createWidgetObj(weatherInfo);
        const widgets = this.widgets.value;
        widgets.splice(index,1, widget);
        localStorage.setItem('widgets', JSON.stringify(widgets));
        this.widgets.next(widgets);
        this.notificationService.showNotification('Widget updated', NotificationModes.Success);
      }
    )
  }

}
