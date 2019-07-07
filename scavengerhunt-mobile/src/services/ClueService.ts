import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { LatLng } from '../domain/LatLng';
import { ClueUpdate, Clue } from '../domain/Clue';
import { InProgressClue } from '../domain/InProgressClue';
import { refUtil } from './DatabaseService';

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
      assetUri,
      id,
      location,
    };

    return clueRef(id).set(newClue).then(x => x.val());
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
    return inProgressClueRef().orderByChild('teamId').equalTo(teamId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val()
    );
  },

  updateClue: ({ clueId, ...rest }: ClueUpdate) => {
    return clueRef(clueId).update(rest);
  },

  getClues: (huntId: string) => {
    return clueRef().orderByChild('huntId').equalTo(huntId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val()
    );
  },

  getClue: (clueId: string) => {
    return clueRef(clueId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val()
    );
  },

  getClueByNumber: (huntId: string, rank: number) => {
    return clueRef()
    .orderByChild('huntId').equalTo(huntId)
    .orderByChild('number').equalTo(rank)
    .once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val()
    );
  },

  setInProgressClue: (clueId: string, teamId: string) => {
    return inProgressClueRef().orderByChild('teamId').equalTo(teamId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.ref.update({ clueId })
    );
  },
};

export default DefaultClueService;
