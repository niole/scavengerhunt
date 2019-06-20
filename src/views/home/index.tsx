import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ValidatedForm from '../../components/ValidatedForm';
import withToggle from '../../containers/withToggle';

const Modal = withToggle<{ onConfirm: (name: string) => void}>(props => (
    <Dialog open={props.visible} onClose={props.onClose}>
        <DialogTitle>
            Create A Hunt
        </DialogTitle>
        <div>
            <ValidatedForm
                inputs={[[
                    {
                        key: 'name',
                        validator: (value: string) => !value ? 'must have name' : undefined,
                        Input: ({ value, onChange }: { value: string | undefined, onChange: (event: any) => void}) => (
                            <TextField
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
                    }
                    return;
                }}
                onCancel={props.onClose}
                defaultValues={{ name: undefined }}
            />
        </div>
    </Dialog>
))();

const Home = () => (
    <div>
        <Modal onConfirm={(name: string) => console.log(name)}/>
    </div>
);

export default Home;
