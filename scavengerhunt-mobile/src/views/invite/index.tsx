import React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Button from '../../components/Button';
import withToggle from '../../containers/withToggle';
import withDataGetter from '../../containers/withDataGetter';
import { Hunt } from '../../domain/Hunt';
import { Team } from '../../domain/Team';
import { NewTeamMember } from '../../domain/TeamMember';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import CreateNewTeamModal, { NonToggleProps } from './CreateNewTeamModal';

const emailTeams = (huntId: string) => () => {
    console.log('email teams for hunt ', huntId);
};

const EditTeamModal = withToggle<NonToggleProps>(CreateNewTeamModal)(
        ({ onClick, children }) => <Button onClick={onClick}>{children}</Button>,
    { children: 'edit' }
);

const CreateTeamModal = withToggle<NonToggleProps>(CreateNewTeamModal)(
    undefined,
    { children: 'Create New Team' }
);

type NavigationProps = {
    navigation: NavigationScreenProp<{}, { huntId: string; creatorId: string }>;
};

type OuterProps = NavigationProps;

type Props = { getData: () => void; } & InnerProps;

type InnerProps = {
    teams: Team[];
    hunt?: Hunt;
};

const handleUpdateTeamName = (teamId: string, dataGetter: () => void) =>
    (newName: string, teamMembers: NewTeamMember[]) => {
    TeamService.updateTeam({
        teamId,
        name: newName,
    });
    TeamService.setTeamMembers(
        teamId,
        teamMembers,
    );
    dataGetter();
};

const handleCreateTeam = (huntId: string, dataGetter: () => void) => (name: string, teamMembers: NewTeamMember[]) => {
    const team = TeamService.createTeam(name, huntId);
    TeamService.setTeamMembers(
        team.id,
        teamMembers,
    );
    dataGetter();
};

const InviteView = ({ hunt = {} as Hunt, teams, getData }: Props) => (
    <View>
        <Text>Invite Teams for Hunt</Text>
        <Text>{hunt.name}</Text>
        <CreateTeamModal
            editing={false}
            onConfirm={handleCreateTeam(hunt.id || '', getData)}
        />
        <Button onClick={emailTeams(hunt.id || '')} disabled={teams.length === 0}>
            Email Teams
        </Button>
        <View>
            {!teams.length && (
                <Text>Add a team</Text>
            )}
            {teams.map((team: Team) => (
                <View key={team.id}>
                    <Text>team {team.name} </Text>
                    <EditTeamModal
                        teamId={team.id}
                        editing={true}
                        onConfirm={handleUpdateTeamName(team.id, getData)}
                        defaultName={team.name}
                    />
                </View>
            ))}
        </View>
    </View>
);

export default withDataGetter<OuterProps, InnerProps>(
    async props => ({
        hunt: HuntService.getHunt(props.navigation.getParam('huntId')),
        teams: TeamService.getTeams(props.navigation.getParam('huntId')),
    }),
    () => ({ teams: [] }),
    (props: OuterProps) => props.navigation.getParam('huntId'),
)(InviteView);
