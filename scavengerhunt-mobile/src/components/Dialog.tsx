import * as React from "react";
import { Modal, View } from 'react-native';

export type Props = {
    children: JSX.Element | JSX.Element[];
    open?: boolean;
    onClose?: () => void;
};

const Dialog = ({
    children,
    open,
    onClose,
}: Props) => (
    <View>
        <Modal
            visible={open}
            onRequestClose={onClose}
        >
            {children}
        </Modal>
    </View>
);

export default Dialog;
