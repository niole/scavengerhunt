import React from 'react';
import { Text, View } from 'react-native';

type Props = {
    name: string;
    creatorId: string;
    huntId: string;
    onClick: (huntId: string, creatorId: string) => void;
};

const HuntSummary = ({ onClick, name, huntId, creatorId }: Props) => (
    <View>
        <Text onPress={() => onClick(huntId, creatorId)}>
            hunt: {name}
        </Text>
    </View>
);

export default HuntSummary;
