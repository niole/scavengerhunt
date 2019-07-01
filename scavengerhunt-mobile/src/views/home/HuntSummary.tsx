import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
    onClick: (huntId: string, creatorId: string) => void;
    removeHunt: () => void;
};

const HuntSummary = ({ removeHunt, onClick, name, huntId, creatorId }: Props) => (
    <Card
        footer={
            <>
                <Button onClick={() => onClick(huntId, creatorId)} fullWidth={true}>
                    View
                </Button>
                <Button onClick={removeHunt} fullWidth={true}>
                    Delete
                </Button>
            </>
        }
        title={name}
    />
);

export default HuntSummary;
