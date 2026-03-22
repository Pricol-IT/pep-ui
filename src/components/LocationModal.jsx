import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationModal = ({ isOpen, onClose, office }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && office && office.latitude && office.longitude) {
            fetchWeather();
        }
    }, [isOpen, office]);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/weather?lat=${office.latitude}&lon=${office.longitude}`);
            setWeather(res.data);
        } catch (err) {
            console.error("Weather fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getWeatherIcon = (code) => {
        if (code === 0) return 'fas fa-sun';
        if (code <= 3) return 'fas fa-cloud-sun';
        if (code <= 48) return 'fas fa-cloud';
        if (code <= 67) return 'fas fa-cloud-rain';
        if (code <= 77) return 'fas fa-snowflake';
        if (code <= 82) return 'fas fa-cloud-showers-heavy';
        if (code <= 99) return 'fas fa-bolt';
        return 'fas fa-sun';
    };

    const getWeatherDesc = (code) => {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snowy';
        if (code <= 82) return 'Showers';
        if (code <= 99) return 'Thunderstorm';
        return 'Mostly Sunny';
    };

    const currentWeather = weather?.current_weather;
    const hourly = weather?.hourly;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal-card" onClick={e => e.stopPropagation()}>
                <button className="location-modal-close" onClick={onClose}>
                    <i className="ti ti-x"></i>
                </button>

                <div className="location-modal-hero">
                    <img src={office.image || '/lmage/CTC.png'} alt={office.office_name} />
                </div>

                <div className="location-modal-body">
                    <div className="location-modal-header-text">
                        <h2>{office.office_name}</h2>
                        <span className="hq-badge">{office.city || 'Office'}</span>
                    </div>

                    <div className="address-box">
                        <div className="address-icon">
                            <i className="fas fa-map-pin"></i>
                        </div>
                        <div className="address-text">
                            <label>Address</label>
                            <p>{office.address || 'Address not set. Please update in admin panel.'}</p>
                        </div>
                        <button className="direction-btn" title="Get Directions">
                            <i className="fas fa-directions"></i>
                        </button>
                    </div>

                    <div className="weather-details-box">
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading Weather...</div>
                        ) : currentWeather ? (
                            <>
                                <div className="current-weather-row">
                                    <div className="temp-display">
                                        <i className={`${getWeatherIcon(currentWeather.weathercode)} fa-beat-slow`}></i>
                                        <span className="big-temp">{Math.round(currentWeather.temperature)}°</span>
                                        <div className="temp-meta">
                                            <span className="condition">{getWeatherDesc(currentWeather.weathercode)}</span>
                                            <span className="feels-like">Wind: {currentWeather.windspeed} km/h</span>
                                        </div>
                                    </div>
                                    <div className="weather-stats-grid">
                                        <div className="weather-stat">
                                            <i className="ti ti-wind"></i>
                                            <span>{currentWeather.windspeed} km/h</span>
                                        </div>
                                        <div className="weather-stat">
                                            <i className="ti ti-droplet"></i>
                                            <span>Live</span>
                                        </div>
                                        <div className="weather-stat">
                                            <i className="ti ti-uv-index"></i>
                                            <span>Normal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="forecast-label">Forecast (Next 5 Hours)</div>
                                <div className="forecast-row">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div key={i} className={`forecast-item ${i === 0 ? 'active' : ''}`}>
                                            <span className="f-time">{i === 0 ? 'Now' : hourly.time[i].split('T')[1].substring(0, 5)}</span>
                                            <i className={getWeatherIcon(hourly.weathercode[i])}></i>
                                            <span className="f-temp">{Math.round(hourly.temperature_2m[i])}°</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                <i className="fas fa-cloud-slash"></i> Weather coordinates not set for this location.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
