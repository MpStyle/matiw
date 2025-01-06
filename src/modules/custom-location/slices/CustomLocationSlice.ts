import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CustomLocationState} from "../entities/CustomLocationState.ts";
import {CustomLocation} from "../entities/CustomLocation.ts";

export const initialCustomLocationState: CustomLocationState = {
    data: {}
}

export const customLocationSlice = createSlice({
    name: 'home',
    initialState: initialCustomLocationState,
    reducers: {
        addCustomLocation: (state, action: PayloadAction<{ placeLocation: string, customLocation: CustomLocation }>) => {
            state.data[action.payload.placeLocation] = action.payload.customLocation;
        },
        deleteCustomLocation: (state, action: PayloadAction<{ placeLocation: string }>) => {
            if (action.payload.placeLocation in state.data) {
                delete state.data[action.payload.placeLocation];
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    addCustomLocation,
    deleteCustomLocation
} = customLocationSlice.actions

export default customLocationSlice.reducer