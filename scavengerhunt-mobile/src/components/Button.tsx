import * as React from 'react';
import { Button } from 'react-native-ui-lib';

type Props = {
    children: string;
    onClick?: (event: any) => void;
    disabled?: boolean;
    fullWidth?: boolean;
    round?: boolean;
    size?: string;
    style?: any;
};

const AppButton = ({
    children,
    onClick,
    disabled,
    ...buttonProps
}: Props) => (
    <Button
        label={children}
        onPress={onClick}
        disabled={disabled}
        {...buttonProps}
    />
);

export default AppButton;
