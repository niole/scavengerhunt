export type Team = {
    huntId: string;
    name: string;
    id: string;
    place: number;
    nextClue: number;
};

export type TeamUpdate = {
    teamId: string;
    name?: string;
};
