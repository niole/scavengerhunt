import React from 'react';

type Props = {
    children: string | JSX.Element | JSX.Element[];
};

const MainWrapper = ({ children }: Props) => (
    <div>
        {children}
    </div>
);

export function withMainWrapper<P>(Component: (props: P) => JSX.Element): (props: P) => JSX.Element {
    return (props: P) => (
        <MainWrapper>
            <Component {...props} />
        </MainWrapper>
    );
}

export default MainWrapper;
