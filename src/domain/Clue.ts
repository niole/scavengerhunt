import { LatLng } from './LatLng';

export type Clue = {
    number: number;
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
