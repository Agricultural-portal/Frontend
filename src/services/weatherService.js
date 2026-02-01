import api from './api';

const weatherService = {
  /**
   * Get current weather by city
   * @param {string} city - City name
   * @param {string} country - Country code (optional)
   * @returns {Promise} Current weather data
   */
  getCurrentWeather: async (city, country = null) => {
    try {
      const params = { city };
      if (country) {
        params.country = country;
      }
      const response = await api.get('/weather/current', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  /**
   * Get current weather by coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise} Current weather data
   */
  getCurrentWeatherByCoordinates: async (lat, lon) => {
    try {
      const response = await api.get('/weather/current/coordinates', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw error;
    }
  },

  /**
   * Get 5-day weather forecast by city
   * @param {string} city - City name
   * @param {string} country - Country code (optional)
   * @returns {Promise} Weather forecast data
   */
  getWeatherForecast: async (city, country = null) => {
    try {
      const params = { city };
      if (country) {
        params.country = country;
      }
      const response = await api.get('/weather/forecast', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },

  /**
   * Get 5-day weather forecast by coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise} Weather forecast data
   */
  getWeatherForecastByCoordinates: async (lat, lon) => {
    try {
      const response = await api.get('/weather/forecast/coordinates', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast by coordinates:', error);
      throw error;
    }
  },

  /**
   * Get weather icon URL from OpenWeatherMap
   * @param {string} iconCode - Icon code from API
   * @returns {string} Full icon URL
   */
  getWeatherIconUrl: (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },

  /**
   * Format temperature
   * @param {number} temp - Temperature in Celsius
   * @returns {string} Formatted temperature
   */
  formatTemperature: (temp) => {
    return temp ? `${Math.round(temp)}°C` : 'N/A';
  },

  /**
   * Format date from timestamp
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted date
   */
  formatDate: (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export default weatherService;
