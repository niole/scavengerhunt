import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import { ChildComponent } from './util';

type ButtonProps = {
    onClick: (event: any) => void;
    children: string;
};

type Button = (props: ButtonProps) => JSX.Element;

type ButtonState = {
    visible?: boolean;
    children?: ButtonProps['children'];
};

export type InnerProps = {
    visible: boolean;
    onClose: () => void;
};

export type ExternalButtonProps = {
    buttonProps?: {};
};

export default function withToggle<OuterProps extends ExternalButtonProps>(Component: ChildComponent<InnerProps & OuterProps>): (ButtonComponent?: Button, defaultState?: ButtonState) => ChildComponent<OuterProps> {
    return (ButtonComponent?: Button, defaultState?: ButtonState) =>
        ({ buttonProps = {} as ExternalButtonProps, ...props }: OuterProps) => {
        const state = defaultState || {};
        const defaultButtonState = { visible: state.visible || false, children: state.children || 'Open' };
        const [visible, setVisible] = React.useState(defaultButtonState.visible);
        const B = ButtonComponent || Button;
        return (
            <View>
                <Component
                    {...props}
                    visible={visible}
                    onClose={() => setVisible(false)}
                />
                <B onClick={() => setVisible(!visible)} {...buttonProps}>
                    {defaultButtonState.children}
                </B>
            </View>
        );
    };
}
