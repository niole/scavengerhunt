import * as React from "react";
import { ScrollView, Dimensions } from 'react-native';
import { View, Text } from "react-native-ui-lib";

type Props = {
    title?: string;
    children?: any;
};

const MainView = ({ title, children }: Props) => (
    <View style={{ height: Dimensions.get('window').height - 150 }}>
        {title && (
            <Text h1 marginB-12 padding-12>{title}</Text>
        )}
        <ScrollView>
            {children}
        </ScrollView>
    </View>
);

export default MainView;
