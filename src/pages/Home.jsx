import {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectFavoriteCities, toggleFavorite} from '../slices/favoritesSlice';
import {CITY_LIST} from '../constants/cities';
import {MOCK_WEATHER} from '../constants/mockWeather';
import {Link} from 'react-router-dom';
import {ForecastGrid} from '../components';
import './Home.css';

export function Home() {
    const dispatch = useDispatch();
    const favoriteCities = useSelector(selectFavoriteCities);
    const [search, setSearch] = useState('');

    const filteredCities = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return CITY_LIST;
        return CITY_LIST.filter(city => {
            const combined = `${city.name} ${city.country}`.toLowerCase();
            return combined.includes(term);
        });
    }, [search]);

    const handleToggleFavorite = cityId => {
        dispatch(toggleFavorite(cityId));
    };

    return (
        <section className="home">
            <h1 className="header">City selection</h1>
            <p className="subheading">
                Use search to quickly find a city, then tap the star to add or remove. Your picks stay
                in the browser.
            </p>

            <div className="search-row">
                <label className="search-label" htmlFor="city-search">
                    Search cities
                </label>
                <input
                    id="city-search"
                    type="search"
                    className="search-input"
                    placeholder="Start typing a city or country"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <ul className="city-list">
                {filteredCities.length === 0 && (
                    <li className="empty-state">No cities match that search.</li>
                )}
                {filteredCities.map(city => {
                    const isFavorite = favoriteCities.includes(city.id);
                    const weather = MOCK_WEATHER[city.id];
                    const metaParts = [];
                    if (weather?.precipitation) {
                        const hasAmount =
                            weather.precipitation.amountMm !== undefined &&
                            weather.precipitation.amountMm !== null;
                        const precipitationType =
                            weather.precipitation.type && weather.precipitation.type !== 'none'
                                ? ` ${weather.precipitation.type}`
                                : '';
                        const precipitationDetail = hasAmount
                            ? ` (${weather.precipitation.amountMm} mm${precipitationType})`
                            : precipitationType;
                        metaParts.push(`💧 ${weather.precipitation.probability}%${precipitationDetail}`);
                    }
                    if (weather?.wind) {
                        const direction = weather.wind.direction ? ` ${weather.wind.direction}` : '';
                        metaParts.push(`💨 ${weather.wind.speedKph} km/h${direction}`);
                    }
                    if (typeof weather?.cloudiness === 'number') {
                        metaParts.push(`☁️ ${weather.cloudiness}%`);
                    }
                    return (
                        <li key={city.id} className={`city-row ${isFavorite ? 'is-favorite' : ''}`}>
                            <Link className="city-main-link" to={`/details/${city.id}`}>
                                <div className="city-main">
                                    <div className="city-details">
                                        <span className="city-name">{city.name}</span>
                                        <span className="city-country">{city.country}</span>
                                    </div>
                                    {weather && (
                                        <>
                                            <div className="city-weather">
                                                <span className="city-temp">{weather.currentTempC}°C</span>
                                                <span className="city-condition">
                                                    {weather.icon} {weather.condition}
                                                </span>
                                            {metaParts.length > 0 && (
                                                <span className="city-meta">
                                                    {metaParts.join(' · ')}
                                                </span>
                                            )}
                                        </div>
                                        <ForecastGrid days={weather?.forecast} limit={4} />
                                    </>
                                )}
                            </div>
                        </Link>
                            <div className="city-actions">
                                <button
                                    type="button"
                                    className="favorite-button icon-only"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleFavorite(city.id);
                                    }}
                                    aria-pressed={isFavorite}
                                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <span className="favorite-icon" aria-hidden="true">
                                        {isFavorite ? '★' : '☆'}
                                    </span>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
