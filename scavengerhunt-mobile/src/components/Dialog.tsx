import * as React from "react";
import { View, Text } from "react-native-ui-lib";
import { Modal } from 'react-native';

export type Props = {
    title?: string;
    children: JSX.Element | JSX.Element[];
    open?: boolean;
    onClose?: () => void;
};

const Dialog = ({
    children,
    open,
    onClose,
    title,
}: Props) => (
    <View>
        <Modal
            visible={open}
            onRequestClose={onClose}
        >
            <View>
                {title && (
                    <View paddingB-24>
                        <Text h2>{title}</Text>
                    </View>
                )}
                {children}
            </View>
        </Modal>
    </View>
);

export default Dialog;
