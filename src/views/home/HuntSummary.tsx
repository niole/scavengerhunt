import React from 'react';

type Props = {
    name: string;
};

const HuntSummary = ({ name }: Props) => (
    <div>
        hunt: {name}
    </div>
);

export default HuntSummary;
