import React from 'react';

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
import withToggle from '../../containers/withToggle';

const Modal = withToggle<{ onConfirm: (name: string) => void}>(props => (
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
                                value={value}
                                onChange={(event: any) => onChange(event.target.value)}
                            />
                        )
                    }
                ]]}
                onSubmit={async ({ name }: { name: string | undefined }) => {
                    if (!name) {
                        throw new Error('Must provide name for hunt');
                    } else {
                        props.onConfirm(name);
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
    creatorId: string;
    getData: () => void;
};

const dataFetcher = withDataGetter<{ creatorId: string }, { hunts: Hunt[]; creatorId: string }>(
    async ({ creatorId }) => ({ hunts: HuntService.getAllHunts(creatorId), creatorId }),
    { creatorId: '', hunts: [] },
    props => props.creatorId,
);

const handleHuntCreate = (creatorId: string, setHunts: () => void) => (name: string) => {
    HuntService.createHunt(name, creatorId);
    setHunts();
};

const Home = ({ hunts, creatorId, getData }: Props) => (
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

export default dataFetcher(Home);
