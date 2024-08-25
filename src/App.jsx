import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiHumidity, WiStrongWind, WiBarometer, WiDaySunny } from 'react-icons/wi';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [showHourly, setShowHourly] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');

  const notify1 = () => toast.error('No location found. Please enter a valid location.');
  const notify = () => toast.error('Please Provide Your Location');

  const fetchWeather = async (locationQuery) => {
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
        params: {
          key: 'e5de58671d4d4f40ace112603242408',
          q: locationQuery,
          days: 1,
        }
      });
      if (response.data.error) {
        setWeatherData(null);
        setError('No area found');
      } else {
        setWeatherData(response.data);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setError('Please Provide a Valid Location Name');
      notify1();
    }
  };

  useEffect(() => {
    fetchWeather('pabna');
  }, []);

  useEffect(() => {
    let interval;
    if (weatherData) {
      interval = setInterval(() => {
        fetchWeather(location || 'pabna');
      }, 960000);
    }
    return () => clearInterval(interval);
  }, [weatherData, location]);

  const handleSearch = () => {
    if (!location.trim()) {
      notify();
      return;
    }
    fetchWeather(location);
  };

  const celsiusToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;
  const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;
  const toggleUnit = () => setUnit(unit === 'C' ? 'F' : 'C');

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-900'>
      <Toaster />
      <motion.div
        className='w-[600px] p-6 rounded-3xl shadow-lg bg-gray-800 bg-opacity-80 text-white'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex justify-center items-center mb-6'>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
            className='p-2 rounded-l-full outline-none flex-1 bg-gray-700 text-white'
          />
          <button
            onClick={handleSearch}
            className='p-2 bg-purple-600 text-white rounded-r-full'
          >
            Search
          </button>
        </div>

        {error && <p className='text-red-400 text-center mb-4'>{error}</p>}

        {weatherData ? (
          <>
            <div className='mb-6 text-center'>
              <h1 className='text-2xl font-bold mb-2'>
                {weatherData.location.name}, {weatherData.location.country}
              </h1>
              <p className='text-sm'>{weatherData.location.localtime}</p>
            </div>

            <div className='mb-6 text-center'>
              <button
                onClick={toggleUnit}
                className='mb-4 p-2 bg-purple-600 text-white rounded-full'
              >
                Switch to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
              </button>
              <div className='flex justify-between items-center mb-6'>
                <div className='flex flex-col items-center'>
                  <img
                    src={weatherData.current.condition.icon}
                    alt={weatherData.current.condition.text}
                    className='w-16 h-16 mb-2'
                  />
                  <h2 className='text-4xl font-bold'>
                    {unit === 'C' ? `${weatherData.current.temp_c}°C` : `${celsiusToFahrenheit(weatherData.current.temp_c).toFixed(1)}°F`}
                  </h2>
                  <p className='text-sm'>
                    Feels Like: {unit === 'C' ? `${weatherData.current.feelslike_c}°C` : `${celsiusToFahrenheit(weatherData.current.feelslike_c).toFixed(1)}°F`}
                  </p>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <WiHumidity size={30} />
                    <span>Humidity: {weatherData.current.humidity}%</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <WiStrongWind size={30} />
                    <span>Wind: {weatherData.current.wind_kph} kph</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <WiBarometer size={30} />
                    <span>Pressure: {weatherData.current.pressure_mb} mb</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <WiDaySunny size={30} />
                    <span>UV Index: {weatherData.current.uv}</span>
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <h2 className='text-2xl font-semibold mb-2'>Forecast for {weatherData.forecast.forecastday[0].date}</h2>
                <div className='flex justify-between'>
                  <div className='flex flex-col'>
                    <span>
                      Max Temp: {unit === 'C' ? `${weatherData.forecast.forecastday[0].day.maxtemp_c}°C` : `${celsiusToFahrenheit(weatherData.forecast.forecastday[0].day.maxtemp_c).toFixed(1)}°F`}
                    </span>
                    <span>
                      Min Temp: {unit === 'C' ? `${weatherData.forecast.forecastday[0].day.mintemp_c}°C` : `${celsiusToFahrenheit(weatherData.forecast.forecastday[0].day.mintemp_c).toFixed(1)}°F`}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span>Condition: {weatherData.forecast.forecastday[0].day.condition.text}</span>
                    <span>Chance of Rain: {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%</span>
                  </div>
                  <div className='flex flex-col'>
                    <span>Sunrise: {weatherData.forecast.forecastday[0].astro.sunrise}</span>
                    <span>Sunset: {weatherData.forecast.forecastday[0].astro.sunset}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className='text-2xl font-semibold mb-2 flex items-center cursor-pointer' onClick={() => setShowHourly(!showHourly)}>
                  Hourly Overview
                  <span className='ml-2'>{showHourly ? '▲' : '▼'}</span>
                </h2>
                {showHourly && (
                  <div className='bg-gray-800 bg-opacity-75 text-white p-4 rounded-lg'>
                    <div className='grid grid-cols-3 gap-4'>
                      {weatherData.forecast.forecastday[0].hour.slice(0, 6).map((hour, index) => (
                        <div key={index} className='bg-gray-700 text-white p-4 rounded-lg text-center'>
                          <p>{hour.time.split(' ')[1]}</p>
                          <p>{unit === 'C' ? `${hour.temp_c}°C` : `${celsiusToFahrenheit(hour.temp_c).toFixed(1)}°F`}</p>
                          <p>{hour.condition.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className='text-center'> </p>
        )}
      </motion.div>
    </div>
  );
};

export default App;
