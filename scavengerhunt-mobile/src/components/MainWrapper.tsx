import React from 'react';
import { View } from 'react-native';

type Props = {
    children: string | JSX.Element | JSX.Element[];
};

const MainWrapper = ({ children }: Props) => (
    <View>
        {children}
    </View>
);

export function withMainWrapper<P>(Component: (props: P) => JSX.Element): (props: P) => JSX.Element {
    return (props: P) => (
        <MainWrapper>
            <Component {...props} />
        </MainWrapper>
    );
}

export default MainWrapper;
