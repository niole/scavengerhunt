import { Creator } from '../domain/Creator';
import * as firebase from 'firebase';

type CreatorService = {
  createCreator: (email: string, name: string, authId: string) => Promise<Creator>;

  getCreator: (email: string) => Promise<Creator | undefined>;

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

  getCreator: (email: string) => {
    return firebase.database()
      .ref('creators')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then((dataSnapshot: firebase.database.DataSnapshot) => {
        return Object.values(dataSnapshot.val())[0] as Creator;
      });
  },

  getCreatorById: (id: string) => {
    return firebase.database()
    .ref('creators')
    .orderByChild('id')
    .equalTo(id)
    .once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) => {
      return Object.values(dataSnapshot.val())[0] as Creator;
    });
  },
};

export default DefaultCreatorService;
