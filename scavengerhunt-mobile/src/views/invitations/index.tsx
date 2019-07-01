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

type NavigationProps = {
    navigation: NavigationScreenProp<{}, { creatorId: string }>;
};

type Props = {
    pairedHunts: { hunt: Hunt; member: TeamMember }[]
} & NavigationProps;

type OuterProps = {} & NavigationProps;

const InvitationsView = (props: Props) => (
    <MainView title="Your invitations">
        <Button fullWidth={true}>
            View Your Hunts
        </Button>
        <View>
            {props.pairedHunts.map(({ hunt, member }) => (
                <HuntPlayCard
                    onPlay={() => props.navigation.navigate('play', { huntId: hunt.id, memberId: member.id })}
                    huntName={hunt.name}
                />
            ))}
        </View>
    </MainView>
);

const getInitialData = (creatorId: string) => {
    const creator = CreatorService.getCreatorById(creatorId);
    const teamMembers = TeamService.getTeamMemberByEmail(creator.email);
    const teams = teamMembers.map((member: TeamMember) => TeamService.getTeamById(member.teamId));
    const hunts = teams.map((team: Team) => HuntService.getHunt(team.huntId));
    return {
        pairedHunts: teamMembers
            .map((teamMember: TeamMember, index: number) => ({ hunt: hunts[index], member: teamMember })),
    };
};

export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        ...getInitialData(props.navigation.getParam('creatorId')),
        navigation: props.navigation,
    }),
)(InvitationsView);
