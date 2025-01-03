import {DataItem} from "./DataItem.tsx";

export interface HomeState {
    data: DataItem[];

    years: string[];
    months: string[];
    days: string[];

    filters: HomeFiltersState
}

export interface HomeFiltersState {
    startDate: string;
    endDate: string;

    year: string;
    month: string;
    day: string;
}