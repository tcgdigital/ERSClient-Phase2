import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, URLSearchParams } from '@angular/http';
import { WeatherData, WeatherDailyForecast, WeatherList } from './weather.widget.model';

@Injectable()
export class WeatherWidgetService {
    private url: string = 'http://api.openweathermap.org/data/2.5/';
    private apiKey: string = 'f51b949bc5e188acc843db238b2898ce';

    constructor(private http: Http) { }

    public getCurrentWeather(location: string): Observable<WeatherData> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('q', location);
        params.set('appid', this.apiKey);
        params.set('mode', 'json');
        params.set('units', 'metric');

        return this.http.get(`${this.url}weather`, { search: params })
            .map((res: Response) => {
                const data: WeatherData = res.json() as WeatherData;
                const now: number = new Date().getTime();

                data.localDate = new Date(data.dt * 1000);
                if (now > data.sys.sunrise && now < data.sys.sunset) {
                    data.icon = `wi wi-owm-day-${data.weather[0].id}`;
                } else {
                    data.icon = `wi wi-owm-night-${data.weather[0].id}`;
                }
                return data;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getDailyWeatherForecast(location: string, days: number): Observable<WeatherDailyForecast> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('q', location);
        params.set('cnt', days.toString());
        params.set('appid', this.apiKey);
        params.set('mode', 'json');
        params.set('units', 'metric');

        return this.http.get(`${this.url}forecast/daily`, { search: params })
            .map((res: Response) => {
                const data: WeatherDailyForecast = res.json() as WeatherDailyForecast;
                data.list.forEach((item: WeatherList) => {
                    item.localDate = new Date(item.dt * 1000);
                    item.icon = `wi wi-owm-${item.weather[0].id}`;
                });
                return data;
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}