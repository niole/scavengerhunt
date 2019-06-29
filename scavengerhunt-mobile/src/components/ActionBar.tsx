import React from 'react';
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        flex: 1,
        height: 40,
        position: 'relative'
    },
});

type Props = {
    children: ((props: any) => JSX.Element)[];
};

const ActionBar = ({ children }: Props) => (
    <View style={styles.actionBar} marginB-24>
        {children.map(
            (Child, index: number) => (
                <Child
                    style={styles.button}
                    fullWidth={true}
                    key={index}
                />
            )
        )}
    </View>
);

export default ActionBar;
