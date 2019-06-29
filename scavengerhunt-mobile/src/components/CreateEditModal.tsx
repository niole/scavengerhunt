import React from 'react';
import { View } from "react-native";
import Dialog from './Dialog';
import ValidatedForm, { ValidatedInput } from './ValidatedForm';

type Props<Values> = {
    editing: boolean;
    editingTitle: string;
    creatingTitle: string;
    visible: boolean;
    onConfirm: (values: Values) => void;
    onClose: () => void;
    defaultValues: Values;
    inputs: ValidatedInput<any, any, any>[][];
};

function CreateEditModal<Values, Defaults>({
        inputs,
        editing,
        editingTitle,
        creatingTitle,
        visible,
        onConfirm,
        onClose,
        defaultValues,
        ...dialogProps
}: Props<Values>): JSX.Element {
    return (
        <Dialog
            open={visible}
            onClose={onClose}
            {...dialogProps}
            title={editing ? editingTitle : creatingTitle}
        >
            <ValidatedForm
                inputs={inputs}
                onSubmit={async (values: Values) => {
                    onConfirm(values);
                    onClose();
                }}
                onCancel={onClose}
                defaultValues={defaultValues}
            />
        </Dialog>
    );
}
export default CreateEditModal;
