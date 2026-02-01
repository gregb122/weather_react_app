import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchFavorites as fetchFavoritesApi, toggleFavorite as toggleFavoriteApi} from '../api/favoritesApi';

const initialState = {
    cities: [],
    status: 'idle',
    error: null,
};

export const fetchFavorites = createAsyncThunk(
    'favorites/fetch',
    async (_, {rejectWithValue}) => {
        try {
            return await fetchFavoritesApi();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const toggleFavoriteRemote = createAsyncThunk(
    'favorites/toggleRemote',
    async (cityId, {rejectWithValue}) => {
        try {
            return await toggleFavoriteApi(cityId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const applyFavoriteUpdate = (state, cityId, isFavorite) => {
    if (isFavorite) {
        if (!state.cities.includes(cityId)) {
            state.cities.push(cityId);
        }
    } else {
        state.cities = state.cities.filter(id => id !== cityId);
    }
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites(state) {
            state.cities = [];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFavorites.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cities = Array.isArray(action.payload?.cities)
                    ? action.payload.cities
                    : [];
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error?.message || 'Failed to load favorites';
            })
            .addCase(toggleFavoriteRemote.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                const {cityId, isFavorite} = action.payload || {};
                if (cityId) {
                    applyFavoriteUpdate(state, cityId, isFavorite);
                }
            })
            .addCase(toggleFavoriteRemote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error?.message || 'Failed to update favorite';
            });
    },
});

export const {clearFavorites} = favoritesSlice.actions;

export const selectFavoriteCities = state => state.favorites.cities;
export const selectFavoritesStatus = state => state.favorites.status;
export const selectFavoritesError = state => state.favorites.error;
export const selectIsFavorite =
    cityId =>
    state =>
        state.favorites.cities.includes(cityId);

export const favoritesReducer = favoritesSlice.reducer;
