import React, { useState, useEffect } from 'react';
import weatherService from '../../services/weatherService';
import { Cloud, CloudRain, Sun, AlertCircle } from 'lucide-react';

const WeatherWidget = ({ city, country }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [city, country]);

  const fetchWeather = async () => {
    if (!city || city.trim() === '') {
      setError('Location not set');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(city, country);
      setWeather(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Weather unavailable';
      setError(errorMessage);
      console.error('Weather widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-100 mb-1">Current Weather</p>
          <h3 className="text-lg font-bold">{weather.location}</h3>
          <div className="flex items-center gap-2 mt-2">
            <img 
              src={weatherService.getWeatherIconUrl(weather.icon)} 
              alt={weather.description}
              className="w-12 h-12"
            />
            <div>
              <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
              <p className="text-xs text-blue-100 capitalize">{weather.description}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right text-sm space-y-1">
          <div>
            <p className="text-blue-100 text-xs">Humidity</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs">Wind</p>
            <p className="font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
