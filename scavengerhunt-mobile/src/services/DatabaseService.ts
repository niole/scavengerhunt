import * as firebase from 'firebase';

export const refUtil = (collectionName: string) => (id?: string): firebase.database.Reference => {
  const db = firebase.database();
  if (id) {
    return db.ref(`${collectionName}/${id}`);
  }
  return db.ref(collectionName);
};

export function getOne<D>(query: firebase.database.Query): Promise<D | undefined> {
  return query.once('value').then(
    (dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.val() as D
  );
}

export function getMany<D>(query: firebase.database.Query): Promise<D[]> {
  return query.once('value').then((dataSnapshot: firebase.database.DataSnapshot) => {
    const data = dataSnapshot.val();
    if (data) {
      return Object.values(data) as D[];
    }
    return [] as D[];
  });
}

const firebaseConfig = {
  apiKey: process.env["FIRE_BASE_API_KEY"],
  authDomain: process.env["FIRE_BASE_AUTH_DOMAIN"],
  databaseURL: process.env["FIRE_BASE_DB_URL"],
  projectId: process.env["FIRE_BASE_PROJECT_ID"],
  storageBucket: process.env["FIRE_BASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["FIRE_BASE_MESSAGING_SENDER_ID"],
  appID: process.env["FIRE_BASE_APP_ID"],
};

firebase.initializeApp(firebaseConfig);
