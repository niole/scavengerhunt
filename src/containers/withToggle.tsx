import React from 'react';
import Button from '@material-ui/core/Button';

type ButtonProps = {
    onClick: (event: any) => void;
    children: string | JSX.Element | JSX.Element[];
};

type Button = (props: ButtonProps) => JSX.Element;

type ButtonState = {
    visible?: boolean;
    children?: ButtonProps['children'];
};

type ChildComponent<O> = (outerProps: O) => JSX.Element;

export type InnerProps = {
    visible: boolean;
    onClose: () => void;
};

export default function withToggle<OuterProps>(Component: ChildComponent<InnerProps & OuterProps>): (ButtonComponent?: Button) => ChildComponent<OuterProps> {
    return (ButtonComponent?: Button, defaultState?: ButtonState) => (props: OuterProps) => {
        const state = defaultState || {};
        const defaultButtonState = { visible: state.visible || false, children: state.children || 'Open' };
        const [visible, setVisible] = React.useState(defaultButtonState.visible);
        const B = ButtonComponent || Button;
        return (
            <span>
                <Component {...props} visible={visible} onClose={() => setVisible(false)} />
                <B onClick={() => setVisible(!visible)}>
                    {defaultButtonState.children}
                </B>
            </span>
        );
    };
}
