import * as React from "react";
import { NavigationScreenProp } from 'react-navigation';
import { View } from "react-native-ui-lib";
import { LatLng } from '../../domain/LatLng';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';

import withDataGetter from '../../containers/withDataGetter';
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
    creatorId: string | undefined;
    getData: () => void;
} & NavigationProps;

type OuterProps = {
    creatorId: string | undefined;
} & NavigationProps;

const dataFetcher = withDataGetter<OuterProps, { hunts: Hunt[]; creatorId: string | undefined }>(
    async ({ creatorId, ...rest }) => creatorId ?
        { hunts: HuntService.getAllHunts(creatorId), creatorId, ...rest } :
        { hunts: [], creatorId: undefined,  ...rest },
    () => ({ hunts: [], creatorId: undefined }),
    (props: OuterProps) => props.creatorId,
);

const handleHuntCreate = (creatorId: string, setHunts: () => void) => (name: string, location: LatLng) => {
    HuntService.createHunt(name, creatorId, location);
    setHunts();
};

const handleNavigate = (navigation: NavigationProps['navigation']) => (huntId: string, creatorId: string) => {
    navigation.navigate('hunt', { huntId, creatorId });
};

const Home = ({ navigation, hunts, creatorId = '', getData }: Props) => (
    <MainView>
        <Modal onConfirm={handleHuntCreate(creatorId, getData)} buttonProps={{ fullWidth: true }}/>
        <View paddingT-24>
            {hunts.map((hunt: Hunt) => (
                <HuntSummary
                    key={hunt.id}
                    onClick={handleNavigate(navigation)}
                    creatorId={creatorId}
                    huntId={hunt.id}
                    name={hunt.name}
                />
            ))}
        </View>
    </MainView>
);

const BaseHome = dataFetcher(Home);

const WithIdMocked = (props: NavigationProps) => <BaseHome creatorId="x" {...props} />;

export default WithIdMocked;

