import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { NavigationScreenProp } from 'react-navigation';
import ActionBar from '../../components/ActionBar';
import Card from '../../components/Card';
import MainView from '../../components/MainView';
import Button from '../../components/Button';
import withToggle from '../../containers/withToggle';
import withDataGetter from '../../containers/withDataGetter';
import { Hunt } from '../../domain/Hunt';
import { Team } from '../../domain/Team';
import { NewTeamMember } from '../../domain/TeamMember';
import EmailTeamsService from '../../services/EmailTeamsService';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import CreateNewTeamModal, { NonToggleProps } from './CreateNewTeamModal';

const emailTeams = (huntId: string) => () => {
    EmailTeamsService.emailTeams(huntId)
    .then(() => {
        console.log('emailed teams for hunt ', huntId);
    })
    .catch((error: any) => {
        console.log('ERROR', error);
    });
};

const EditTeamModal = withToggle<NonToggleProps>(CreateNewTeamModal)(
    ({ onClick, children }) => <Button onClick={onClick} fullWidth={true}>{children}</Button>,
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
    async (newName: string, teamMembers: NewTeamMember[]) => {
    try {
        await TeamService.updateTeam({
            teamId,
            name: newName,
        });
        await TeamService.setTeamMembers(
            teamId,
            teamMembers,
        );
        dataGetter();
    } catch (error) {
        console.log('ERROR', error);
    }

};

const handleCreateTeam = (huntId: string, dataGetter: () => void) =>
    async (name: string, teamMembers: NewTeamMember[]) => {
    try {
        const team = await TeamService.createTeam(name, huntId);
        await TeamService.setTeamMembers(
            team.id,
            teamMembers,
        );
        dataGetter();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const handleDeleteTeam = (teamId: string, getData: () => void) => async () => {
    try {
        await TeamService.removeTeam(teamId);
        getData();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const InviteView = ({ hunt = {} as Hunt, teams, getData }: Props) => (
    <MainView>
        <ActionBar>
            {props => <CreateTeamModal
                buttonProps={props}
                editing={false}
                onConfirm={handleCreateTeam(hunt.id || '', getData)}
            />}
            {props => <Button onClick={emailTeams(hunt.id || '')} disabled={teams.length === 0} {...props}>
                Email Teams
            </Button>}
        </ActionBar>
        <Text h2>{`Invite teams to play ${hunt.name}`}</Text>
        <View>
            {teams.map((team: Team) => (
                <Card
                    title={team.name}
                    key={team.id}
                    footer={
                        <>
                            <EditTeamModal
                                teamId={team.id}
                                editing={true}
                                onConfirm={handleUpdateTeamName(team.id, getData)}
                                defaultName={team.name}
                            />
                            <Button onClick={handleDeleteTeam(team.id, getData)} fullWidth={true}>
                                Delete
                            </Button>
                        </>
                    }
                />
            ))}
        </View>
    </MainView>
);

export default withDataGetter<OuterProps, InnerProps>(
    async props => Promise.all([
        HuntService.getHunt(props.navigation.getParam('huntId')),
        TeamService.getTeams(props.navigation.getParam('huntId')),
    ]).then(([hunt, teams]) => ({
        hunt,
        teams,
    })),
    () => ({ teams: [] }),
    (props: OuterProps) => props.navigation.getParam('huntId'),
)(InviteView);
