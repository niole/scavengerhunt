export type LatLng = [number, number];

export type Clue = {
    text: string;
    id: string;
    creatorId: string;
    huntId: string;
    assetUri?: string;
    location: LatLng;
};

export type ClueUpdate = {
    text?: string;
    assetUri?: string;
    clueId: string;
    location?: LatLng;
};
