import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Clue, ClueUpdate } from '../../domain/Clue';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';
import ClueService from '../../services/ClueService';
import withDataGetter from '../../containers/withDataGetter';
import withToggle from '../../containers/withToggle';
import ClueSummary from './ClueSummary';
import CreateEditClueModal from './CreateEditClueModal';

const CreateClueModal = withToggle<{ onConfirm: (text: string) => void}>(props =>
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

const handleCreateClue = (huntId: string, creatorId: string, getData: () => void) => (clueText: string) => {
    ClueService.createClue(clueText, huntId, creatorId);
    getData();
};

const handleUpdateClue = (getData: () => void) => (clueUpdate: ClueUpdate) => {
    ClueService.updateClue(clueUpdate);
    getData();
};

const HuntView = ({ hunt = {} as Hunt, clues, creatorId, getData }: Props) => (
    <div>
        Hunt {hunt.name || ''}
        <div>
            <CreateClueModal onConfirm={handleCreateClue(hunt.id || '', creatorId || '', getData)} />
            {!clues.length && 'Add some clues'}
            {clues.map((clue: Clue, index: number) => (
                <ClueSummary
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
