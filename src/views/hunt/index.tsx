import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Clue } from '../../domain/Clue';
import { Hunt } from '../../domain/Hunt';
import HuntService from '../../services/HuntService';
import ClueService from '../../services/ClueService';
import withDataGetter from '../../containers/withDataGetter';

type OuterProps = RouteComponentProps<{
    huntId: string;
    creatorId: string;
}>;

type Props = {
    hunt?: Hunt;
    creatorId?: string;
    clues: Clue[];
};

const dataFetcher = withDataGetter<OuterProps, Props>(
    async (props: OuterProps) => ({
        hunt: HuntService.getHunt(props.match.params.huntId),
        clues: ClueService.getClues(props.match.params.huntId),
        creatorId: props.match.params.creatorId,
    }),
    { clues: [] },
    (props: OuterProps) => `${props.match.params.huntId}${props.match.params.creatorId}`
);

const HuntView = ({ hunt = {} as Hunt, clues, creatorId }: Props) => (
    <div>
        Hunt {hunt.name || ''}
        <div>
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
