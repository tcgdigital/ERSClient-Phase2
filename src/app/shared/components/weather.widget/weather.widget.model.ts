export class WeatherData {
    public coord: Coord;
    public weather: Weather[];
    public base: string;
    public main: Main;
    public wind: Wind;
    public clouds: Clouds;
    public rain: object;
    public dt: number;
    public sys: Sys;
    public id: number;
    public name: string;
    public cod: string;

    public localDate: Date;
    public icon: string;

    constructor() {
        this.coord = new Coord();
        this.weather = new Array<Weather>();
        this.main = new Main();
        this.wind = new Wind();
        this.clouds = new Clouds();
        this.sys = new Sys();
    }
}

export class WeatherDailyForecast {
    public cod: string;
    public message: number;
    public city: City;
    public coord: Coord;
    public country: string;
    public cnt: number;
    public list: WeatherList[];

    constructor() {
        this.city = new City();
        this.coord = new Coord();
        this.list = new Array<WeatherList>();
    }
}

export class WeatherHourlyForecast {

}

export class City {
    public id: number;
    public name: string;
}

export class WeatherList {
    public dt: number;
    public temp: Temp;
    public pressure: number;
    public humidity: number;
    public weather: Weather[];
    public localDate: Date;
    public icon: string;

    // public get localDate(): Date {
    //     return new Date(this.dt);
    // }

    // public get icon(): string {
    //     if (this.weather.length > 0 && this.weather[0].id) {
    //         return `wi wi-owm-${this.weather[0].id}`;
    //     } else {
    //         return '';
    //     }
    // }

    constructor() {
        this.weather = Array<Weather>();
    }
}

export class Temp {
    public day: number;
    public min: number;
    public max: number;
    public night: number;
    public eve: number;
    public morn: number;
}

export class Coord {
    public lon: number;
    public lat: number;
}

export class Weather {
    public id: number;
    public main: string;
    public description: string;
    public icon: string;
}

export class Main {
    public temp: number;
    public pressure: number;
    public humidity: number;
    public temp_min: number;
    public temp_max: number;
}

export class Wind {
    public speed: number;
    public deg: number;
}

export class Clouds {
    public all: number;
}

export class Sys {
    public type: number;
    public id: number;
    public message: number;
    public country: string;
    public sunrise: number;
    public sunset: number;
}

