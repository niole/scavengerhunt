import { LatLng } from './LatLng';

export type Hunt = {
    startLocation: LatLng;
    name: string;
    creatorId: string;
    id: string;
    inProgress: boolean;
    ended: boolean;
    createdAt: Date;
};
