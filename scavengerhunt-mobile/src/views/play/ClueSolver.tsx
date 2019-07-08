import React from 'react';
import { Text } from 'react-native-ui-lib';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Clue } from '../../domain/Clue';
import ClueService from '../../services/ClueService';
import HuntLocationService from '../../services/HuntLocationService';

const solveCurrentClue = (
        setInProgressClue: (clue: Clue) => void,
        handleHuntSuccess: () => void,
        inProgressClue: Clue,
        teamId: string,
        huntId: string,
    ) => async () => {
    const { location } = inProgressClue;
    try {
        const solved = await HuntLocationService.canSolveClue(location)
        if (solved) {
            alert('Congratulations! Continue to the next clue.');
            const clue = await ClueService.getClueByNumber(huntId, inProgressClue.number + 1);
            if (!!clue) {
                await ClueService.setInProgressClue(clue.id, teamId);
                setInProgressClue(clue);
            } else {
                // possibly over
                const allClues = await ClueService.getClues(huntId);
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
        } else {
            alert('Try again.');
        }
    } catch (error) {
        console.log('ERROR', error);
    }
};

const startHunting = (setInProgressClue: (clue: Clue) => void, teamId: string, huntId: string) => async () => {
    try {
        const clue = await ClueService.getClueByNumber(huntId, 0);
        if (!!clue) {
            await ClueService.setInProgressClue(clue.id, teamId);
            setInProgressClue(clue);
        } else {
            throw new Error(`There is no starting clue for hunt with id: ${huntId}`);
        }
    } catch (error) {
        console.log('ERROR', error);
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
        ClueService.getInProgressClue(teamId)
        .then(inProgress => {
            if (!!inProgress) {
                return ClueService.getClue(inProgress.clueId)
                .then(clue => {
                    if (!!clue) {
                        setInProgressClue(clue);
                    }
                });
            }
        })
        .catch((error: any) => {
            console.log('ERROR', error);
        });
    }, [teamId]);
    if (!!inProgressClue) {
        return (
            <Card
                title={`clue #${inProgressClue.number}`}
                footer={
                    <Button onClick={solveCurrentClue(setInProgressClue, handleHuntSuccess, inProgressClue, teamId, huntId)}>
                        Solve
                    </Button>
                }
            >
                <Text>
                    {inProgressClue.text}
                </Text>
            </Card>
        );
    }
    return (
        <Button
            disabled={!huntInProgress || huntEnded}
            onClick={startHunting(setInProgressClue, teamId, huntId)}
            fullWidth={true}
        >
            {`Start ${huntName}`}
        </Button>
    );
};

export default ClueSolver;
