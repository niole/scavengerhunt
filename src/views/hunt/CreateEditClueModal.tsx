import React from 'react';
import { LatLng } from '../../domain/Clue';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import ValidatedForm, { PluggableProps } from '../../components/ValidatedForm';

type Props = {
    editing: boolean;
    visible: boolean;
    onConfirm: (text: string, location: LatLng) => void;
    onClose: () => void;
    defaultText?: string;
}

const CreateEditClueModal = (props: Props) => (
    <Dialog open={props.visible} onClose={props.onClose}>
        <DialogTitle>
            {props.editing ? 'Edit CLue' : 'Create A Clue'}
        </DialogTitle>
        <DialogContent>
            <ValidatedForm
                ActionsContainer={DialogActions}
                inputs={[[
                    {
                        key: 'clueText',
                        validator: (value: string) => !value ? 'clue must have text' : undefined,
                            Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                            <TextField
                                error={error ? true : undefined}
                                label="New Clue"
                                value={value}
                                onChange={(event: any) => onChange(event.target.value)}
                            />
                        )
                    }
                ], [
                    {
                        key: 'location',
                        validator: (value: LatLng) => !value ? 'Must choose location' : undefined,
                            Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                            <TextField
                                error={error ? true : undefined}
                                label="Success Location"
                                value={value}
                                onChange={(event: any) => onChange(event.target.value)}
                            />
                        )
                    }
                ]]}
                onSubmit={async ({ clueText, location }: { location?: LatLng; clueText?: string }) => {
                    if (!clueText || !location) {
                        throw new Error('Please update all fields');
                    } else {
                        props.onConfirm(clueText, location);
                        props.onClose();
                    }
                    return;
                }}
                onCancel={props.onClose}
                defaultValues={{ clueText: props.defaultText }}
            />
        </DialogContent>
    </Dialog>
);
export default CreateEditClueModal;
