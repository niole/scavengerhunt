import React from 'react';
import { RouteComponentProps } from 'react-router';
import withDataGetter from '../../containers/withDataGetter';

type OuterProps = RouteComponentProps<{ teamId: string }>;

type Props = {
    huntName: string;
    teamName: string;
};

const SuccessView = ({ huntName, teamName }: Props) => (
    <div>
        <h1>Congratulations {teamName}!</h1>
        <div>
            You solved {huntName}!
        </div>
    </div>
);

export default withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        huntName: 'sdflkj',
        teamName: 'theteam',
    }),
)(SuccessView);
