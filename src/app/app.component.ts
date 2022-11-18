import {Component, OnInit} from '@angular/core';
import {WeatherApiService} from "./services/weather-api.service";
import {LocalStorageService, Widget} from "./services/local-storage.service";
import {NotificationModes, NotificationService} from "./services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private weatherService: WeatherApiService,
              private localStorageService: LocalStorageService,
              private notificationService: NotificationService
  ) {}
  inputValue = '';
  widgets: Widget[] = [];

  createWidget () {
    if(this.widgets.length < 5) {
      this.weatherService.getWeatherByName(this.inputValue.trim().toLowerCase()).subscribe(
        (weather: any) => {
          if(!this.widgets.find((widget) => widget.cityId === weather.id)) {
            this.localStorageService.addWidget(weather);
          } else {
            this.notificationService.showNotification('This city already exists', NotificationModes.Error);
          }
        }
      )
    } else {
      this.notificationService.showNotification('Limit reached', NotificationModes.Error);
    }
    this.inputValue = '';
  }

  ngOnInit(): void {
    this.localStorageService.updateWidgets();
    this.localStorageService.widgets.subscribe( widgets => {
      this.widgets = widgets;
    })
  }
}
