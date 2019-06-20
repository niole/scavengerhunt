import React from 'react';

import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';

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

type State = {
    hunts: Hunt[];
};

class Home extends React.PureComponent<{}, State> {
    state = {
        hunts: [],
    };

    componentDidMount() {
        this.setState({ hunts: HuntService.getAllHunts('x') });
    }

    handleHuntCreate = (name: string) => {
        HuntService.createHunt(name, 'x');
        this.setState({ hunts: HuntService.getAllHunts('x') });
    }

    render() {
        const { hunts } = this.state;
        return (
            <div>
                <Modal onConfirm={this.handleHuntCreate}/>
                <div>
                    {hunts.map((hunt: Hunt) => (
                        <HuntSummary
                            name={hunt.name}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Home;
