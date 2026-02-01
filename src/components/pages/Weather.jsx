import React, { useEffect, useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import WeatherCard from "../weather/WeatherCard";
import WeatherForecast from "../weather/WeatherForecast";
import { MapPin } from "lucide-react";

export function Weather() {
  const { currentUser } = useAppContext();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("in");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    // Set default city from user profile
    if (currentUser?.city) {
      setCity(currentUser.city);
    } else {
      setCity("Mumbai"); // Default city
    }
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Get current weather and 5-day forecast for your location
        </p>
      </div>

      {/* Location Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Enter city name (e.g., Mumbai, Delhi, Pune)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="text-xs text-gray-600 w-full">Quick select:</p>
          {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'].map((cityName) => (
            <button
              key={cityName}
              onClick={() => setCity(cityName)}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              {cityName}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Current location: <span className="font-semibold">{city}</span>
        </p>
      </div>

      {/* Current Weather Card */}
      <div className="grid grid-cols-1 gap-6">
        <WeatherCard city={city} country={country} />
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-1 gap-6">
        <WeatherForecast city={city} country={country} />
      </div>

      {/* Agricultural Tips based on weather */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">
          🌱 Agricultural Weather Tips
        </h2>
        <div className="space-y-2 text-sm text-green-700">
          <p>• Check the forecast before planning irrigation schedules</p>
          <p>• Heavy rain alerts: Ensure proper drainage in fields</p>
          <p>• High temperature warnings: Plan early morning or evening activities</p>
          <p>• Monitor humidity levels for pest and disease management</p>
          <p>• Strong wind alerts: Secure greenhouse structures and protect young plants</p>
        </div>
      </div>
    </div>
  );
}

export default Weather;
