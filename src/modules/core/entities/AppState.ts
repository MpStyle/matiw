import {HomeState} from "../../home/entities/HomeState.ts";
import {SettingsState} from "../../settings/entities/SettingsState.ts";
import {FiltersState} from "../../filters/entities/SettingsState.ts";

export interface AppState{
    home: HomeState;
    filters: FiltersState;
    settings: SettingsState;
}