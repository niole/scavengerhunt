import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { LatLng } from '../domain/LatLng';
import { Hunt } from '../domain/Hunt';

type HuntService = {
  getAllHunts: (creatorId: string) => Promise<Hunt[]>;

  getHunt: (huntId: string) => Promise<Hunt | undefined>;

  createHunt: (name: string, creatorId: string, startLocation: LatLng) => Promise<Hunt>;

  deleteHunt: (huntId: string) => Promise<void>;

  startHunt: (huntId: string) => Promise<void>;

  stopHunt: (huntId: string) => Promise<void>;

  endHunt: (huntId: string) => Promise<void>;
};

const DefaultHuntService: HuntService = {
  getAllHunts: (creatorId: string) => {
    return firebase.database()
    .ref('hunts')
    .orderByChild('creatorId')
    .equalTo(creatorId)
    .once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) => {
      console.log(dataSnapshot)
      return Object.values(dataSnapshot.val());
    });
  },

  getHunt: (huntId: string) => {
    return firebase.database().ref(`hunts/${huntId}`).once('value').then(x => x.val());
  },

  createHunt: async (name: string, creatorId: string, startLocation: LatLng) => {
    const id = uuid();
    const newHunt = {
      startLocation,
      name,
      creatorId,
      id,
      inProgress: false,
      ended: false,
      createdAt: new Date(),
    };

    return firebase.database().ref(`hunt/${id}`).set(newHunt).then(() => newHunt);
  },

  deleteHunt: (huntId: string) => {
    return firebase.database().ref(`hunts/${huntId}`).remove();
  },

  startHunt: (huntId: string) => {
    return firebase.database().ref(`hunts/${huntId}`).update({ inProgress: true });
  },

  stopHunt: (huntId: string) => {
    return firebase.database().ref(`hunts/${huntId}`).update({ inProgress: false });
  },

  endHunt: (huntId: string) => {
    return firebase.database().ref(`hunts/${huntId}`).update({ inProgress: false, ended: true  });
  },

};

export default DefaultHuntService;
