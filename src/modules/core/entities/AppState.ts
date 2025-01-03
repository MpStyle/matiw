import {HomeState} from "../../home/entities/HomeState.ts";
import {SettingsState} from "../../settings/entities/SettingsState.ts";

export interface AppState{
    home: HomeState;
    settings: SettingsState;
}