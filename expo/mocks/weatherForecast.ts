import type { IndianRegion } from './cropSuggestions';

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

export const REGION_WEATHER_FORECAST: Record<IndianRegion, ForecastDay[]> = {
  northern_plains: [
    { day: "Today", condition: "Sunny", temp: "38° / 26°", rain: 5, wind: "10 km/h" },
    { day: "Tomorrow", condition: "Partly Cloudy", temp: "36° / 25°", rain: 15, wind: "13 km/h" },
    { day: "Day 3", condition: "Thunderstorm", temp: "32° / 24°", rain: 70, wind: "22 km/h" },
    { day: "Day 4", condition: "Cloudy", temp: "30° / 22°", rain: 40, wind: "14 km/h" },
  ],
  northwest: [
    { day: "Today", condition: "Hot & Sunny", temp: "43° / 30°", rain: 2, wind: "18 km/h" },
    { day: "Tomorrow", condition: "Sunny", temp: "44° / 31°", rain: 2, wind: "20 km/h" },
    { day: "Day 3", condition: "Partly Cloudy", temp: "41° / 28°", rain: 8, wind: "16 km/h" },
    { day: "Day 4", condition: "Sunny", temp: "42° / 29°", rain: 3, wind: "17 km/h" },
  ],
  central: [
    { day: "Today", condition: "Partly Cloudy", temp: "37° / 26°", rain: 20, wind: "12 km/h" },
    { day: "Tomorrow", condition: "Light Rain", temp: "34° / 24°", rain: 55, wind: "15 km/h" },
    { day: "Day 3", condition: "Rainy", temp: "31° / 23°", rain: 75, wind: "19 km/h" },
    { day: "Day 4", condition: "Partly Cloudy", temp: "33° / 24°", rain: 30, wind: "11 km/h" },
  ],
  peninsular: [
    { day: "Today", condition: "Humid & Cloudy", temp: "34° / 26°", rain: 35, wind: "14 km/h" },
    { day: "Tomorrow", condition: "Light Rain", temp: "32° / 25°", rain: 60, wind: "17 km/h" },
    { day: "Day 3", condition: "Rainy", temp: "30° / 24°", rain: 80, wind: "20 km/h" },
    { day: "Day 4", condition: "Cloudy", temp: "31° / 24°", rain: 45, wind: "13 km/h" },
  ],
  eastern: [
    { day: "Today", condition: "Humid & Sunny", temp: "35° / 27°", rain: 25, wind: "11 km/h" },
    { day: "Tomorrow", condition: "Thunderstorm", temp: "31° / 26°", rain: 80, wind: "24 km/h" },
    { day: "Day 3", condition: "Light Rain", temp: "30° / 25°", rain: 55, wind: "16 km/h" },
    { day: "Day 4", condition: "Partly Cloudy", temp: "32° / 25°", rain: 30, wind: "12 km/h" },
  ],
  hilly: [
    { day: "Today", condition: "Cool & Clear", temp: "22° / 12°", rain: 10, wind: "8 km/h" },
    { day: "Tomorrow", condition: "Partly Cloudy", temp: "20° / 11°", rain: 25, wind: "10 km/h" },
    { day: "Day 3", condition: "Light Rain", temp: "18° / 10°", rain: 55, wind: "14 km/h" },
    { day: "Day 4", condition: "Cloudy", temp: "19° / 11°", rain: 40, wind: "11 km/h" },
  ],
};
