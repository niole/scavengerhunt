import * as React from "react";
import { TextInput, View, Text } from "react-native";

type Props = {
    error?: any;
    label?: string;
    margin?: 'normal';
    value?: any;
    onChange?: (event: any) => void;
    InputProps?: { readOnly: boolean };
    placeholder?: string;
};

const TextField = ({
        placeholder,
        error,
        label,
        value,
        onChange,
        InputProps,
    }: Props) => (
    <View>
        <Text>
            label: {label}, error: {error}
        </Text>
        <TextInput
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        />
    </View>
);

export default TextField;
