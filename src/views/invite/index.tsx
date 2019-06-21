import React from 'react';
import { RouteComponentProps } from 'react-router';
import withDataGetter from '../../containers/withDataGetter';
import { Team } from '../../domain/Team';
import TeamService from '../../services/TeamService';

type OuterProps = RouteComponentProps<{ huntId: string; creatorId: string }>;

type Props = {
    teams: Team[];
};

const InviteView = ({ teams }: Props) => (
    <div>
        <h1>Invite Teams</h1>
        <div>
            {!teams.length && 'Add a team'}
            {teams.map((team: Team) => (
                <div>
                    team {team.name}
                </div>
            ))}
        </div>
    </div>
);

export default withDataGetter<OuterProps, Props>(
    async props => ({ teams: TeamService.getTeams(props.match.params.huntId) }),
    { teams: [] },
    props => props.match.params.huntId,
)(InviteView);
