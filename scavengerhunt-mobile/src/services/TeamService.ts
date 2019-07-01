import { Team, TeamUpdate } from '../domain/Team';
import { NewTeamMember, TeamMember } from '../domain/TeamMember';

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
    done: false,
}];

type TeamService = {
  setTeamSuccess: (teamId: string) => void;

  createTeam: (name: string, huntId: string) => Team;

  getTeams: (huntId: string) => Team[];

  getTeam: (name: string, huntId: string) => Team | undefined;

  getTeamById: (teamId: string) => Team | undefined;

  updateTeam: (update: TeamUpdate) => void;

  removeTeam: (teamId: string) => void;

  setTeamMembers: (teamId: string, teamMembers: NewTeamMember[]) => void;

  getTeamMembers: (teamId: string) => TeamMember[];

  removeTeamMember: (memberId: string) => void;

  updateTeamPlace: (teamId: string, place: number) => void;

  getTeamMember: (memberId: string) => TeamMember | undefined;

  getTeamMemberByEmail: (email: string) => TeamMember[];
};

const DefaultTeamService = {
  setTeamSuccess: (teamId: string) => {
    teams = teams.map((team: Team) => {
      if (team.id === teamId) {
        return {
          ...team,
          done: true,
        };
      }
      return team;
    })
  },

  createTeam: (name: string, huntId: string) => {
    const newTeam = {
      name,
      huntId,
      id: `${Math.random()}`,
      place: 0,
      done: false,
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

  setTeamMembers: (teamId: string, newTeamMembers: NewTeamMember[]) => {
    teamMembers = teamMembers.filter((member: TeamMember) => member.teamId !== teamId);
    teamMembers = [...teamMembers, ...newTeamMembers.map((newMember: NewTeamMember) => ({
      ...newMember,
      teamId,
      id: `${Math.random()}`,
    }))];
  },

  getTeamMembers: (teamId: string) => {
    return teamMembers.filter((member: TeamMember) => member.teamId === teamId);
  },

  removeTeam: (teamId: string) => {
    teams = teams.filter((team: Team) => team.id !== teamId);
    teamMembers = teamMembers.filter((tm: TeamMember) => tm.teamId !== teamId);
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

  getTeamMember: (memberId: string) => {
    return teamMembers.find(({ id }: TeamMember) => id === memberId);
  },

  getTeamById: (teamId: string) => {
    return teams.find(({ id }: Team) => id === teamId);
  },

  getTeamMemberByEmail: (email: string) => {
    return teamMembers.filter((member: TeamMember) => member.email === email);
  },

};

export default DefaultTeamService;
