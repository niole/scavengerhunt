import React from 'react';
import { Colors, Text, TagsInput } from 'react-native-ui-lib';
import TextField from '../../components/TextField';
import TeamService from '../../services/TeamService';
import { TeamMember, NewTeamMember } from '../../domain/TeamMember';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';

export type Props = {
    teamMembers?: TeamMember[];
    visible: boolean;
    onClose: () => void;
} & NonToggleProps;

export type NonToggleProps = {
    buttonProps?: any;
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
                        <TagsInput
                            marginB-24
                            placeholder="Add the emails of the people you want to invite"
                            tags={value.map((tm: { name: string; email: string }) => tm.email)}
                            onCreateTag={(email: string) => {
                                onChange([...value, { name: email, email }]);
                            }}
                            onTagPress={(index: number) => {
                                const newValue = [...value];
                                newValue.splice(index, 1);
                                onChange(newValue);
                            }}
                        />
                    )
                }
            ]]}
        />
    );
};

export default CreateEditTeamModal;
