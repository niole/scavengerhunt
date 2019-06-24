import React from 'react';
import Button from '../../components/Button';
import { Clue } from '../../domain/Clue';
import ClueService from '../../services/ClueService';
import HuntLocationService from '../../services/HuntLocationService';

const solveCurrentClue = (
        setInProgressClue: (clue: Clue) => void,
        handleHuntSuccess: () => void,
        inProgressClue: Clue,
        teamId: string,
        huntId: string,
    ) => () => {
        const { location } = inProgressClue;
        HuntLocationService.canSolveClue(location)
        .then((solved: boolean) => {
            if (solved) {
                const shouldContinue = window.confirm('Congratulations! Continue to the next clue.');
                if (shouldContinue) {
                    const clue = ClueService.getClueByNumber(huntId, inProgressClue.number + 1);
                    if (!!clue) {
                        ClueService.setInProgressClue(clue.id, teamId);
                        setInProgressClue(clue);
                    } else {
                        // possibly over
                        const allClues = ClueService.getClues(huntId);
                        const sortedClues = allClues.sort((a: Clue, b: Clue) => a.number - b.number);
                        if (sortedClues[sortedClues.length - 1].number === inProgressClue.number) {
                            // it's over
                            alert('Congratulations! You finished the hunt.');
                            handleHuntSuccess();
                        } else {
                            // there's a bug
                            throw new Error(`Clue number: ${inProgressClue.number + 1} is missing.`);
                        }
                    }
                }
            } else {
                alert('Try again.');
            }
        });
};

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
    handleHuntSuccess: () => void;
};

const ClueSolver = ({
        handleHuntSuccess,
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
                <div>
                    <Button onClick={solveCurrentClue(setInProgressClue, handleHuntSuccess, inProgressClue, teamId, huntId)}>
                        Solve
                    </Button>
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
