export type Team = {
    huntId: string;
    name: string;
    id: string;
    place: number;
    lastSuccessfulSubmission?: Date;
    done: boolean;
};

export type TeamUpdate = {
    teamId: string;
    name?: string;
};
