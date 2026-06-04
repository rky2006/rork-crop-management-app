import type { IndianRegion } from './cropSuggestions';

export interface ForecastDay {
  day: string;
  condition: string;
  temp: string;
  rain: number;
  wind: string;
}

const REGION_COORDINATES: Record<IndianRegion, { latitude: number; longitude: number }> = {
  northern_plains: { latitude: 28.6139, longitude: 77.2090 },
  northwest: { latitude: 26.9124, longitude: 75.7873 },
  central: { latitude: 23.2599, longitude: 77.4126 },
  peninsular: { latitude: 12.9716, longitude: 77.5946 },
  eastern: { latitude: 22.5726, longitude: 88.3639 },
  hilly: { latitude: 30.7333, longitude: 79.0669 },
};

const DEFAULT_COORDINATES = { latitude: 23.5937, longitude: 78.9629 };

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Heavy Showers',
  85: 'Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

interface OpenMeteoDailyResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

function formatDayLabel(dateText: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(`${dateText}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function mapWeatherCodeToCondition(code: number): string {
  return WEATHER_CODE_MAP[code] ?? 'Mixed Conditions';
}

function formatTemperature(max: number, min: number): string {
  return `${Math.round(max)}° / ${Math.round(min)}°`;
}

function formatWind(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

export async function fetchRealtimeWeatherForecast(region: IndianRegion | null): Promise<ForecastDay[]> {
  const coordinates = region ? REGION_COORDINATES[region] : DEFAULT_COORDINATES;
  const params = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '4',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }
  const data = (await response.json()) as OpenMeteoDailyResponse;
  const daily = data.daily;
  if (
    !daily ||
    !daily.time?.length ||
    !daily.weather_code?.length ||
    !daily.temperature_2m_max?.length ||
    !daily.temperature_2m_min?.length ||
    !daily.precipitation_probability_max?.length ||
    !daily.wind_speed_10m_max?.length
  ) {
    throw new Error('Weather response did not include daily forecast data');
  }
  return daily.time.map((dateText, index) => ({
    day: formatDayLabel(dateText, index),
    condition: mapWeatherCodeToCondition(daily.weather_code[index]),
    temp: formatTemperature(daily.temperature_2m_max[index], daily.temperature_2m_min[index]),
    rain: Math.round(daily.precipitation_probability_max[index]),
    wind: formatWind(daily.wind_speed_10m_max[index]),
  }));
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
