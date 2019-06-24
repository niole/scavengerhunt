import { LatLng } from '../domain/LatLng';
import { ClueUpdate, Clue } from '../domain/Clue';
import { InProgressClue } from '../domain/InProgressClue';

// TODO delete
let clues: Clue[] = [
  {
    text: 'This is a clue.',
    id: 'cluid',
    creatorId: 'x',
    huntId: 'huntidy',
    assetUri: undefined,
    location: [0, 0],
    number: 0,
  },
  {
    text: 'This is another  clue.',
    id: 'cluid2',
    creatorId: 'x',
    huntId: 'huntidy',
    assetUri: undefined,
    location: [0, 0],
    number: 1,
  },
];
// TODO delete
let inProgressClues: InProgressClue[] = [];

type ClueService = {
  createClue: (
    location: LatLng,
    text: string,
    huntId: string,
    creatorId: string,
    clueNumber: number,
    assetUri?: string,
  ) => Clue;

  deleteClue: (clueId: string) => void;

  solveClue: (clueId: string) => void;

  startClue: (clueId: string, teamId: string) => void;

  isClueInProgress: (clueId: string, teamId: string) => boolean;

  getInProgressClue: (teamId: string) => undefined | InProgressClue;

  updateClue: (update: ClueUpdate) => undefined | Clue;

  getClues: (huntId: string) => Clue[];

  getClue: (clueId: string) => Clue | undefined;

  getClueByNumber: (huntId: string, rank: number) => Clue | undefined;

  setInProgressClue: (clueId: string, teamId: string) => void;
};

const DefaultClueService: ClueService = {
  createClue: (
      location: LatLng,
      text: string,
      huntId: string,
      creatorId: string,
      clueNumber: number,
      assetUri?: string,
    ) => {
    const newClue = {
      number: clueNumber,
      text,
      huntId,
      creatorId,
      assetUri,
      id: `${Math.random()}`,
      location,
    };

    clues.push(newClue);

    return newClue;
  },

  deleteClue: (clueId: string) => {
    clues = clues.filter(({ id }: Clue) => id !== clueId);
    inProgressClues = inProgressClues.filter((clue: InProgressClue) => clue.clueId !== clueId);
  },

  solveClue: (clueId: string) => {
    inProgressClues = inProgressClues.map((clue: InProgressClue) => {
      if (clue.clueId === clueId) {
        return {...clue, solved: true };
      }
      return clue;
    });
  },

  startClue: (clueId: string, teamId: string) => {
    const newInProgressClue = {
        clueId,
        solved: false,
        teamId,
    };

    inProgressClues.push(newInProgressClue);
  },

  isClueInProgress: (clueId: string, teamId: string) => {
    const found = inProgressClues.find((clue: InProgressClue) => teamId === clue.teamId && clueId === clue.clueId);
    return !!found;
  },

  getInProgressClue: (teamId: string) =>
    inProgressClues.find((clue: InProgressClue) => teamId === clue.teamId),

  updateClue: ({ clueId, ...rest }: ClueUpdate) => {
      const foundClue = clues.find(({ id }) => id === clueId);
      if (foundClue) {
        const newClue = {...foundClue, ...rest };
        clues = clues.map((clue: Clue) => {
          if (clue.id === clueId) {
            return newClue;
          }
          return clue;
        });
        return newClue;
      }
      return;
  },

  getClues: (huntId: string) => {
    return clues.filter((clue: Clue) => clue.huntId === huntId);
  },

  getClue: (clueId: string) => clues.find(({ id }: Clue) => id === clueId),

  getClueByNumber: (huntId: string, rank: number) => {
    return clues.find((clue: Clue) => clue.huntId === huntId && rank === clue.number);
  },

  setInProgressClue: (clueId: string, teamId: string) => {
    inProgressClues = inProgressClues.map((clue: InProgressClue) => {
       if (clue.teamId === teamId) {
         return {
           ...clue,
           clueId,
         };
       }
       return clue;
    });
  },
};

export default DefaultClueService;
