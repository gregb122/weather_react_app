import {TEMPERATURE_UNITS} from '../constants/temperatureUnits';

const round1 = value => Math.round(value * 10) / 10;

export const convertTemperature = (tempC, units) => {
    switch (units) {
        case TEMPERATURE_UNITS.FAHRENHEIT:
            return round1(tempC * (9 / 5) + 32);
        case TEMPERATURE_UNITS.KELVIN:
            return round1(tempC + 273.15);
        case TEMPERATURE_UNITS.CELSIUS:
        default:
            return round1(tempC);
    }
};

export const getUnitSuffix = units => {
    switch (units) {
        case TEMPERATURE_UNITS.FAHRENHEIT:
            return '°F';
        case TEMPERATURE_UNITS.KELVIN:
            return 'K';
        case TEMPERATURE_UNITS.CELSIUS:
        default:
            return '°C';
    }
};

export const formatTemperature = (tempC, units) =>
    `${convertTemperature(tempC, units)}${getUnitSuffix(units)}`;
