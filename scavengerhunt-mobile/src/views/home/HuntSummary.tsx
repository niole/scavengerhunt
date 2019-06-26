import React from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-ui-lib';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
    onClick: (huntId: string, creatorId: string) => void;
};

const HuntSummary = ({ onClick, name, huntId, creatorId }: Props) => (
    <Card
        enableShadowa={true}
        onPress={() => onClick(huntId, creatorId)}
        style={{ margin: 20, padding: 20 }}
    >
        <Text>
            hunt
        </Text>
        <Text>
            {name}
        </Text>
    </Card>
);

export default HuntSummary;
