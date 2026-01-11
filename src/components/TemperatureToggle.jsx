import {useDispatch, useSelector} from 'react-redux';
import {TEMPERATURE_UNITS} from '../constants/temperatureUnits';
import {setTemperatureUnits} from '../slices/weatherSlice';
import './TemperatureToggle.css';

export function TemperatureToggle() {
    const dispatch = useDispatch();
    const units = useSelector(state => state.weather.temperatureUnits);

    const handleChange = event => {
        const value = event.target.value;
        if (TEMPERATURE_UNITS.isValid(value)) {
            dispatch(setTemperatureUnits(value));
        }
    };

    return (
        <label className="temp-toggle">
            <span className="temp-toggle-label">Units</span>
            <select value={units} onChange={handleChange} className="temp-toggle-select">
                <option value={TEMPERATURE_UNITS.CELSIUS}>°C</option>
                <option value={TEMPERATURE_UNITS.FAHRENHEIT}>°F</option>
                <option value={TEMPERATURE_UNITS.KELVIN}>K</option>
            </select>
        </label>
    );
}
