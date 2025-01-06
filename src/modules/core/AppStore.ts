import {configureStore} from '@reduxjs/toolkit'
import {homeSlice} from "../home/slices/HomeSlice.ts";
import {settingsSlice} from "../settings/slices/SettingsSlice.ts";
import {filtersSlice} from "../filters/slices/FiltersSlice.ts";
import {customLocationSlice} from "../custom-location/slices/CustomLocationSlice.ts";
import {AppState} from "./entities/AppState.ts";

export const store = configureStore<AppState>({
    reducer: {
        home: homeSlice.reducer,
        filters: filtersSlice.reducer,
        settings: settingsSlice.reducer,
        customLocations: customLocationSlice.reducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch