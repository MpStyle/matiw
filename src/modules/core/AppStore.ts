import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {homeSlice} from "../home/slices/HomeSlice.ts";
import {settingsSlice} from "../settings/slices/SettingsSlice.ts";
import {filtersSlice} from "../filters/slices/FiltersSlice.ts";
import {customLocationSlice} from "../custom-location/slices/CustomLocationSlice.ts";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {persistReducer, persistStore} from 'redux-persist'
import {AppState} from "./entities/AppState.ts";

const persistConfig = {
    key: "matiw",
    storage,
    whitelist: ["settings", "customLocations"]
};

const persistedReducer = persistReducer<AppState>(persistConfig, combineReducers({
    home: homeSlice.reducer,
    filters: filtersSlice.reducer,
    settings: settingsSlice.reducer,
    customLocations: customLocationSlice.reducer
}));
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);