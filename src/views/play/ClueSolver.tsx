import React from 'react';
import Button from '@material-ui/core/Button';
import { Clue } from '../../domain/Clue';
import ClueService from '../../services/ClueService';

const startHunting = (setInProgressClue: (clue: Clue) => void, teamId: string, huntId: string) => () => {
    const clue = ClueService.getClueByNumber(huntId, 0);
    if (!!clue) {
        ClueService.setInProgressClue(clue.id, teamId);
        setInProgressClue(clue);
    } else {
        throw new Error(`There is no starting clue for hunt with id: ${huntId}`);
    }
};

type Props = {
    huntInProgress: boolean;
    huntEnded: boolean;
    huntName: string;
    huntId: string;
    teamId: string;
    memberId: string;
};

const ClueSolver = ({
        huntInProgress,
        huntEnded,
        huntName,
        huntId,
        teamId,
        memberId,
    }: Props) => {
    const [inProgressClue, setInProgressClue] = React.useState();
    React.useEffect(() => {
        const inProgress = ClueService.getInProgressClue(teamId)
        if (!!inProgress) {
            const clue = ClueService.getClue(inProgress.clueId);
            if (!!clue) {
                setInProgressClue(clue);
            }
        }
    }, [teamId]);
    if (!!inProgressClue) {
        return (
            <div>
                <div>
                    clue #{inProgressClue.number}
                </div>
                <div>
                    {inProgressClue.text}
                </div>
            </div>
        );
    }
    return (
        <Button
            disabled={!huntInProgress || huntEnded}
            onClick={startHunting(setInProgressClue, teamId, huntId)}
        >
            Start {huntName}
        </Button>
    );
};

export default ClueSolver;
