import React from 'react';
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
        console.error(`fetch failed: ${error}`);
    });
}

export default function withDataGetter<FetchArguments, Result extends {}>(
    fetcher: (input: FetchArguments) => Promise<Result>,
    defaultState: Result,
    whenChanges: (props: FetchArguments) => any,
): (Component: ChildComponent<Result & DefaultChildProps>) => ChildComponent<FetchArguments> {
    return Component => props => {
        const [result, setResult] = React.useState(defaultState);
        React.useEffect(() => getData<FetchArguments, Result>(fetcher, props, setResult)(), [whenChanges(props)]);

        return (
            <Component
                {...result}
                getData={getData(fetcher, props, setResult)}
            />
        );
    };
}
