import React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from '@material-ui/core/Button';
import { LatLng } from '../../domain/LatLng';
import withDataGetter from '../../containers/withDataGetter';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import ClueSolver from './ClueSolver';

type TeamDetails = undefined | {
    teamId: string;
    teamName: string;
    memberId: string;
    memberName: string
    place: number;
    nextClue: number;
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
                nextClue: team.nextClue,
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

type OuterProps = RouteComponentProps<{ huntId: string; memberId: string }>
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
    nextClue?: number;
    place?: number;
};

const PlayView = ({
        startLocation,
        nextClue,
        place,
        inProgress,
        ended,
        memberName,
        teamName,
        huntName,
        huntId,
        teamId,
        memberId,
    }: Props) => (
    <div>
        <h1>Play</h1>
        <h2>Welcome {memberName} of {teamName} to {huntName}!</h2>
        <div>
            {!!huntId && !!huntName && !!teamId && !!memberId && (
                <ClueSolver
                    huntName={huntName}
                    huntInProgress={inProgress}
                    huntEnded={ended}
                    huntId={huntId}
                    teamId={teamId}
                    memberId={memberId}
                />
            )}
            {!!startLocation && nextClue === -1 && (
                <div>
                    start location: {JSON.stringify(startLocation)}
                </div>
            )}
            {nextClue !== undefined && nextClue > -1 && place !== undefined && (
                <div>
                    You are in place number {place}
                </div>
            )}
            <div>
                {ended && 'This hunt has ended.'}
                {!inProgress && 'This hunt isn\'t running at the moment.'}
            </div>
        </div>
    </div>
);

const defaultValues = {
    inProgress: false,
    ended: false,
};
export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        ...defaultValues,
        ...(getHuntDetails(props.match.params.huntId) || {}),
        ...(getTeamDetails(props.match.params.memberId) || {}),
    }),
    defaultValues,
    props => props.match.params.huntId,
)(PlayView);
