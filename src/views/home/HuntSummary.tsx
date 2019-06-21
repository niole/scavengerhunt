import React from 'react';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
};

const HuntSummary = ({ name, huntId, creatorId }: Props) => (
    <div>
        <a href={`/hunt/${huntId}/${creatorId}`}>
            hunt: {name}
        </a>
    </div>
);

export default HuntSummary;
