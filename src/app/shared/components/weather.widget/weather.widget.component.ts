import {
    Component, OnInit, ViewEncapsulation,
    Input, OnChanges, SimpleChange
} from '@angular/core';
import { WeatherWidgetService } from './weather.widget.service';
import { WeatherData, WeatherDailyForecast } from './weather.widget.model';

@Component({
    selector: 'weather-widget',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'weather.widget.view.html',
    styleUrls: ['./weather.widget.style.scss'],
    providers: [WeatherWidgetService]
})

export class WeatherWidgetComponent implements OnInit, OnChanges {
    @Input() location: string;
    @Input() time: Date;

    public currentWeather: WeatherData = new WeatherData();
    public weatherForecast: WeatherDailyForecast = new WeatherDailyForecast();

    /**
     * Creates an instance of WeatherWidgetComponent.
     * @param {WeatherWidgetService} weatherService
     *
     * @memberOf WeatherWidgetComponent
     */
    constructor(private weatherService: WeatherWidgetService) { }

    public ngOnInit(): void {
        this.getCurrentWeather();
        this.getForecastWeather();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['location'].currentValue !== changes['location'].previousValue) {
            // this.getCurrentWeather();
            // this.getForecastWeather();
        }
    }

    private getCurrentWeather(): void {
        this.weatherService.getCurrentWeather(this.location)
            .subscribe((data: WeatherData) => {
                this.currentWeather = data;
                // console.log(this.currentWeather);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    private getForecastWeather(): void {
        this.weatherService.getDailyWeatherForecast(this.location, 7)
            .subscribe((data: WeatherDailyForecast) => {
                this.weatherForecast = data;
                console.log('weatherForecast');
                console.log(this.weatherForecast);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

}