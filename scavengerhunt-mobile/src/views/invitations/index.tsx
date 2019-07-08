import * as React from "react";
import { View } from 'react-native-ui-lib';
import { NavigationScreenProp } from 'react-navigation';
import withDataGetter from '../../containers/withDataGetter';
import { Hunt } from '../../domain/Hunt';
import { Team } from '../../domain/Team';
import { TeamMember } from '../../domain/TeamMember';
import Button from '../../components/Button';
import MainView from '../../components/MainView';
import TeamService from '../../services/TeamService';
import HuntService from '../../services/HuntService';
import CreatorService from '../../services/CreatorService';
import HuntPlayCard from './HuntPlayCard';

const handleGoBackToHome = (navigation: NavigationProps['navigation']) => () => {
    navigation.navigate('home');
};

type NavigationProps = {
    navigation: NavigationScreenProp<{}, { creatorId: string }>;
};

type Props = {
    pairedHunts: { hunt: Hunt; member: TeamMember }[]
} & NavigationProps;

type OuterProps = {} & NavigationProps;

const InvitationsView = (props: Props) => (
    <MainView title="Your invitations">
        <Button fullWidth={true} onClick={handleGoBackToHome(props.navigation)}>
            View Your Hunts
        </Button>
        <View>
            {props.pairedHunts.map(({ hunt, member }) => (
                <HuntPlayCard
                    key={member.id}
                    onPlay={() => props.navigation.navigate('play', { huntId: hunt.id, memberId: member.id })}
                    huntName={hunt.name}
                />
            ))}
        </View>
    </MainView>
);

const getInitialData = async (creatorId: string) => {
    const creator = await CreatorService.getCreatorById(creatorId);
    const teamMembers = await TeamService.getTeamMembersByEmail(creator.email);
    const teams = Promise.all(teamMembers.map((member: TeamMember) => TeamService.getTeamById(member.teamId)));
    const hunts = await teams.then(ts => Promise.all(ts.map((team: Team) => HuntService.getHunt(team.huntId))));
    return {
        pairedHunts: teamMembers
            .map((teamMember: TeamMember, index: number) => ({ hunt: hunts[index], member: teamMember })),
    };
};

export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        ...await getInitialData(props.navigation.getParam('creatorId')),
        navigation: props.navigation,
    }),
)(InvitationsView);
