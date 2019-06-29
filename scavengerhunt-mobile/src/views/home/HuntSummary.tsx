import React from 'react';
import { Text } from 'react-native';
import Card from '../../components/Card';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
    onClick: (huntId: string, creatorId: string) => void;
};

const HuntSummary = ({ onClick, name, huntId, creatorId }: Props) => (
    <Card onPress={() => onClick(huntId, creatorId)} title={name}>
        <Text>
            click to view
        </Text>
    </Card>
);

export default HuntSummary;
