export type Clue = {
    text: string;
    id: string;
    creatorId: string;
    huntId: string;
    assetUri?: string;
};

export type ClueUpdate = {
    text?: string;
    assetUri?: string;
    clueId: string;
};
