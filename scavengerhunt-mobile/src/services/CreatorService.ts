import { Creator } from '../domain/Creator';
import * as firebase from 'firebase';

type CreatorService = {
  createCreator: (email: string, name: string, authId: string) => Promise<Creator>;

  getCreatorById: (id: string) => Promise<Creator | undefined>;
};

const DefaultCreatorService: CreatorService = {
  createCreator: async (email: string, name: string, authId: string) => {
    const newCreator = {
      email,
      name,
      id: authId,
    };

    await firebase.database().ref(`creators/${authId}`).set(newCreator);

    return firebase.database()
      .ref(`creators/${authId}`)
      .once('value').then((dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val());
  },

  getCreatorById: (id: string) => {
    return firebase.database()
    .ref(`creators/${id}`)
    .once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val());
  },
};

export default DefaultCreatorService;
