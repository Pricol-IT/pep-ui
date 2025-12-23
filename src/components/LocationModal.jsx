import React from 'react';

const LocationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal-card" onClick={e => e.stopPropagation()}>
                <button className="location-modal-close" onClick={onClose}>
                    <i className="ti ti-x"></i>
                </button>

                <div className="location-modal-hero">
                    <img src="/lmage/CTC.png" alt="Corporate Technology Center" />
                </div>

                <div className="location-modal-body">
                    <div className="location-modal-header-text">
                        <h2>Corporate Technology Center</h2>
                        <span className="hq-badge">Headquarters</span>
                    </div>

                    <div className="address-box">
                        <div className="address-icon">
                            <i className="ti ti-map-pin-filled"></i>
                        </div>
                        <div className="address-text">
                            <label>Address</label>
                            <p>Pricol, 132, Ooty Main Road, Perianaickenpalaiyam, Coimbatore 641020, Tamil Nadu, India</p>
                        </div>
                        <button className="direction-btn" title="Get Directions">
                            <i className="ti ti-direction"></i>
                        </button>
                    </div>

                    <div className="weather-details-box">
                        <div className="current-weather-row">
                            <div className="temp-display">
                                <i className="ti ti-sun-filled spin-slow"></i>
                                <span className="big-temp">28°</span>
                                <div className="temp-meta">
                                    <span className="condition">Mostly Sunny</span>
                                    <span className="feels-like">Feels like 32°</span>
                                </div>
                            </div>
                            <div className="weather-stats-grid">
                                <div className="weather-stat">
                                    <i className="ti ti-wind"></i>
                                    <span>12 km/h</span>
                                </div>
                                <div className="weather-stat">
                                    <i className="ti ti-droplet"></i>
                                    <span>45%</span>
                                </div>
                                <div className="weather-stat">
                                    <i className="ti ti-uv-index"></i>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="forecast-label">Forecast</div>
                        <div className="forecast-row">
                            <div className="forecast-item active">
                                <span className="f-time">Now</span>
                                <i className="ti ti-sun"></i>
                                <span className="f-temp">28°</span>
                            </div>
                            <div className="forecast-item">
                                <span className="f-time">14:00</span>
                                <i className="ti ti-cloud-sun"></i>
                                <span className="f-temp">30°</span>
                            </div>
                            <div className="forecast-item">
                                <span className="f-time">16:00</span>
                                <i className="ti ti-cloud"></i>
                                <span className="f-temp">29°</span>
                            </div>
                            <div className="forecast-item">
                                <span className="f-time">18:00</span>
                                <i className="ti ti-cloud-rain"></i>
                                <span className="f-temp">26°</span>
                            </div>
                            <div className="forecast-item">
                                <span className="f-time">20:00</span>
                                <i className="ti ti-moon-stars"></i>
                                <span className="f-temp">24°</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
