import React from 'react';
import { View } from 'react-native';
import Button from '../../components/Button';
import TextField from '../../components/TextField';

type Props = {
    onChange: (name: string, email: string) => void;
};

const CreateTeamMemberInput = ({ onChange }: Props) => {
    const [name, setName] = React.useState();
    const [email, setEmail] = React.useState();
    return (
        <View>
            <TextField
                label="Name"
                value={name}
                onChange={(event: any) => setName(event.nativeEvent.text)}
            />
            <TextField
                label="Email"
                value={email}
                onChange={(event: any) => setEmail(event.nativeEvent.text)}
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
        </View>
    );
};

export default CreateTeamMemberInput;
