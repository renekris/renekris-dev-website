import React, { useState, useEffect } from 'react';

const WeatherDemo = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Stockholm');
  const [unit, setUnit] = useState('metric');

  // Demo weather data for when API is not available
  const demoWeather = {
    Stockholm: {
      name: 'Stockholm',
      main: { temp: 15, feels_like: 13, humidity: 72, pressure: 1015 },
      weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
      wind: { speed: 3.5 },
      visibility: 10000,
      timezone: 3600
    },
    London: {
      name: 'London',
      main: { temp: 12, feels_like: 10, humidity: 78, pressure: 1012 },
      weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
      wind: { speed: 4.2 },
      visibility: 8000,
      timezone: 0
    },
    Tokyo: {
      name: 'Tokyo',
      main: { temp: 22, feels_like: 24, humidity: 65, pressure: 1018 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 2.1 },
      visibility: 10000,
      timezone: 32400
    }
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try with real API (you'd need to add your API key)
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=YOUR_API_KEY&units=${unit}`);
      
      // For demo purposes, simulate API call and use demo data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (demoWeather[cityName]) {
        setWeather(demoWeather[cityName]);
      } else {
        // Default to Stockholm for unknown cities
        setWeather(demoWeather.Stockholm);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city, unit]);

  const getWeatherIcon = (iconCode, weatherMain) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    
    return iconMap[iconCode] || '🌤️';
  };

  const formatTemp = (temp) => {
    return `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg border border-blue-500 max-w-sm mx-auto text-white">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Weather App Demo</h3>
        <div className="text-right text-sm opacity-75">
          {getCurrentTime()}
        </div>
      </div>

      {/* City Selection */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          {['Stockholm', 'London', 'Tokyo'].map((cityName) => (
            <button
              key={cityName}
              onClick={() => handleCityChange(cityName)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${city === cityName 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 hover:bg-blue-400 text-white border border-blue-300'
                }
              `}
            >
              {cityName}
            </button>
          ))}
        </div>
        
        <button
          onClick={toggleUnit}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded text-sm border border-blue-300"
        >
          °{unit === 'metric' ? 'C' : 'F'}
        </button>
      </div>

      {/* Weather Display */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2">Loading weather...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-200">⚠️ {error}</p>
          <button
            onClick={() => fetchWeather(city)}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded"
          >
            Retry
          </button>
        </div>
      )}

      {weather && !loading && !error && (
        <div className="space-y-4">
          {/* Main Weather */}
          <div className="text-center">
            <h4 className="text-xl font-bold">{weather.name}</h4>
            <div className="text-6xl my-4">
              {getWeatherIcon(weather.weather[0].icon, weather.weather[0].main)}
            </div>
            <div className="text-3xl font-bold">
              {formatTemp(weather.main.temp)}
            </div>
            <div className="text-lg capitalize">
              {weather.weather[0].description}
            </div>
            <div className="text-sm opacity-75">
              Feels like {formatTemp(weather.main.feels_like)}
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-300">
            <div className="text-center">
              <div className="text-sm opacity-75">Humidity</div>
              <div className="font-bold">{weather.main.humidity}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Wind</div>
              <div className="font-bold">{weather.wind.speed} m/s</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Pressure</div>
              <div className="font-bold">{weather.main.pressure} hPa</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75">Visibility</div>
              <div className="font-bold">{(weather.visibility / 1000).toFixed(1)} km</div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => fetchWeather(city)}
              disabled={loading}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded transition-colors disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-4 pt-4 border-t border-blue-300 text-xs opacity-75 text-center">
        Demo mode: Using sample weather data
      </div>
    </div>
  );
};

export default WeatherDemo;