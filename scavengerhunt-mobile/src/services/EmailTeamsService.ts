import email from 'react-native-email'
import { TeamMember } from '../domain/TeamMember';
import { Team } from '../domain/Team';
import HuntService from './HuntService';
import TeamService from './TeamService';
import CreatorService from './CreatorService';

type EmailTeamsService = {
  emailTeams: (huntId: string) => Promise<any[]>;
};

const DefaultEmailTeamsService: EmailTeamsService = {
  emailTeams: async (huntId: string) => {
    const hunt = HuntService.getHunt(huntId);
    const creator = CreatorService.getCreatorById(hunt.creatorId);
    const teams = TeamService.getTeams(huntId);

    return Promise.all(teams.map((team: Team) => {
      const teamMembers = TeamService.getTeamMembers(team.id);
      const toAddresses = teamMembers.map((member: TeamMember) => member.email);
      return email(toAddresses, {
          subject: `${creator.name} is inviting you to a Scavenger Hunt!`,
          body: `
            You've been invited to play ${creator.name}'s Scavenger Hunt: ${hunt.name}.
            Click the link to join your team, ${team.name}.

            Your team mates, ${teamMembers.map((member: TeamMember) => member.name).join(', ')} are waiting.
          `
      });
    }));
  },
};

export default DefaultEmailTeamsService;
