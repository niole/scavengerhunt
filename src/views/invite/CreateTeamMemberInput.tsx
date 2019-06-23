import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

type Props = {
    onChange: (name: string, email: string) => void;
};

const CreateTeamMemberInput = ({ onChange }: Props) => {
    const [name, setName] = React.useState();
    const [email, setEmail] = React.useState();
    return (
        <div>
            <TextField
                label="Name"
                value={name}
                onChange={(event: any) => setName(event.target.value)}
            />
            <TextField
                label="Email"
                value={email}
                onChange={(event: any) => setEmail(event.target.value)}
            />
            <Button
                disabled={!name || !email}
                onClick={() => {
                    onChange(name, email)
                    setName('');
                    setEmail('');
                }}
            >
                Submit
            </Button>
        </div>
    );
};

export default CreateTeamMemberInput;
