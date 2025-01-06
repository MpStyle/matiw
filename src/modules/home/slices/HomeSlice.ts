import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {DataItem} from "../entities/DataItem.ts";
import {HomeState} from "../entities/HomeState.ts";

export const initialHomeState: HomeState = {
    data: [],

    years: [],
    months: [],
    days: [],
}

export const homeSlice = createSlice({
    name: 'home',
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
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    storeData
} = homeSlice.actions

export default homeSlice.reducer