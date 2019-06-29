import * as React from "react";
import { View, Text } from "react-native-ui-lib";

type Props = {
    title?: string;
    children?: any;
};

const MainView = ({ title, children }: Props) => (
    <View>
        {title && (
            <Text h1 marginB-12 padding-12>{title}</Text>
        )}
        <View>
            {children}
        </View>
    </View>
);

export default MainView;
