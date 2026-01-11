import {Link, useParams} from 'react-router-dom';
import {MOCK_WEATHER} from '../constants/mockWeather';
import {ForecastGrid} from '../components';
import './Details.css';

export function Details() {
    const {cityId} = useParams();
    const weather = cityId ? MOCK_WEATHER[cityId] : null;

    if (!weather) {
        return (
            <section className="details">
                <h1 className="header">City not found</h1>
                <p>Pick a city from the list to see its forecast.</p>
                <Link className="link-button" to="/favorites">
                    Back to favorites
                </Link>
            </section>
        );
    }

    const {city, country, currentTempC, condition, icon, precipitation, wind, cloudiness, forecast} =
        weather;

    return (
        <section className="details">
            <div className="details-header">
                <div>
                    <h1 className="header">
                        {icon} {city}
                    </h1>
                    <p className="subheading">{country}</p>
                </div>
                <Link className="link-button" to="/favorites">
                    ← Back to favorites
                </Link>
            </div>

            <div className="current-card">
                <div className="temp">
                    <span className="temp-value">{currentTempC}°C</span>
                    <span className="temp-label">Current</span>
                </div>
                <div className="current-meta">
                    <div className="meta-row">
                        <span className="meta-label">Conditions</span>
                        <span className="meta-value">
                            {icon} {condition}
                        </span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Precipitation</span>
                        <span className="meta-value">
                            {precipitation.probability}% {precipitation.type} ({precipitation.amountMm}{' '}
                            mm)
                        </span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Wind</span>
                        <span className="meta-value">
                            {wind.speedKph} km/h {wind.direction}
                        </span>
                    </div>
                    <div className="meta-row">
                        <span className="meta-label">Cloudiness</span>
                        <span className="meta-value">{cloudiness}%</span>
                    </div>
                </div>
            </div>

            <h2 className="section-title">Forecast</h2>
            <ForecastGrid days={forecast} limit={6} />
        </section>
    );
}
