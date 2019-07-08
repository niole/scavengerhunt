import React from 'react';
import { Text, View } from 'react-native';
import { ChildComponent } from './util';

type DefaultChildProps = {
    getData: () => void;
};

function getData<FetchArguments, Result>(
        fetcher: (input: FetchArguments) => Promise<Result>,
        props: FetchArguments,
        setResult: (result: any) => any
    ): () => void {
    return () => fetcher(props).then(setResult).catch((error: any) => {
        console.log(`fetch failed: ${error}`); // console.error seems to break expo
    });
}

export default function withDataGetter<FetchArguments, Result extends {}>(
    fetcher: (input: FetchArguments) => Promise<Result>,
    defaultState?: (props: FetchArguments) => Result,
    whenChanges?: (props: FetchArguments) => any,
): (Component: ChildComponent<Result & DefaultChildProps>) => ChildComponent<FetchArguments> {
    return Component => props => {
        const [result, setResult] = React.useState(defaultState ? defaultState(props) : undefined);
        React.useEffect(() => {
            fetcher(props).then(setResult).catch((error: any) => {
                console.log(`fetch failed: ${error}`); // console.error seems to break expo
            });
        }, whenChanges ? [whenChanges(props)] : []);
        return !!result ? (
            <Component
                {...result}
                getData={getData(fetcher, props, setResult)}
            />
        ) : (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    };
}
