import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { LatLng } from '../../domain/LatLng';
import withDataGetter from '../../containers/withDataGetter';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import MainView from '../../components/MainView';
import ClueSolver from './ClueSolver';

const handleHuntSuccess = (navigation: NavigationProps['navigation'], huntId: string, teamId: string) => async () => {
    await TeamService.setTeamSuccess(teamId);
    navigation.navigate('success', { huntId, teamId });
};

type TeamDetails = undefined | {
    teamId: string;
    teamName: string;
    memberId: string;
    memberName: string
    place: number;
};
const getTeamDetails = async (teamMemberId: string): Promise<TeamDetails> => {
    try {
        const teamMember = await TeamService.getTeamMember(teamMemberId);
        if (!!teamMember) {
            const team = await TeamService.getTeamById(teamMember.teamId);
            if (!!team) {
                return {
                    memberName: teamMember.name,
                    teamId: team.id,
                    teamName: team.name,
                    memberId: teamMemberId,
                    place: team.place,
                };
            }
        }
        throw new Error('This team or team member doesn\'t exist');
    } catch (error) {
        console.log('ERROR', error);
    }
};

type HuntDetails = undefined | {
    huntId: string;
    huntName: string;
    inProgress: boolean;
    ended: boolean;
    startLocation: LatLng;
};

const getHuntDetails = async (huntId: string): Promise<HuntDetails> => {
    try {
        const hunt = await HuntService.getHunt(huntId);
        if (!!hunt) {
            return {
                startLocation: hunt.startLocation,
                inProgress: hunt.inProgress,
                ended: hunt.ended,
                huntId,
                huntName: hunt.name,
            };
        } else {
            throw new Error('Could not find that hunt');
        }
    } catch (error) {
        console.log('ERROR', error);
    }
};

type NavigationProps = {
    navigation: NavigationScreenProp<{}, { huntId: string; memberId: string }>;
};

type OuterProps = NavigationProps;

type Props = {
    huntId?: string;
    huntName?: string;
    teamId?: string;
    teamName?: string;
    memberId?: string;
    memberName?: string;
    inProgress: boolean;
    ended: boolean;
    startLocation?: LatLng;
    place?: number;
} & NavigationProps;

const PlayView = ({
        startLocation,
        place,
        inProgress,
        ended,
        memberName,
        teamName,
        huntName,
        huntId,
        teamId,
        memberId,
        navigation,
    }: Props) => (
    <MainView title={`Welcome ${memberName} of ${teamName} to ${huntName}!`}>
        <View>
            {!!huntId && !!huntName && !!teamId && !!memberId && (
                <ClueSolver
                    handleHuntSuccess={handleHuntSuccess(navigation, huntId, teamId)}
                    huntName={huntName}
                    huntInProgress={inProgress}
                    huntEnded={ended}
                    huntId={huntId}
                    teamId={teamId}
                    memberId={memberId}
                />
            )}
            {!!startLocation && (
                <Text>>
                    start location: {JSON.stringify(startLocation)}
                </Text>
            )}
            <Text>
                {ended && 'This hunt has ended.'}
                {!inProgress && 'This hunt isn\'t running at the moment.'}
            </Text>
        </View>
    </MainView>
);

const defaultValues = {
    inProgress: false,
    ended: false,
};
export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) =>
    Promise.all([
        getHuntDetails(props.navigation.getParam('huntId')),
        getTeamDetails(props.navigation.getParam('memberId')),
    ]).then(([huntDetails, teamDetails]) => ({
        ...defaultValues,
        ...(huntDetails || {}),
        ...(teamDetails || {}),
        ...props
    })),
    undefined,
    (props: OuterProps) => props.navigation.getParam('huntId'),
)(PlayView);
