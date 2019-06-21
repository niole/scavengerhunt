import React from 'react';
import TextField from '@material-ui/core/TextField';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';

export type Props = {
    editing: boolean;
    visible: boolean;
    onConfirm: (name: string) => void;
    onClose: () => void;
    defaultName?: string;
};

type Values = {
    name?: string;
};

const handleConfirm = (onConfirm: Props['onConfirm']) => (values: Values) => {
    if (!values.name) {
        throw new Error('Fill out all fields');
    } else {
        onConfirm(values.name);
    }
};

const CreateEditClueModal = ({ defaultName, onConfirm, ...props  }: Props) => (
    <CreateEditModal
        editingTitle="Edit Team"
        creatingTitle="Create A Team"
        onConfirm={handleConfirm(onConfirm)}
        defaultValues={{ name: defaultName }}
        {...props}
        inputs={[[
            {
                key: 'name',
                validator: (value?: string) => !value ? 'team must have a name' : undefined,
                    Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                    <TextField
                        error={error ? true : undefined}
                        label="Team Name"
                        value={value}
                        onChange={(event: any) => onChange(event.target.value)}
                    />
                )
            }
        ]]}
    />
);
export default CreateEditClueModal;
