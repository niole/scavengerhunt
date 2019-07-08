import React from 'react';
import { LatLng } from '../../domain/LatLng';
import TextField from '../../components/TextField';
import { PluggableProps } from '../../components/ValidatedForm';
import CreateEditModal from '../../components/CreateEditModal';
import LocationSelector from '../../components/LocationSelector';

export type Props = {
    editing: boolean;
    visible: boolean;
    onConfirm: (text: string, location: LatLng, clueNumber: number) => void;
    onClose: () => void;
    defaultText?: string;
    defaultLocation?: LatLng;
    defaultNumber?: number;
};

const handleConfirm = (onConfirm: Props['onConfirm']) => (values: { clueText?: string; location?: LatLng; clueNumber?: number }) => {
    if (!values.clueText || !values.location || values.clueNumber === undefined) {
        throw new Error('Fill out all fields');
    } else {
        onConfirm(values.clueText, values.location, values.clueNumber);
    }
};

const CreateEditClueModal = ({ defaultText, defaultLocation, defaultNumber, onConfirm, ...props  }: Props) => (
    <CreateEditModal
        editingTitle="Edit Clue"
        creatingTitle="Create A Clue"
        onConfirm={handleConfirm(onConfirm)}
        defaultValues={{ clueText: defaultText, location: defaultLocation, clueNumber: defaultNumber }}
        maxWidth="md"
        {...props}
        inputs={[[
            {
                key: 'clueText',
                validator: (value?: string) => !value ? 'clue must have text' : undefined,
                    Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                    <TextField
                        error={error ? true : undefined}
                        label="New Clue"
                        margin="normal"
                        value={value}
                        onChange={(event: any) => onChange(event.nativeEvent.text)}
                    />
                )
            }
        ], [
            {
                key: 'location',
                validator: (value?: LatLng) => !value ? 'Must choose location' : undefined,
                    Input: ({ value, onChange, error }: PluggableProps<any, LatLng>) => (
                    <LocationSelector
                        error={error}
                        defaultLocation={value}
                        onLocationSelect={onChange}
                    />
                )
            }
        ], [
            {
                key: 'clueNumber',
                validator: (value?: number) => value === undefined ? 'Must choose clue number' : undefined,
                    Input: ({ value, onChange, error }: PluggableProps<any, number>) => (
                    <TextField
                        error={error ? true : undefined}
                        label="Clue Number"
                        margin="normal"
                        value={value ? value.toString() : value}
                        onChange={(event: any) => onChange(parseFloat(event.nativeEvent.text))}
                    />
                )
            }
        ]]}
    />
);
export default CreateEditClueModal;
