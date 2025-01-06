import {DataItem} from "./DataItem.ts";

export interface HomeState {
    data: DataItem[];

    years: string[];
    months: string[];
    days: string[];
}