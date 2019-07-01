import { Creator } from '../domain/Creator';

let creators: Creator[] =  [];

type CreatorService = {
  createCreator: (email: string, name: string) => Creator;

  getCreator: (email: string) => Creator | undefined;

  getCreatorById: (id: string) => Creator | undefined;
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

  getCreator: (email: string) => creators.find(creator => creator.email === email),

  getCreatorById: (id: string) => creators.find(creator => creator.id === id),
};

export default DefaultCreatorService;
