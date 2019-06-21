import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { RouteComponentProps } from 'react-router';
import { Clue } from '../../domain/Clue';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';
import ClueService from '../../services/ClueService';
import TextField from '@material-ui/core/TextField';
import ValidatedForm, { PluggableProps } from '../../components/ValidatedForm';
import withDataGetter from '../../containers/withDataGetter';
import withToggle from '../../containers/withToggle';

const CreateClueModal = withToggle<{ onConfirm: (text: string) => void}>(props => (
    <Dialog open={props.visible} onClose={props.onClose}>
        <DialogTitle>
            Create A Hunt
        </DialogTitle>
        <DialogContent>
            <ValidatedForm
                ActionsContainer={DialogActions}
                inputs={[[
                    {
                        key: 'clueText',
                        validator: (value: string) => !value ? 'clue must have text' : undefined,
                            Input: ({ value, onChange, error }: PluggableProps<any, string>) => (
                            <TextField
                                error={error ? true : undefined}
                                label="New Clue"
                                value={value}
                                onChange={(event: any) => onChange(event.target.value)}
                            />
                        )
                    }
                ]]}
                onSubmit={async ({ clueText }: { clueText: string | undefined }) => {
                    if (!clueText) {
                        throw new Error('Must provide text for clue');
                    } else {
                        props.onConfirm(clueText);
                        props.onClose();
                    }
                    return;
                }}
                onCancel={props.onClose}
                defaultValues={{ clueText: undefined }}
            />
        </DialogContent>
    </Dialog>
))(undefined, { children: 'Create New Clue' });

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

const HuntView = ({ hunt = {} as Hunt, clues, creatorId, getData }: Props) => (
    <div>
        Hunt {hunt.name || ''}
        <div>
            <CreateClueModal onConfirm={handleCreateClue(hunt.id || '', creatorId || '', getData)} />
            {!clues.length && 'Add some clues'}
            {clues.map((clue: Clue, index: number) => (
                <div>
                    #{index + 1}
                    {clue.text}
                </div>
            ))}
        </div>
    </div>
);

export default dataFetcher(HuntView);
