import {useMemo, useReducer} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectFavoriteCities, toggleFavorite} from '../slices/favoritesSlice';
import {CITY_LIST} from '../constants/cities';
import {MOCK_WEATHER} from '../constants/mockWeather';
import {CityDetailsPanel, ForecastGrid} from '../components';
import './Favorites.css';
import './Home.css';

export function Favorites() {
    const dispatch = useDispatch();
    const favoriteCities = useSelector(selectFavoriteCities);
    const [expandedCityId, toggleExpanded] = useReducer((state, action) => {
        if (action.type === 'toggle') {
            return state === action.cityId ? null : action.cityId;
        }
        return state;
    }, null);

    const selectedCities = useMemo(
        () => CITY_LIST.filter(city => favoriteCities.includes(city.id)),
        [favoriteCities],
    );

    const handleRemove = cityId => {
        dispatch(toggleFavorite(cityId));
    };

    return (
        <section className="favorites">
            <div className="favorites-header">
                <h1 className="header">Your favorite cities</h1>
                <p className="subheading">
                    This list shows only the cities you picked. You can remove them or go back to add
                    more.
                </p>
            </div>

            {selectedCities.length === 0 ? (
                <div className="favorites-empty">
                    <p>You have no favorites yet.</p>
                    <Link className="link-button" to="/selection">
                        Pick favorites
                    </Link>
                </div>
            ) : (
                <ul className="city-list">
                    {selectedCities.map(city => {
                        const weather = MOCK_WEATHER[city.id];
                        const isExpanded = expandedCityId === city.id;
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
                            metaParts.push(
                                `💧 ${weather.precipitation.probability}%${precipitationDetail}`,
                            );
                        }
                        if (weather?.wind) {
                            const direction = weather.wind.direction ? ` ${weather.wind.direction}` : '';
                            metaParts.push(`💨 ${weather.wind.speedKph} km/h${direction}`);
                        }
                        if (typeof weather?.cloudiness === 'number') {
                            metaParts.push(`☁️ ${weather.cloudiness}%`);
                        }
                        return (
                            <li key={city.id} className={`city-row is-favorite ${isExpanded ? 'is-open' : ''}`}>
                                <button
                                    type="button"
                                    className="city-main-link city-toggle"
                                    onClick={() => toggleExpanded({type: 'toggle', cityId: city.id})}
                                    aria-expanded={isExpanded}
                                >
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
                                </button>
                                <div className="city-actions">
                                    <button
                                        type="button"
                                        className="favorite-button danger icon-only"
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemove(city.id);
                                        }}
                                        aria-label="Remove from favorites"
                                    >
                                        <span className="favorite-icon" aria-hidden="true">
                                            ✕
                                        </span>
                                    </button>
                                </div>
                                {isExpanded && <CityDetailsPanel weather={weather} />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
