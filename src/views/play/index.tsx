import React from 'react';
import { History } from 'history';
import { RouteComponentProps } from 'react-router';
import { LatLng } from '../../domain/LatLng';
import withDataGetter from '../../containers/withDataGetter';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';
import ClueSolver from './ClueSolver';

const handleHuntSuccess = (history: History<any>, huntId: string, teamId: string) => () => {
    TeamService.setTeamSuccess(teamId);
    history.push(`/success/${huntId}/${teamId}`);
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

type OuterProps = RouteComponentProps<{ huntId: string; memberId: string }>
type Props = {
    history: History<any>,
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
};

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
        history,
    }: Props) => (
    <div>
        <h1>Play</h1>
        <h2>Welcome {memberName} of {teamName} to {huntName}!</h2>
        <div>
            {!!huntId && !!huntName && !!teamId && !!memberId && (
                <ClueSolver
                    handleHuntSuccess={handleHuntSuccess(history, huntId, teamId)}
                    huntName={huntName}
                    huntInProgress={inProgress}
                    huntEnded={ended}
                    huntId={huntId}
                    teamId={teamId}
                    memberId={memberId}
                />
            )}
            {!!startLocation && (
                <div>
                    start location: {JSON.stringify(startLocation)}
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
        history: props.history,
        ...defaultValues,
        ...(getHuntDetails(props.match.params.huntId) || {}),
        ...(getTeamDetails(props.match.params.memberId) || {}),
    }),
    (props: OuterProps) => ({ ...defaultValues, history: props.history }),
    (props: OuterProps) => props.match.params.huntId,
)(PlayView);
