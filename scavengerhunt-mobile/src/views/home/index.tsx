import * as React from "react";
import { Platform } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { View } from "react-native-ui-lib";
import { Google } from 'expo';
import { LatLng } from '../../domain/LatLng';
import { Creator } from '../../domain/Creator';
import { Hunt } from '../../domain/Hunt';
import CreatorService from '../../services/CreatorService';
import HuntService from '../../services/HuntService';
import withDataGetter from '../../containers/withDataGetter';
import ActionBar from '../../components/ActionBar';
import Button from '../../components/Button';
import MainView from '../../components/MainView';
import Dialog from '../../components/Dialog';
import TextField from '../../components/TextField';
import HuntSummary from './HuntSummary';
import ValidatedForm, { PluggableProps } from '../../components/ValidatedForm';
import LocationSelector from '../../components/LocationSelector';
import withToggle from '../../containers/withToggle';

const Modal = withToggle<{ buttonProps?: any; onConfirm: (name: string, location: LatLng) => void}>(props => (
    <Dialog open={props.visible} onClose={props.onClose} title="Create A Hunt">
        <View paddingT-24>
            <ValidatedForm
                ActionsContainer={View}
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
                                onChange={(event: any) => onChange(event.nativeEvent.text)}
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
        </View>
    </Dialog>
))(undefined, { children: 'Create New Hunt' });

type NavigationProps = {
    navigation: NavigationScreenProp<{}, {}>;
};

type Props = {
    hunts: Hunt[];
    creatorId: string;
    creatorName: string;
    getData: () => void;
} & NavigationProps;

type OuterProps = {
    creatorId: string;
    creatorName: string;
} & NavigationProps;

const dataFetcher = withDataGetter<OuterProps, { hunts: Hunt[]; creatorId: string; creatorName: string }>(
    async ({ creatorId, ...rest }) => ({ hunts: HuntService.getAllHunts(creatorId), creatorId, ...rest }),
    undefined,
    (props: OuterProps) => props.creatorId,
);

const handleHuntCreate = (creatorId: string, setHunts: () => void) => (name: string, location: LatLng) => {
    HuntService.createHunt(name, creatorId, location);
    setHunts();
};

const handleNavigate = (navigation: NavigationProps['navigation']) => (huntId: string, creatorId: string) => {
    navigation.navigate('hunt', { huntId, creatorId });
};

const removeHunt = (huntId: string, getData: () => void) => () => {
    HuntService.deleteHunt(huntId);
    getData();
};

const Home = ({ navigation, creatorName, hunts, creatorId, getData }: Props) => (
    <MainView title={`Welcome ${creatorName}`}>
        <ActionBar>
            {props => <Modal onConfirm={handleHuntCreate(creatorId, getData)} buttonProps={props}/>}
            {props => <Button {...props} onClick={() => navigation.navigate('invitations', { creatorId })}>
                View Invitations
            </Button>}
        </ActionBar>
        <View paddingT-24>
            {hunts.map((hunt: Hunt) => (
                <HuntSummary
                    key={hunt.id}
                    onClick={handleNavigate(navigation)}
                    creatorId={creatorId}
                    huntId={hunt.id}
                    name={hunt.name}
                    removeHunt={removeHunt(hunt.id, getData)}
                />
            ))}
        </View>
    </MainView>
);

const BaseHome = dataFetcher(Home);

const signIn = (setCreator: (creator: Creator) => void) => async () => {
    try {
        const result = await Google.logInAsync({
            clientId: Platform.OS === 'android' ? process.env.ANDROID_AUTH_CLIENT_ID : process.env.IOS_AUTH_CLIENT_ID,
            scopes: ['profile', 'email'],
        });
        if (result.type === 'success') {
            const { user } = result;
            const foundCreator = await CreatorService.getCreator(user.email);
            if (foundCreator) {
                setCreator(foundCreator);
            } else if (user) {
                const creator = await CreatorService.createCreator(user.email, user.name, user.id);
                setCreator(creator);
            }
        } else {
            alert('Woops, couldn\'t sign you in');
        }
    } catch (e) {
        console.log("error", e)
    }
};

export default (props: NavigationProps) => {
    const [creator, setCreator] = React.useState(undefined);
    if (!creator) {
        return (
            <Button onClick={signIn(setCreator)}>
                Sign In
            </Button>
        );
    }
    return (
        <BaseHome creatorId={creator.id} creatorName={creator.name} {...props} />
    );
};

