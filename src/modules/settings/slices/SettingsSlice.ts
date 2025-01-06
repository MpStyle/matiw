import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SettingsState} from "../entities/SettingsState.ts";

export const initialSettingsState: SettingsState = {
    dateTimeFormat: 'DD/MM/YYYY HH:mm',
    dateFormat: 'DD/MM/YYYY',
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        setDateTimeFormat: (state, action: PayloadAction<string>) => {
            state.dateTimeFormat = action.payload;
        },
        setDateFormat: (state, action: PayloadAction<string>) => {
            state.dateFormat = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setDateTimeFormat,
    setDateFormat
} = settingsSlice.actions

export default settingsSlice.reducer