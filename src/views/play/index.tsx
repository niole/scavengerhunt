import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import withDataGetter from '../../containers/withDataGetter';
import HuntService from '../../services/HuntService';
import TeamService from '../../services/TeamService';

type TeamDetails = undefined | {
    teamId: string;
    teamName: string;
    memberId: string;
    memberName: string
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
};
const getHuntDetails = (huntId: string): HuntDetails => {
    const hunt = HuntService.getHunt(huntId);
    if (!!hunt) {
        return {
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
};

const PlayView = ({ inProgress, ended, memberName, teamName, huntName, huntId, teamId, memberId }: Props) => (
    <div>
        <h1>Play</h1>
        <h2>Welcome {memberName} of {teamName} to {huntName}!</h2>
        <div>
            <Button disabled={!inProgress || ended}>
                <Link to={`/play/start/:huntId/:teamId/:memberId`}>
                    Play {huntName}
                </Link>
            </Button>
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
