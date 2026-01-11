import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cities: [],
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite(state, action) {
            const cityId = action.payload;
            const exists = state.cities.includes(cityId);
            state.cities = exists
                ? state.cities.filter(id => id !== cityId)
                : [...state.cities, cityId];
        },
        clearFavorites(state) {
            state.cities = [];
        },
    },
});

export const {toggleFavorite, clearFavorites} = favoritesSlice.actions;

export const selectFavoriteCities = state => state.favorites.cities;
export const selectIsFavorite =
    cityId =>
    state =>
        state.favorites.cities.includes(cityId);

export const favoritesReducer = favoritesSlice.reducer;
