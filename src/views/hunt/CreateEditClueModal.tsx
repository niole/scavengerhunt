import React from 'react';
import { LatLng } from '../../domain/Clue';
import TextField from '@material-ui/core/TextField';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';

type Props = {
    editing: boolean;
    visible: boolean;
    onConfirm: (text: string, location: LatLng) => void;
    onClose: () => void;
    defaultText?: string;
};
const handleConfirm = (onConfirm: Props['onConfirm']) => (values: { clueText?: string; location?: LatLng }) => {
    if (!values.clueText || !values.location) {
        throw new Error('Fill out all fields');
    } else {
        onConfirm(values.clueText, values.location);
    }
};

const CreateEditClueModal = ({ defaultText, onConfirm, ...props  }: Props) => (
    <CreateEditModal
        editingTitle="Edit Clue"
        creatingTitle="Create A Clue"
        onConfirm={handleConfirm(onConfirm)}
        defaultValues={{ clueText: defaultText }}
        {...props}
        inputs={[[
            {
                key: 'clueText',
                validator: (value?: string) => !value ? 'clue must have text' : undefined,
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
                validator: (value?: LatLng) => !value ? 'Must choose location' : undefined,
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
    />
);
export default CreateEditClueModal;
