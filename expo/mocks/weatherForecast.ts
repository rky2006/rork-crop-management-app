export interface ForecastDay {
  day: string;
  condition: string;
  temp: string;
  rain: number;
  wind: string;
}

export const WEATHER_FORECAST: ForecastDay[] = [
  { day: "Today", condition: "Partly Cloudy", temp: "31° / 24°", rain: 20, wind: "11 km/h" },
  { day: "Tomorrow", condition: "Light Rain", temp: "29° / 23°", rain: 60, wind: "16 km/h" },
  { day: "Sunday", condition: "Sunny", temp: "33° / 25°", rain: 5, wind: "9 km/h" },
  { day: "Monday", condition: "Cloudy", temp: "30° / 24°", rain: 30, wind: "12 km/h" },
];
