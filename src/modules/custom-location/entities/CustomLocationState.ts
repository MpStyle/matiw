import {CustomLocation} from "./CustomLocation.ts";

export interface CustomLocationState {
    data: { [placeLocation: string]: CustomLocation }
}