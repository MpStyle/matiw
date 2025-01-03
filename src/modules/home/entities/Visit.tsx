export interface Visit {
    hierarchyLevel: string;
    topCandidate: {
        probability: string;
        semanticType: string;
        placeID: string;
        placeLocation: string;
    };
    probability: string;
}