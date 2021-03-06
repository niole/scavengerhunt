import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { Team, TeamUpdate } from '../domain/Team';
import { NewTeamMember, TeamMember } from '../domain/TeamMember';
import { getMany, getOne, refUtil } from './DatabaseService';

const TEAM_COLLECTION = 'teams';

const TEAM_MEMBER_COLLECTION = 'teammembers';

type TeamService = {
  setTeamSuccess: (teamId: string) => Promise<void>;

  createTeam: (name: string, huntId: string) => Promise<Team>;

  getTeams: (huntId: string) => Promise<Team[]>;

  removeTeamMembers: (teamId: string) => Promise<void>;

  getTeamById: (teamId: string) => Promise<Team | undefined>;

  updateTeam: (update: TeamUpdate) => Promise<void>;

  removeTeam: (teamId: string) => Promise<void>;

  setTeamMembers: (teamId: string, teamMembers: NewTeamMember[]) => Promise<void>;

  getTeamMembers: (teamId: string) => Promise<TeamMember[]>;

  removeTeamMember: (memberId: string) => Promise<void>;

  updateTeamPlace: (teamId: string, place: number) => Promise<void>;

  getTeamMember: (memberId: string) => Promise<TeamMember | undefined>;

  getTeamMembersByEmail: (email: string) => Promise<TeamMember[]>;
};

const teamRef = refUtil(TEAM_COLLECTION);

const teamMemberRef = refUtil(TEAM_MEMBER_COLLECTION);

const DefaultTeamService = {
  setTeamSuccess: (teamId: string) => {
    return teamRef(teamId).update({ done: true });
  },

  createTeam: (name: string, huntId: string) => {
    const id = uuid();
    const newTeam = {
      name,
      huntId,
      id,
      place: 0,
      done: false,
    };

    return teamRef(id).set(newTeam).then(() => newTeam);
  },

  getTeams: (huntId: string) => {
    return getMany<Team>(teamRef().orderByChild('huntId').equalTo(huntId));
  },

  removeTeamMembers: (teamId: string) => {
    return teamMemberRef().orderByChild('teamId').equalTo(teamId).once('value').then(
        (snapshots: firebase.database.DataSnapshot) => snapshots.ref.remove()
    )
  },

  updateTeam: (update: TeamUpdate) => {
    if (update.name) {
      return teamRef(update.teamId).update({ name: update.name });
    }
  },

  setTeamMembers: (teamId: string, newTeamMembers: NewTeamMember[]) => {
    return teamMemberRef().orderByChild('teamId').equalTo(teamId).once('value').then(
      tms => tms.ref.remove()
    ).then(() => {
      const augmentedNewTeamMembers = newTeamMembers.map((tm: NewTeamMember) => ({
        ...tm,
        id: uuid(),
        teamId,
      }));
      return augmentedNewTeamMembers.map((tm: TeamMember) => {
        return teamMemberRef(tm.id).update(tm);
      });
    });
  },

  getTeamMembers: (teamId: string) => {
    return getMany<TeamMember>(teamMemberRef().orderByChild('teamId').equalTo(teamId));
  },

  removeTeam: (teamId: string) => {
    return teamRef(teamId).remove()
    .then(() => {
      return teamMemberRef().orderByChild('teamId').equalTo(teamId).once('value')
      .then((dataSnapshot: firebase.database.DataSnapshot) => dataSnapshot.ref.remove());
    });
  },

  removeTeamMember: (memberId: string) => {
    return teamMemberRef(memberId).remove();
  },

  updateTeamPlace: (teamId: string, place: number) => {
    return teamRef(teamId).update({ place });
  },

  getTeamMember: (memberId: string) => {
    return getOne<TeamMember>(teamMemberRef(memberId));
  },

  getTeamById: (teamId: string) => {
    return getOne<Team>(teamRef(teamId));
  },

  getTeamMembersByEmail: (email: string) => {
    return getMany<TeamMember>(teamMemberRef().orderByChild('email').equalTo(email));
  },

};

export default DefaultTeamService;
