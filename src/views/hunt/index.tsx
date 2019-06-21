import React from 'react';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps<{
    huntId: string;
    creatorId: string;
}>;

const HuntView = (props: Props) => (
    <div>
        hunt view
    </div>
);

export default HuntView;
