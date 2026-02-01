import React, { useState, useEffect } from 'react';
import weatherService from '../../services/weatherService';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Sunrise, Sunset } from 'lucide-react';

const WeatherCard = ({ city, country }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [city, country]);

  const fetchWeather = async () => {
    if (!city || city.trim() === '') {
      setError('Please provide a city name');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(city, country);
      setWeather(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-500">
          <Cloud className="w-12 h-12 mx-auto mb-2" />
          <p>{error}</p>
          <button 
            onClick={fetchWeather}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      {/* Location */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{weather.location}</h2>
        <p className="text-blue-100">{weather.country}</p>
      </div>

      {/* Main Weather */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img 
            src={weatherService.getWeatherIconUrl(weather.icon)} 
            alt={weather.description}
            className="w-24 h-24"
          />
          <div>
            <div className="text-5xl font-bold">
              {Math.round(weather.temperature)}°C
            </div>
            <p className="text-blue-100 capitalize">{weather.description}</p>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Feels Like</span>
          </div>
          <p className="text-xl font-semibold">{Math.round(weather.feelsLike)}°C</p>
        </div>

        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <p className="text-xl font-semibold">{weather.humidity}%</p>
        </div>

        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <p className="text-xl font-semibold">{weather.windSpeed} m/s</p>
        </div>

        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Visibility</span>
          </div>
          <p className="text-xl font-semibold">{weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km</p>
        </div>
      </div>

      {/* Sun Times */}
      <div className="flex justify-between bg-white/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Sunrise className="w-5 h-5" />
          <div>
            <p className="text-xs text-blue-100">Sunrise</p>
            <p className="font-semibold">{formatTime(weather.sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="w-5 h-5" />
          <div>
            <p className="text-xs text-blue-100">Sunset</p>
            <p className="font-semibold">{formatTime(weather.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
