import * as firebase from 'firebase';
import uuid from 'uuid/v1';
import { Team, TeamUpdate } from '../domain/Team';
import { NewTeamMember, TeamMember } from '../domain/TeamMember';
import { refUtil } from './DatabaseService';

const TEAM_COLLECTION = 'teams';

const TEAM_MEMBER_COLLECTION = 'teammembers';

type TeamService = {
  setTeamSuccess: (teamId: string) => Promise<void>;

  createTeam: (name: string, huntId: string) => Promise<Team>;

  getTeams: (huntId: string) => Promise<Team[]>;

  getTeam: (name: string, huntId: string) => Promise<Team | undefined>;

  getTeamById: (teamId: string) => Promise<Team | undefined>;

  updateTeam: (update: TeamUpdate) => Promise<void>;

  removeTeam: (teamId: string) => Promise<void>;

  setTeamMembers: (teamId: string, teamMembers: NewTeamMember[]) => Promise<void>;

  getTeamMembers: (teamId: string) => Promise<TeamMember[]>;

  removeTeamMember: (memberId: string) => Promise<void>;

  updateTeamPlace: (teamId: string, place: number) => Promise<void>;

  getTeamMember: (memberId: string) => Promise<TeamMember | undefined>;

  getTeamMemberByEmail: (email: string) => Promise<TeamMember[]>;
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
    return teamRef().orderByChild('huntId').equalTo(huntId).once('value')
      .then((dataSnapshot: firebase.database.DataSnapshot) => Object.values(dataSnapshot.val()));
  },

  getTeam: (name: string, huntId: string) => {
    return teamRef().orderByChild('huntId').equalTo(huntId).orderByChild('name').equalTo(name).once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) => Object.values(dataSnapshot.val())[0]);
  },

  updateTeam: (update: TeamUpdate) => {
    if (update.name) {
      return teamRef(update.teamId).update({ name: update.name });
    }
  },

  setTeamMembers: (teamId: string, newTeamMembers: NewTeamMember[]) => {
    const augmentedNewTeamMembers = newTeamMembers.map((tm: NewTeamMember) => ({
      ...tm,
      id: uuid(),
      teamId,
    }));
    return augmentedNewTeamMembers.map((tm: TeamMember) => {
      return teamMemberRef(tm.id).set(tm);
    });
  },

  getTeamMembers: (teamId: string) => {
    return teamMemberRef().orderByChild('teamId').equalTo(teamId).once('value')
    .then(
      (dataSnapshot: firebase.database.DataSnapshot) => Object.values(dataSnapshot.val())
    );
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
    return teamMemberRef(memberId).once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) =>dataSnapshot.val());
  },

  getTeamById: (teamId: string) => {
    return teamRef(teamId).once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) =>dataSnapshot.val());
  },

  getTeamMemberByEmail: (email: string) => {
    return teamMemberRef().orderByChild('email').equalTo(email).once('value')
    .then((dataSnapshot: firebase.database.DataSnapshot) => Object.values(dataSnapshot.val())[0]);
  },

};

export default DefaultTeamService;
