import * as React from 'react';
import { Button } from 'react-native';

type Props = {
    children: string;
    onClick?: (event: any) => void;
    disabled?: boolean;
};

const AppButton = ({
    children,
    onClick,
    disabled,
}: Props) => (
    <Button
        title={children}
        onPress={onClick}
        disabled={disabled}
    />
);

export default AppButton;
