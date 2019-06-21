import { Hunt } from '../domain/Hunt';

type HuntService = {
  getAllHunts: (creatorId: string) => Hunt[];

  getHunt: (huntId: string) => Hunt | undefined;

  createHunt: (name: string, creatorId: string) => Hunt;

  deleteHunt: (huntId: string) => void;

  startHunt: (huntId: string) => void;

  stopHunt: (huntId: string) => void;

  endHunt: (huntId: string) => void;
};

// TODO replace with mongo
let hunts: Hunt[] = [{
    name: 'another hunt',
    creatorId: 'x',
    id: 'huntidy',
    inProgress: false,
    ended: false,
    createdAt: new Date(),
}];

const DefaultHuntService: HuntService = {
  getAllHunts: (creatorId: string) => {
    return hunts.filter((hunt: Hunt) => hunt.creatorId === creatorId);
  },

  getHunt: (huntId: string) => hunts.find((hunt: Hunt) => hunt.id === huntId),

  createHunt: (name: string, creatorId: string) => {
    const newHunt = {
      name,
      creatorId,
      id: `${Math.random()}`,
      inProgress: false,
      ended: false,
      createdAt: new Date(),
    };

    hunts.push(newHunt);

    return newHunt;
  },

  deleteHunt: (huntId: string) => {
    hunts = hunts.filter((hunt: Hunt) => hunt.id !== huntId);
  },

  startHunt: (huntId: string) => {
    hunts = hunts.map((hunt: Hunt) => {
      if (hunt.id === huntId) {
        return { ...hunt, inProgress: true };
      }
      return hunt;
    });
  },

  stopHunt: (huntId: string) => {
    hunts = hunts.map((hunt: Hunt) => {
      if (hunt.id === huntId) {
        return { ...hunt, inProgress: false };
      }
      return hunt;
    });
  },

  endHunt: (huntId: string) => {
    hunts = hunts.map((hunt: Hunt) => {
      if (hunt.id === huntId) {
        return { ...hunt, inProgress: false, ended: true };
      }
      return hunt;
    });
  },

};

export default DefaultHuntService;
