import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
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
}: Props<Values>): JSX.Element {
    return (
        <Dialog open={visible} onClose={onClose}>
            <DialogTitle>
                {editing ? editingTitle : creatingTitle}
            </DialogTitle>
            <DialogContent>
                <ValidatedForm
                    ActionsContainer={DialogActions}
                    inputs={inputs}
                    onSubmit={async (values: Values) => {
                        onConfirm(values);
                        onClose();
                    }}
                    onCancel={onClose}
                    defaultValues={defaultValues}
                />
            </DialogContent>
        </Dialog>
    );
}
export default CreateEditModal;
