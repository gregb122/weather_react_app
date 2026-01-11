import {ForecastGrid} from './ForecastCard';
import './CityDetailsPanel.css';

export function CityDetailsPanel({weather}) {
    if (!weather) return null;

    const {city, country, currentTempC, condition, icon, precipitation, wind, cloudiness, forecast} =
        weather;

    return (
        <div className="inline-details">
            <div className="inline-details-header">
                <div className="inline-details-title">{city}</div>
                <div className="inline-details-subtitle">{country}</div>
            </div>
            <div className="inline-current-card">
                <div className="inline-temp">
                    <span className="inline-temp-value">{currentTempC}°C</span>
                    <span className="inline-temp-label">Current</span>
                </div>
                <div className="inline-meta">
                    <div className="inline-meta-row">
                        <span className="inline-meta-label">Conditions</span>
                        <span className="inline-meta-value">
                            {icon} {condition}
                        </span>
                    </div>
                    <div className="inline-meta-row">
                        <span className="inline-meta-label">Precipitation</span>
                        <span className="inline-meta-value">
                            {precipitation?.probability}% {precipitation?.type}{' '}
                            {precipitation?.amountMm !== undefined &&
                                precipitation?.amountMm !== null &&
                                `(${precipitation.amountMm} mm)`}
                        </span>
                    </div>
                    <div className="inline-meta-row">
                        <span className="inline-meta-label">Wind</span>
                        <span className="inline-meta-value">
                            {wind?.speedKph} km/h {wind?.direction}
                        </span>
                    </div>
                    <div className="inline-meta-row">
                        <span className="inline-meta-label">Cloudiness</span>
                        <span className="inline-meta-value">{cloudiness}%</span>
                    </div>
                </div>
            </div>

            <h3 className="inline-section-title">Forecast</h3>
            <ForecastGrid days={forecast} limit={8} />
        </div>
    );
}
