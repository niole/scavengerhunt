import React from 'react';
import { View } from 'react-native';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import TeamService from '../../services/TeamService';
import { TeamMember, NewTeamMember } from '../../domain/TeamMember';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';
import CreateNewMemberInput from './CreateTeamMemberInput';

type ChipProps = {
    label: string;
    onDelete: () => void;
};

const Chip = ({ label, onDelete }: ChipProps) => (
    <Button onClick={onDelete}>
        {label}
    </Button>
);

export type Props = {
    teamMembers?: TeamMember[];
    visible: boolean;
    onClose: () => void;
} & NonToggleProps;

export type NonToggleProps = {
    teamId?: string;
    editing: boolean;
    defaultName?: string;
    onConfirm: (name: string, teamMembers: NewTeamMember[]) => void;
    teamMembers?: TeamMember[];
};

type Values = {
    name?: string;
    teamMembers: NewTeamMember[];
};

const handleConfirm = (onConfirm: Props['onConfirm']) => (values: Values) => {
    if (!values.name) {
        throw new Error('Fill out all fields');
    } else {
        onConfirm(
            values.name,
            values.teamMembers,
        );
    }
};

const CreateEditTeamModal = ({ defaultName, onConfirm, ...props  }: Props) => {
    const [teamMembers, setTeamMembers] = React.useState([] as NewTeamMember[]);
    React.useEffect(() => {
        if (props.visible && props.teamId) {
            const members = TeamService.getTeamMembers(props.teamId);
            setTeamMembers(members);
        }
    }, [props.teamId, props.visible]);
    return (
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
                            onChange={(event: any) => onChange(event.nativeEvent.text)}
                        />
                    )
                }
            ], [
                {
                    key: 'teamMembers',
                    Input: ({ value, onChange, error }: PluggableProps<any, NewTeamMember[]>) => (
                        <View>
                            <View>
                                <CreateNewMemberInput
                                    onChange={(name: string, email: string) => {
                                        onChange([...value, { name, email }]);
                                    }}
                                />
                            </View>
                            <View>
                                {value.map((member: NewTeamMember) => (
                                    <Chip
                                        key={member.name}
                                        label={member.email}
                                        onDelete={() => {
                                            onChange(value.filter((teamMember: NewTeamMember) => member.email !== teamMember.email));
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    )
                }
            ]]}
        />
    );
};

export default CreateEditTeamModal;
