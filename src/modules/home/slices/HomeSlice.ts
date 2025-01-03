import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {DataItem} from "../entities/DataItem.tsx";
import {HomeFiltersState, HomeState} from "../entities/HomeState.ts";

export const initialHomeState: HomeState = {
    data: [],

    years: [],
    months: [],
    days: [],

    filters: {
        startDate: '',
        endDate: '',

        year: '',
        month: '',
        day: '',
    }
}

export const homeSlice = createSlice({
    name: 'data',
    initialState: initialHomeState,
    reducers: {
        storeData: (state, action: PayloadAction<DataItem[]>) => {
            state.data = action.payload;

            const uniqueYears = new Set<string>();
            const uniqueMonths = new Set<string>();
            const uniqueDays = new Set<string>();

            action.payload.forEach((item: DataItem) => {
                const date = new Date(item.startTime);
                uniqueYears.add(date.getFullYear().toString());
                uniqueMonths.add((date.getMonth() + 1).toString());
                uniqueDays.add(date.getDate().toString());
            });

            state.years = Array.from(uniqueYears).sort();
            state.months = Array.from(uniqueMonths).sort((a, b) => parseInt(a) - parseInt(b));
            state.days = Array.from(uniqueDays).sort((a, b) => parseInt(a) - parseInt(b));
        },
        clearData: (state) => {
            state.data = [];
        },
        resetFilters: (state) => {
            state.filters.startDate = initialHomeState.filters.startDate;
            state.filters.endDate = initialHomeState.filters.endDate;
            state.filters.year = initialHomeState.filters.year;
            state.filters.month = initialHomeState.filters.month;
            state.filters.day = initialHomeState.filters.day;
        },
        setFilters: (state, action: PayloadAction<HomeFiltersState>) => {
            state.filters = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    storeData,
    clearData,
    resetFilters,
    setFilters
} = homeSlice.actions

export default homeSlice.reducer