import {Visit} from "./Visit.ts";
import {Activity} from "./Activity.ts";

export interface DataItem {
    endTime: string;
    startTime: string;
    visit?: Visit;
    activity?: Activity;
}