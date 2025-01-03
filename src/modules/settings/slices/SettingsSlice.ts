import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SettingsState} from "../entities/SettingsState.ts";

export const initialSettingsState: SettingsState = {
    dateTimeFormat: 'DD/MM/YYYY HH:mm'
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        setDateTimeFormat: (state, action: PayloadAction<string>) => {
            state.dateTimeFormat = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setDateTimeFormat
} = settingsSlice.actions

export default settingsSlice.reducer