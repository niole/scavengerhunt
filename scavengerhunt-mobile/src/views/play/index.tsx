import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { LatLng } from '../../domain/LatLng';
import withDataGetter from '../../containers/withDataGetter';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import ClueSolver from './ClueSolver';

const handleHuntSuccess = (navigate: NavigationProps['navigate'], huntId: string, teamId: string) => () => {
    TeamService.setTeamSuccess(teamId);
    navigate('success', { huntId, teamId });
};

type TeamDetails = undefined | {
    teamId: string;
    teamName: string;
    memberId: string;
    memberName: string
    place: number;
};
const getTeamDetails = (teamMemberId: string): TeamDetails => {
    const teamMember = TeamService.getTeamMember(teamMemberId);
    if (!!teamMember) {
        const team = TeamService.getTeamById(teamMember.teamId);
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
};

type HuntDetails = undefined | {
    huntId: string;
    huntName: string;
    inProgress: boolean;
    ended: boolean;
    startLocation: LatLng;
};
const getHuntDetails = (huntId: string): HuntDetails => {
    const hunt = HuntService.getHunt(huntId);
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
};

type NavigationProps = NavigationScreenProp<{}, { huntId: string; memberId: string }>

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
        navigate,
    }: Props) => (
    <View>
        <Text>Play</Text>
        <Text>Welcome {memberName} of {teamName} to {huntName}!</Text>
        <View>
            {!!huntId && !!huntName && !!teamId && !!memberId && (
                <ClueSolver
                    handleHuntSuccess={handleHuntSuccess(navigate, huntId, teamId)}
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
    </View>
);

const defaultValues = {
    inProgress: false,
    ended: false,
};
export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        ...defaultValues,
        ...(getHuntDetails(props.getParam('huntId')) || {}),
        ...(getTeamDetails(props.getParam('memberId')) || {}),
        ...props
    }),
    (props: OuterProps) => ({ ...defaultValues, ...props }),
    (props: OuterProps) => props.getParam('huntId'),
)(PlayView);