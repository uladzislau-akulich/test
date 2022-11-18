import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LocalStorageService, Widget} from "../../services/local-storage.service";

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {

  @Input('widget') widget!: Widget;
  constructor(private localStorageService: LocalStorageService) { }

  updateWidget() {
    this.localStorageService.updateWidget(this.widget.cityId);
  }

  deleteWidget() {
    this.localStorageService.deleteWidget(this.widget.cityId);
  }
}
