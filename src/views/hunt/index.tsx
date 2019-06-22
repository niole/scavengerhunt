import React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import Button from '@material-ui/core/Button';
import { LatLng } from '../../domain/LatLng';
import { Clue, ClueUpdate } from '../../domain/Clue';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';
import ClueService from '../../services/ClueService';
import withDataGetter from '../../containers/withDataGetter';
import withToggle from '../../containers/withToggle';
import ClueSummary from './ClueSummary';
import CreateEditClueModal from './CreateEditClueModal';

const CreateClueModal = withToggle<{ onConfirm: (text: string, location: LatLng) => void}>(props =>
    <CreateEditClueModal
        {...props}
        editing={false}
    />
)(undefined, { children: 'Create New Clue' });

type OuterProps = RouteComponentProps<{
    huntId: string;
    creatorId: string;
}>;

type Props = {
    getData: () => void;
} & FetchResult;

type FetchResult = {
    hunt?: Hunt;
    creatorId?: string;
    clues: Clue[];
};

const dataFetcher = withDataGetter<OuterProps, FetchResult>(
    async (props: OuterProps) => ({
        hunt: HuntService.getHunt(props.match.params.huntId),
        clues: ClueService.getClues(props.match.params.huntId),
        creatorId: props.match.params.creatorId,
    }),
    { clues: [] },
    (props: OuterProps) => `${props.match.params.huntId}${props.match.params.creatorId}`
);

const handleCreateClue = (
        huntId: string,
        creatorId: string,
        getData: () => void
    ) => (clueText: string, location: LatLng) => {
    ClueService.createClue(location, clueText, huntId, creatorId);
    getData();
};

const handleUpdateClue = (getData: () => void) => (clueUpdate: ClueUpdate) => {
    ClueService.updateClue(clueUpdate);
    getData();
};

const handleStartHunt = (huntId: string, dataGetter: () => void) => () => {
    HuntService.startHunt(huntId);
    dataGetter();
};

const handleEndHunt = (huntId: string, dataGetter: () => void) => () => {
    HuntService.endHunt(huntId);
    dataGetter();
};

const handleStopHunt = (huntId: string, dataGetter: () => void) => () => {
    HuntService.stopHunt(huntId);
    dataGetter();
};

const getHuntLifeCycleButtonProps = (dataGetter: () => void, hunt?: Hunt) => {
    if (!!hunt) {
        if (hunt.inProgress && !hunt.ended) {
            return {
                onClick: handleStopHunt(hunt.id, dataGetter),
                children: 'Stop Hunt',
            };
        }
        if (!hunt.inProgress && !hunt.ended) {
            return {
                onClick: handleStartHunt(hunt.id, dataGetter),
                children: 'Start Hunt',
            };
        }
    }
    return {
        children: 'Start Hunt',
        disabled: true,
    };
};

const HuntView = ({ hunt = {} as Hunt, clues, creatorId, getData }: Props) => (
    <div>
        <h1>Hunt</h1> <h2>{hunt.name || ''}</h2>
        <div>
            <div>
                <CreateClueModal
                    onConfirm={handleCreateClue(hunt.id || '', creatorId || '', getData)}
                />
                <Button>
                    <Link to={`/invite/${hunt.id}/${creatorId}`}>
                        Invite Teams
                    </Link>
                </Button>
                <Button {...getHuntLifeCycleButtonProps(getData, hunt)} />
                <Button disabled={!hunt.inProgress} onClick={handleEndHunt(hunt.id || '', getData)}>
                    End Hunt
                </Button>
            </div>
            {!clues.length && 'Add some clues'}
            {clues.map((clue: Clue, index: number) => (
                <ClueSummary
                    location={clue.location}
                    key={clue.id}
                    name={`#${index + 1}`}
                    text={clue.text}
                    clueId={clue.id}
                    handleClueUpdate={handleUpdateClue(getData)}
                />
            ))}
        </div>
    </div>
);

export default dataFetcher(HuntView);
