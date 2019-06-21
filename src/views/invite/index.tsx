import React from 'react';
import { RouteComponentProps } from 'react-router';

type Props = {

} & RouteComponentProps<{ huntId: string; creatorId: string }>;

const InviteView = (props: Props) => (
    <div>
        <h1>Invite Teams</h1>
        <div>
        </div>
    </div>
);

export default InviteView;
