import { Team, TeamUpdate } from '../domain/Team';
import { TeamMember } from '../domain/TeamMember';

let teamMembers: TeamMember[] = [];
let teams: Team[] = [];

type TeamService = {
  createTeam: (name: string, huntId: string) => Team;

  getTeams: (huntId: string) => Team[];

  getTeam: (name: string, huntId: string) => Team | undefined;

  updateTeam: (update: TeamUpdate) => void;

  addTeamMembers: (teamMembers: TeamMember[]) => void;

  getTeamMembers: (teamId: string) => TeamMember[];

  removeTeamMember: (memberId: string) => void;
};

const DefaultTeamService = {
  createTeam: (name: string, huntId: string) => {
    const newTeam = {
      name,
      huntId,
      id: `${Math.random()}`,
      place: 0,
    };
    teams.push(newTeam);
    return newTeam;
  },

  getTeams: (huntId: string) => {
    return teams.filter((team: Team) => team.huntId === huntId);
  },

  getTeam: (name: string, huntId: string) => {
    return teams.find((team: Team) => team.name === name && team.huntId === huntId);
  },

  updateTeam: (update: TeamUpdate) => {
    teams = teams.map((team: Team) => {
      if (team.id === update.teamId) {
        return {
          ...team,
          name: update.name || team.name,
          place: update.place || team.place,
        };
      }
      return team;
    });
  },

  addTeamMembers: (newTeamMembers: TeamMember[]) => {
    teamMembers = [...teamMembers, ...newTeamMembers];
  },

  getTeamMembers: (teamId: string) => {
    return teamMembers.filter((member: TeamMember) => member.id === teamId);
  },

  removeTeamMember: (memberId: string) => {
    teamMembers = teamMembers.filter((member: TeamMember) => member.id !== memberId);
  },

};

export default DefaultTeamService;
