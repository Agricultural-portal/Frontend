import React, { useState, useEffect } from 'react';
import weatherService from '../../services/weatherService';
import { Cloud, CloudRain, Droplets, Wind } from 'lucide-react';

const WeatherForecast = ({ city, country }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecast();
  }, [city, country]);

  const fetchForecast = async () => {
    if (!city || city.trim() === '') {
      setError('Please provide a city name');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeatherForecast(city, country);
      setForecast(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch forecast data';
      setError(errorMessage);
      console.error('Forecast fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
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
            onClick={fetchForecast}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!forecast || !forecast.forecasts) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">5-Day Weather Forecast</h3>
        <p className="text-gray-600">{forecast.location}, {forecast.country}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecast.forecasts.map((day, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Date */}
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {formatDate(day.date)}
            </p>

            {/* Weather Icon */}
            <div className="flex justify-center mb-2">
              <img 
                src={weatherService.getWeatherIconUrl(day.icon)} 
                alt={day.description}
                className="w-16 h-16"
              />
            </div>

            {/* Temperature */}
            <div className="text-center mb-2">
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(day.temperature)}°C
              </p>
              <p className="text-xs text-gray-600">
                {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-700 text-center capitalize mb-3">
              {day.description}
            </p>

            {/* Additional Info */}
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>Humidity</span>
                </div>
                <span className="font-semibold">{day.humidity}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>Wind</span>
                </div>
                <span className="font-semibold">{day.windSpeed} m/s</span>
              </div>

              {day.precipitationProbability !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3" />
                    <span>Rain</span>
                  </div>
                  <span className="font-semibold">
                    {Math.round(day.precipitationProbability * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
