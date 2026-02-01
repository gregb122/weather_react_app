import {combineSlices, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import {weatherSlice} from './slices/weatherSlice';
import {favoritesSlice} from './slices/favoritesSlice';
import {TEMPERATURE_UNITS} from './constants/temperatureUnits';

const STORAGE_KEY = 'weatherAppState';

const loadState = () => {
    if (typeof localStorage === 'undefined') {
        return undefined;
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return undefined;
        const parsed = JSON.parse(stored);
        const preloaded = {};

        if (TEMPERATURE_UNITS.isValid(parsed?.weather?.temperatureUnits)) {
            preloaded.weather = {temperatureUnits: parsed.weather.temperatureUnits};
        }

        return Object.keys(preloaded).length > 0 ? preloaded : undefined;
    } catch {
        return undefined;
    }
};

const rootReducer = combineSlices(weatherSlice, favoritesSlice);

const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState(),
    middleware(getDefaultMiddleware) {
        return process.env.NODE_ENV === 'development'
            ? getDefaultMiddleware().concat(logger)
            : getDefaultMiddleware();
    },
});

if (typeof localStorage !== 'undefined') {
    store.subscribe(() => {
        const state = store.getState();
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    weather: {temperatureUnits: state.weather?.temperatureUnits},
                }),
            );
        } catch {
            // Ignore storage write failures (private mode, quota, etc.).
        }
    });
}

setupListeners(store.dispatch);

export {store};
