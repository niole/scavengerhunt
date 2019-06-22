import React from 'react';
import { RouteComponentProps } from 'react-router';
import withToggle from '../../containers/withToggle';
import withDataGetter from '../../containers/withDataGetter';
import { Hunt } from '../../domain/Hunt';
import { Team } from '../../domain/Team';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import CreateNewTeamModal, { NonToggleProps } from './CreateNewTeamModal';

type WithTeamsProps = NonToggleProps & { teamId?: string };
const withTeams = withDataGetter<WithTeamsProps, NonToggleProps>(
    async (props: WithTeamsProps) => {
        return {
            ...props,
            teamMembers: props.teamId ?
                TeamService.getTeamMembers(props.teamId) :
                [],
        };
    }
);

const EditTeamModal = withTeams(withToggle<NonToggleProps>(CreateNewTeamModal)(
    ({ onClick, children }) => <span onClick={onClick}>{children}</span>,
    { children: 'edit' }
));

const CreateTeamModal = withToggle<NonToggleProps>(CreateNewTeamModal)(
    undefined,
    { children: 'Create New Team' }
);

type OuterProps = RouteComponentProps<{ huntId: string; creatorId: string }>;

type Props = { getData: () => void; } & InnerProps;

type InnerProps = {
    teams: Team[];
    hunt?: Hunt;
};

const handleUpdateTeamName = (teamId: string, dataGetter: () => void) => (newName: string) => {
    TeamService.updateTeam({
        teamId,
        name: newName,
    });
    dataGetter();
};

const handleCreateTeam = (huntId: string, dataGetter: () => void) => (name: string) => {
    TeamService.createTeam(name, huntId);
    dataGetter();
};

const InviteView = ({ hunt = {} as Hunt, teams, getData }: Props) => (
    <div>
        <h1>Invite Teams for Hunt</h1>
        <h2>{hunt.name}</h2>
        <CreateTeamModal
            editing={false}
            onConfirm={handleCreateTeam(hunt.id || '', getData)}
        />
        <div>
            {!teams.length && 'Add a team'}
            {teams.map((team: Team) => (
                <div>
                    team {team.name} <EditTeamModal
                        teamId={team.id}
                        editing={true}
                        onConfirm={handleUpdateTeamName(team.id, getData)}
                        defaultName={team.name}
                    />
                </div>
            ))}
        </div>
    </div>
);

export default withDataGetter<OuterProps, InnerProps>(
    async props => ({
        hunt: HuntService.getHunt(props.match.params.huntId),
        teams: TeamService.getTeams(props.match.params.huntId),
    }),
    () => ({ teams: [] }),
    (props: OuterProps) => props.match.params.huntId,
)(InviteView);
