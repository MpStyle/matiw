import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {FiltersState} from "../entities/SettingsState.ts";

export const initialFiltersState: FiltersState = {
    startDate: '',
    endDate: '',

    year: '',
    month: '',
    day: '',
}

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: initialFiltersState,
    reducers: {
        setFilters: (state, action: PayloadAction<FiltersState>) => {
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
            state.year = action.payload.year;
            state.month = action.payload.month;
            state.day = action.payload.day;
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setFilters
} = filtersSlice.actions

export default filtersSlice.reducer