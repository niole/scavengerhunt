import React from 'react';
import { View, Text, Card } from 'react-native-ui-lib';

type Props = {
    title?: string;
    footer?: JSX.Element;
    children: JSX.Element | string;
    onPress?: () => void;
};

const AppCard = ({ footer, onPress, title, children }: Props) => (
    <Card
        enableShadowa={true}
        onPress={onPress}
        style={{ margin: 20, padding: 20 }}
    >
        {title && (
            <Text h2>
                {title}
            </Text>
        )}
        {children && (
            <View paddingT-12>
                {children}
            </View>
        )}
        {footer && (
            <View paddingT-24>
                {footer}
            </View>
        )}
    </Card>
);

export default AppCard;
