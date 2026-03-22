import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LocationModal from './LocationModal';
import Applications from './Applications';
import TodoWidget from './TodoWidget';

const RightSidebar = () => {
    const { user } = useAuth();
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);
    const [officeDetail, setOfficeDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchOfficeDetail = async () => {
            try {
                const res = await axios.get('/admin/office-details');
                const details = res.data;
                
                if (details.length > 0) {
                    let match = details.find(d => 
                        user?.office_location?.toLowerCase().includes(d.city?.toLowerCase()) ||
                        user?.office_location?.toLowerCase().includes(d.office_name?.toLowerCase())
                    );
                    
                    setOfficeDetail(match || details[0]);
                }
            } catch (err) {
                console.error("Failed to fetch office details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficeDetail();
    }, [user]);

    useEffect(() => {
        const fetchWeather = async () => {
            if (officeDetail && officeDetail.latitude && officeDetail.longitude) {
                try {
                    const res = await axios.get(`/weather?lat=${officeDetail.latitude}&lon=${officeDetail.longitude}`);
                    setWeather(res.data);
                } catch (err) {
                    console.error("Failed to fetch sidebar weather:", err);
                }
            }
        };
        fetchWeather();
    }, [officeDetail]);

    if (loading) return <div className="content-sidebar"><div className="loader"></div></div>;

    const displayOffice = officeDetail || {
        office_name: 'Corporate Technology Center',
        city: 'Coimbatore',
        image: '/lmage/CTC.png'
    };

    const getWeatherIcon = (code) => {
        if (code === undefined || code === null) return 'fas fa-sun';
        if (code === 0) return 'fas fa-sun';
        if (code <= 3) return 'fas fa-cloud-sun';
        if (code <= 48) return 'fas fa-cloud';
        if (code <= 67) return 'fas fa-cloud-rain';
        return 'fas fa-sun';
    };

    const temp = weather?.current_weather?.temperature;
    const weatherCode = weather?.current_weather?.weathercode;

    return (
        <div className="content-sidebar">
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                office={displayOffice}
            />

            {/* Location Card */}
            <div className="location-card-modern" onClick={() => setLocationModalOpen(true)}>
                <div className="location-image-box">
                    <img src={displayOffice.image || '/lmage/CTC.png'} alt={displayOffice.office_name} className="location-img-main" />
                    {temp !== undefined && (
                        <div className="weather-chip-floating">
                            <i className={`${getWeatherIcon(weatherCode)}`} style={{ color: '#f6a31a' }}></i>
                            <span>{Math.round(temp)}°C</span>
                        </div>
                    )}
                </div>
                <div className="location-content-box">
                    <div className="location-city-info">
                        <i className="fas fa-map-pin"></i>
                        <span>{displayOffice.city}</span>
                    </div>
                    <div className="location-facility-name">{displayOffice.office_name}</div>
                </div>
            </div>

            {/* Applications Widget */}
            <Applications />

            {/* Todo Widget */}
            <TodoWidget />

        </div>
    );
};

export default RightSidebar;
