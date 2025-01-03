import {Visit} from "./Visit.tsx";
import {Activity} from "./Activity.tsx";

export interface DataItem {
    endTime: string;
    startTime: string;
    visit?: Visit;
    activity?: Activity;
}