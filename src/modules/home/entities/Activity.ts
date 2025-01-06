export interface Activity {
    end: string;
    topCandidate: {
        type: string;
        probability: string;
    };
    distanceMeters: string;
    start: string;
}