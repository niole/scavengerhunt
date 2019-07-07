import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { NavigationScreenProp } from 'react-navigation';
import ActionBar from '../../components/ActionBar';
import MainView from '../../components/MainView';
import Button from '../../components/Button';
import { LatLng } from '../../domain/LatLng';
import { Clue, ClueUpdate } from '../../domain/Clue';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';
import ClueService from '../../services/ClueService';
import withDataGetter from '../../containers/withDataGetter';
import withToggle from '../../containers/withToggle';
import ClueSummary from './ClueSummary';
import CreateEditClueModal, { Props as CreateClueModalProps } from './CreateEditClueModal';

type NavigationProps = {
    navigation: NavigationScreenProp<{}, {
        huntId: string;
        creatorId: string;
    }>;
};

const CreateClueModal = withToggle<{ buttonProps?: any; onConfirm: CreateClueModalProps['onConfirm'] }>(props =>
    <CreateEditClueModal
        {...props}
        editing={false}
    />
)(undefined, { children: 'Add Clue' });

type OuterProps = NavigationProps;

type Props = {
    getData: () => void;
} & FetchResult & NavigationProps;

type FetchResult = {
    hunt?: Hunt;
    creatorId?: string;
    clues: Clue[];
};

const dataFetcher = withDataGetter<OuterProps, FetchResult>(
    (props: OuterProps) => Promise.all([
        HuntService.getHunt(props.navigation.getParam('huntId')),
        ClueService.getClues(props.navigation.getParam('huntId')),
    ]).then(([hunt, clues]) => ({
        hunt,
        clues,
        creatorId: props.navigation.getParam('creatorId'),
        ...props
    })),
    (props: OuterProps) => ({ clues: [], ...props }),
    (props: OuterProps) => `${props.navigation.getParam('huntId')}${props.navigation.getParam('creatorId')}`
);

const handleCreateClue = (
        huntId: string,
        creatorId: string,
        getData: () => void
    ) => async (clueText: string, location: LatLng, clueNumber: number) => {
    try {
        await ClueService.createClue(location, clueText, huntId, creatorId, clueNumber);
        getData();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const handleUpdateClue = (getData: () => void) => async (clueUpdate: ClueUpdate) => {
    try {
        await ClueService.updateClue(clueUpdate);
        getData();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const handleStartHunt = (huntId: string, dataGetter: () => void) => async () => {
    try {
        await HuntService.startHunt(huntId);
        dataGetter();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const handleEndHunt = (huntId: string, dataGetter: () => void) => async () => {
    try {
        await HuntService.endHunt(huntId);
        dataGetter();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const handleStopHunt = (huntId: string, dataGetter: () => void) => async () => {
    try {
        await HuntService.stopHunt(huntId);
        dataGetter();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const getHuntLifeCycleButtonProps = (dataGetter: () => void, hunt?: Hunt) => {
    if (!!hunt) {
        if (hunt.inProgress && !hunt.ended) {
            return {
                onClick: handleStopHunt(hunt.id, dataGetter),
                children: 'Stop',
            };
        }
        if (!hunt.inProgress && !hunt.ended) {
            return {
                onClick: handleStartHunt(hunt.id, dataGetter),
                children: 'Start',
            };
        }
    }
    return {
        children: 'Start',
        disabled: true,
    };
};

const inviteTeams = (navigation: NavigationProps['navigation'], huntId: string, creatorId: string) => () => {
    navigation.navigate('invite', { huntId, creatorId });
};

const deleteClue = (clueId: string, getData: () => void) => async () => {
    try {
        await ClueService.deleteClue(clueId);
        getData();
    } catch (error) {
        console.log('ERROR', error);
    }
};

const HuntView = ({ navigation, hunt = {} as Hunt, clues, creatorId, getData }: Props) => {
    return (
        <View>
            <ActionBar>
                {() => (
                    <CreateClueModal
                        buttonProps={{ style: { height: 40 }, fullWidth: true }}
                        onConfirm={handleCreateClue(hunt.id || '', creatorId || '', getData)}
                    />
                )}
                {props => <Button onClick={inviteTeams(navigation, hunt.id, creatorId)} {...props}>
                    Invite
                </Button>}
                {props => <Button {...getHuntLifeCycleButtonProps(getData, hunt)} {...props} />}
                {props => <Button disabled={!hunt.inProgress} onClick={handleEndHunt(hunt.id || '', getData)} {...props}>
                    End
                </Button>}
            </ActionBar>
            <MainView title={hunt.name}>
                {!clues.length && (
                    <Text>
                        Add some clues
                    </Text>
                )}
                {clues.map((clue: Clue, index: number) => (
                    <ClueSummary
                        handleDelete={deleteClue(clue.id, getData)}
                        location={clue.location}
                        key={clue.id}
                        clueNumber={clue.number}
                        text={clue.text}
                        clueId={clue.id}
                        handleClueUpdate={handleUpdateClue(getData)}
                    />
                    ))}
            </MainView>
        </View>
    );
};

export default dataFetcher(HuntView);
