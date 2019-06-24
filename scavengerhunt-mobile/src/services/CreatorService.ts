import { Creator } from '../domain/Creator';

let creators: Creator[] =  [];

type CreatorService = {
  createCreator: (email: string, name: string) => Creator;

  getCreator: (creatorId: string) => Creator | undefined;
};

const DefaultCreatorService: CreatorService = {
  createCreator: (email: string, name: string) => {
    const newCreator = {
      email,
      name,
      id: `${Math.random()}`,
    };

    creators.push(newCreator);

    return newCreator;
  },

  getCreator: (creatorId: string) => creators.find(({ id }) => id === creatorId),
};

export default DefaultCreatorService;
