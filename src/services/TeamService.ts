import { Team, TeamUpdate } from '../domain/Team';
import { TeamMember } from '../domain/TeamMember';

let teamMembers: TeamMember[] = [{
    email: 'niolenelson@gmail.com',
    name: 'niole',
    id: 'nioleid',
    teamId: 'nioleteamid',
}];
let teams: Team[] = [{
    huntId: 'huntidy',
    name: 'TeamNiole',
    id: 'nioleteamid',
    place: 0,
    nextClue: -1,
}];

type TeamService = {
  createTeam: (name: string, huntId: string) => Team;

  getTeams: (huntId: string) => Team[];

  getTeam: (name: string, huntId: string) => Team | undefined;

  getTeamById: (teamId: string) => Team | undefined;

  updateTeam: (update: TeamUpdate) => void;

  addTeamMembers: (teamMembers: TeamMember[]) => void;

  getTeamMembers: (teamId: string) => TeamMember[];

  removeTeamMember: (memberId: string) => void;

  updateTeamPlace: (teamId: string, place: number) => void;

  updateNextClue: (teamId: string, nextClueNumber: number) => void;

  getTeamMember: (memberId: string) => TeamMember | undefined;
};

const DefaultTeamService = {
  createTeam: (name: string, huntId: string) => {
    const newTeam = {
      name,
      huntId,
      id: `${Math.random()}`,
      place: 0,
      nextClue: -1,
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

  updateTeamPlace: (teamId: string, place: number) => {
    teams = teams.map((team: Team) => {
      if (teamId === team.id) {
        return { ...team, place };
      }
      return team;
    });
  },

  updateNextClue: (teamId: string, nextClueNumber: number) => {
    teams = teams.map((team: Team) => {
      if (teamId === team.id) {
        return { ...team, nextClue: nextClueNumber };
      }
      return team;
    });
  },

  getTeamMember: (memberId: string) => {
    return teamMembers.find(({ id }: TeamMember) => id === memberId);
  },

  getTeamById: (teamId: string) => {
    return teams.find(({ id }: Team) => id === teamId);
  },

};

export default DefaultTeamService;
