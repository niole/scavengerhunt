import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { LatLng } from '../domain/LatLng';
import { ClueUpdate, Clue } from '../domain/Clue';
import { InProgressClue } from '../domain/InProgressClue';
import { getOne, getMany, refUtil } from './DatabaseService';

const clueRef = refUtil('clues');

const inProgressClueRef = refUtil('inprogressclues');

type ClueService = {
  createClue: (
    location: LatLng,
    text: string,
    huntId: string,
    creatorId: string,
    clueNumber: number,
    assetUri?: string,
  ) => Promise<Clue>;

  deleteClue: (clueId: string) => Promise<void>;

  solveClue: (clueId: string) => Promise<void>;

  startClue: (clueId: string, teamId: string) => Promise<void>;

  getInProgressClue: (teamId: string) => Promise<undefined | InProgressClue>;

  updateClue: (update: ClueUpdate) => Promise<undefined | Clue>;

  getClues: (huntId: string) => Promise<Clue[]>;

  getClue: (clueId: string) => Promise<Clue | undefined>;

  getClueByNumber: (huntId: string, rank: number) => Promise<Clue | undefined>;

  setInProgressClue: (clueId: string, teamId: string) => Promise<void>;
};

const getInProgressClueSnapshotByClueId = (clueId: string): Promise<firebase.database.DataSnapshot> =>
  inProgressClueRef().orderByChild('clueId').equalTo(clueId).once('value');

const DefaultClueService: ClueService = {
  createClue: (
      location: LatLng,
      text: string,
      huntId: string,
      creatorId: string,
      clueNumber: number,
      assetUri?: string,
    ) => {
    const id = uuid();
    const newClue = {
      number: clueNumber,
      text,
      huntId,
      creatorId,
      id,
      location,
      assetUri,
    };

    if (!assetUri) {
      delete newClue.assetUri;
    }

    return clueRef(id).set(newClue).then(() => newClue);
  },

  deleteClue: (clueId: string) => {
    return clueRef(clueId).remove().then(() => {
      return getInProgressClueSnapshotByClueId(clueId).then(x => x.ref.remove());
    });
  },

  solveClue: (clueId: string) => {
    return getInProgressClueSnapshotByClueId(clueId).then(x => x.ref.update({ solved: true }));
  },

  startClue: (clueId: string, teamId: string) => {
    const id = uuid();
    const newInProgressClue = {
      id,
      clueId,
      solved: false,
      teamId,
    };

    return inProgressClueRef(clueId).set(newInProgressClue);
  },

  getInProgressClue: (teamId: string) => {
    return getOne<InProgressClue>(inProgressClueRef().orderByChild('teamId').equalTo(teamId));
  },

  updateClue: ({ clueId, ...rest }: ClueUpdate) => {
    return clueRef(clueId).update(rest);
  },

  getClues: (huntId: string) => {
    return getMany<Clue>(clueRef().orderByChild('huntId').equalTo(huntId));
  },

  getClue: (clueId: string) => {
    return getOne<Clue>(clueRef(clueId));
  },

  getClueByNumber: (huntId: string, rank: number) => {
    return clueRef()
    .orderByChild('huntId')
    .equalTo(huntId)
    .once('value')
    .then(clues => {
      return getMany<Clue>(clues.ref.orderByChild('number').equalTo(rank));
    })
    .then(clues => clues[0]);
  },

  setInProgressClue: (clueId: string, teamId: string) => {
    return inProgressClueRef().orderByChild('teamId').equalTo(teamId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.ref.update({ clueId })
    );
  },
};

export default DefaultClueService;
