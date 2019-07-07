import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { LatLng } from '../domain/LatLng';
import { Hunt } from '../domain/Hunt';
import { refUtil, getMany, getOne } from './DatabaseService';
import TeamService from './TeamService';

const huntsRef = refUtil('hunts');

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
    return getMany<Hunt>(huntsRef()
    .orderByChild('creatorId')
    .equalTo(creatorId));
  },

  getHunt: (huntId: string) => {
    return getOne<Hunt>(huntsRef(huntId));
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

    return huntsRef(id).set(newHunt).then(() => newHunt);
  },

  deleteHunt: (huntId: string) => {
    return huntsRef(huntId).remove().then(() => {
      // TODO throwing errors away here...
      TeamService.getTeams(huntId).then(teams =>
       teams.forEach(({ id }) =>
        TeamService.removeTeam(id).then(() => {
          return TeamService.removeTeamMembers(id);
        })
      ));
    })
  },

  startHunt: (huntId: string) => {
    return huntsRef(huntId).update({ inProgress: true });
  },

  stopHunt: (huntId: string) => {
    return huntsRef(huntId).update({ inProgress: false });
  },

  endHunt: (huntId: string) => {
    return huntsRef(huntId).update({ inProgress: false, ended: true  });
  },

};

export default DefaultHuntService;
