import { ClueUpdate, Clue } from '../domain/Clue';
import { InProgressClue } from '../domain/InProgressClue';

// TODO delete
let clues: Clue[] = [];
// TODO delete
let inProgressClues: InProgressClue[] = [];

type ClueService = {
  createClue: (text: string, huntId: string, creatorId: string) => Clue;

  deleteClue: (clueId: string) => void;

  solveClue: (clueId: string) => void;

  startClue: (clueId: string, teamId: string) => void;

  isClueInProgress: (clueId: string, teamId: string) => boolean;

  getInProgressClue: (teamId: string) => undefined | InProgressClue;

  updateClue: (update: ClueUpdate) => undefined | Clue;

  getClues: (huntId: string) => Clue[];
};

const DefaultClueService: ClueService = {
  createClue: (text: string, huntId: string, creatorId: string, assetUri?: string) => {
    const newClue = {
      text,
      huntId,
      creatorId,
      assetUri,
      id: `${Math.random()}`,
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
};

export default DefaultClueService;
