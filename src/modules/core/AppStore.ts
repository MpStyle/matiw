import { configureStore } from '@reduxjs/toolkit'
import {homeSlice} from "../home/slices/HomeSlice.ts";
import {settingsSlice} from "../settings/slices/SettingsSlice.ts";
import {filtersSlice} from "../filters/slices/FiltersSlice.ts";

export const store = configureStore({
    reducer: {
        home: homeSlice.reducer,
        filters: filtersSlice.reducer,
        settings: settingsSlice.reducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch