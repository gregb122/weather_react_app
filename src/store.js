/* global process */
import {combineSlices, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import {weatherSlice} from './slices/weatherSlice';
import {favoritesSlice} from './slices/favoritesSlice';

const STORAGE_KEY = 'favoriteCities';

const loadFavorites = () => {
    if (typeof localStorage === 'undefined') {
        return undefined;
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : undefined;

        if (Array.isArray(parsed)) {
            return {
                favorites: {
                    cities: parsed,
                },
            };
        }
    } catch {
        // ignore malformed data and start fresh
    }
    return undefined;
};

const rootReducer = combineSlices(weatherSlice, favoritesSlice);

const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadFavorites(),
    middleware(getDefaultMiddleware) {
        return process.env.NODE_ENV === 'development'
            ? getDefaultMiddleware().concat(logger)
            : getDefaultMiddleware();
    },
});

if (typeof localStorage !== 'undefined') {
    store.subscribe(() => {
        const cities = store.getState().favorites?.cities ?? [];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
        } catch {
            // swallow write errors (e.g., storage quota)
        }
    });
}

setupListeners(store.dispatch);

export {store};
