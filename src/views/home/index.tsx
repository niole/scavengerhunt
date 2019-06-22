import React from 'react';

import { LatLng } from '../../domain/LatLng';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';

import withDataGetter from '../../containers/withDataGetter';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import HuntSummary from './HuntSummary';
import ValidatedForm, { PluggableProps } from '../../components/ValidatedForm';
import LocationSelector from '../../components/LocationSelector';
import withToggle from '../../containers/withToggle';

const Modal = withToggle<{ onConfirm: (name: string, location: LatLng) => void}>(props => (
    <Dialog open={props.visible} onClose={props.onClose}>
        <DialogTitle>
            Create A Hunt
        </DialogTitle>
        <DialogContent>
            <ValidatedForm
                ActionsContainer={DialogActions}
                inputs={[[
                    {
                        key: 'name',
                        validator: (value: string) => !value ? 'must have name' : undefined,
                            Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                            <TextField
                                error={error ? true : undefined}
                                label="Name"
                                margin="normal"
                                value={value}
                                onChange={(event: any) => onChange(event.target.value)}
                            />
                        )
                    }
                ], [
                   {
                       key: 'location',
                       validator: (value: string) => !value ? 'must pick a start location' : undefined,
                           Input: ({ value, onChange, error }: PluggableProps<any, LatLng>) => (
                            <LocationSelector
                               error={error}
                               defaultLocation={value}
                               onLocationSelect={onChange}
                            />
                       )
                   }
                ]]}
                onSubmit={async ({ name, location }: { location?: LatLng, name?: string }) => {
                    if (!name || !location) {
                        throw new Error('Must provide name and start location for hunt');
                    } else {
                        props.onConfirm(name, location);
                        props.onClose();
                    }
                    return;
                }}
                onCancel={props.onClose}
                defaultValues={{ name: undefined }}
            />
        </DialogContent>
    </Dialog>
))(undefined, { children: 'Create New Hunt' });

type Props = {
    hunts: Hunt[];
    creatorId: string | undefined;
    getData: () => void;
};

type OuterProps = {
    creatorId: string | undefined;
};

const dataFetcher = withDataGetter<OuterProps, { hunts: Hunt[]; creatorId: string | undefined }>(
    async ({ creatorId }) => creatorId ? { hunts: HuntService.getAllHunts(creatorId), creatorId } : { hunts: [], creatorId: undefined },
    { hunts: [], creatorId: undefined },
    (props: OuterProps) => props.creatorId,
);

const handleHuntCreate = (creatorId: string, setHunts: () => void) => (name: string, location: LatLng) => {
    HuntService.createHunt(name, creatorId, location);
    setHunts();
};

const Home = ({ hunts, creatorId = '', getData }: Props) => (
    <div>
        <Modal onConfirm={handleHuntCreate(creatorId, getData)}/>
        <div>
            {hunts.map((hunt: Hunt) => (
                <HuntSummary
                    key={hunt.id}
                    creatorId={creatorId}
                    huntId={hunt.id}
                    name={hunt.name}
                />
            ))}
        </div>
    </div>
);

const BaseHome = dataFetcher(Home);

const WithIdMocked = () => <BaseHome creatorId="x" />;

export default WithIdMocked;
