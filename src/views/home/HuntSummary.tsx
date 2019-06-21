import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
};

const HuntSummary = ({ name, huntId, creatorId }: Props) => (
    <div>
        <Link to={`/hunt/${huntId}/${creatorId}`}>
            hunt: {name}
        </Link>
    </div>
);

export default HuntSummary;
