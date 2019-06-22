import React from 'react';
import TextField from '@material-ui/core/TextField';
import { TeamMember } from '../../domain/TeamMember';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';

export type Props = {
    teamMembers?: TeamMember[];
    visible: boolean;
    onClose: () => void;
} & NonToggleProps;

export type NonToggleProps = {
    editing: boolean;
    defaultName?: string;
    onConfirm: (name: string) => void;
    teamMembers?: TeamMember[];
};

type Values = {
    name?: string;
    teamMembers: TeamMember[];
};

const handleConfirm = (onConfirm: Props['onConfirm']) => (values: Values) => {
    if (!values.name) {
        throw new Error('Fill out all fields');
    } else {
        onConfirm(values.name);
    }
};

const CreateEditTeamModal = ({ teamMembers = [], defaultName, onConfirm, ...props  }: Props) => (
    <CreateEditModal
        editingTitle="Edit Team"
        creatingTitle="Create A Team"
        onConfirm={handleConfirm(onConfirm)}
        defaultValues={{ name: defaultName, teamMembers }}
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
        ], [
            {
                key: 'teamMembers',
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

export default CreateEditTeamModal;
