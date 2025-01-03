import {DataItem} from "./DataItem.tsx";

export interface HomeState {
    data: DataItem[];

    years: string[];
    months: string[];
    days: string[];
}