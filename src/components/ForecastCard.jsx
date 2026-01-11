import './ForecastCard.css';

export function ForecastCard({day}) {
    if (!day) return null;

    const hasWind = Boolean(day.windDirection);
    const hasPrecip = day.precipitationMm !== undefined && day.precipitationMm !== null;
    const hasCloud = day.cloudCover !== undefined && day.cloudCover !== null;
    const showForecastMeta = hasWind || hasPrecip || hasCloud;

    return (
        <div className="forecast-card">
            <div className="forecast-day">{day.day}</div>
            <div className="forecast-icon">{day.icon}</div>
            <div className="forecast-temp">{day.tempC}°C</div>
            <div className="forecast-condition">{day.condition}</div>
            {showForecastMeta && (
                <div className="forecast-meta">
                    {hasWind && <span className="forecast-meta-item">💨 {day.windDirection}</span>}
                    {hasPrecip && (
                        <span className="forecast-meta-item">
                            💧 {day.precipitationMm} mm
                            {day.precipitationType &&
                                day.precipitationType !== 'none' &&
                                ` ${day.precipitationType}`}
                        </span>
                    )}
                    {hasCloud && <span className="forecast-meta-item">☁️ {day.cloudCover}%</span>}
                </div>
            )}
        </div>
    );
}

export function ForecastGrid({days = [], limit}) {
    const items = Array.isArray(days) ? days : [];
    const trimmed = limit ? items.slice(0, limit) : items;

    return (
        <div className="forecast-grid">
            {trimmed.map((day, index) => (
                <ForecastCard key={`${day.day}-${index}`} day={day} />
            ))}
        </div>
    );
}
