import * as React from "react";
import { TextField } from 'react-native-ui-lib';

type Props = {
    error?: any;
    label?: string;
    margin?: 'normal';
    value?: any;
    onChange?: (event: any) => void;
    InputProps?: { readOnly: boolean };
    placeholder?: string;
};

const Input = ({
        placeholder,
        error,
        label,
        value,
        onChange,
        InputProps,
    }: Props) => (
    <TextField
        title={label}
        error={error}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
    />
);

export default Input;
